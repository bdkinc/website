// Server-only entry point: do not import from hydrated components.
import { Buffer } from 'node:buffer';
import { z } from 'zod/v4';
import {
  collectionSchemas,
  type CollectionName,
  type CollectionData,
} from './schemas.ts';
import {
  pageSchemas,
  settingsSchema,
  type PageKey,
  type PageData,
  type SiteSettings,
} from './editorial.ts';

export const collectionEndpoints = {
  services: 'services',
  blog: 'posts',
  locations: 'locations',
  testimonials: 'testimonials',
  partners: 'partners',
  pseoServices: 'pseo-services',
  pseoIndustries: 'pseo-industries',
} as const;
export interface HtmlBody {
  format: 'html';
  html: string;
  /** Archival source only; never prefer this over live WP edits. */
  originalMarkdown?: string;
}
export interface ContentEntry<K extends CollectionName> {
  id: string;
  wpId: number;
  data: CollectionData<K>;
  body?: HtmlBody;
}
export interface ContentClientOptions {
  url: string;
  username?: string;
  applicationPassword?: string;
  timeoutMs?: number;
  /** Public origin must actually serve WP uploads. Defaults to the phase-2 proxy contract. */
  media?:
    { mode: 'public'; origin: string } | { mode: 'proxy'; prefix?: string };
}
const wpRecord = z.object({
  id: z.number(),
  slug: z.string().min(1),
  status: z.string(),
  bdk_data: z.record(z.string(), z.unknown()),
  content: z.object({ rendered: z.string() }).optional(),
  bdk_original_markdown: z.string().optional(),
  /** Preview snapshots only: the CMS admin origin the preview links back to. */
  bdk_admin: z.url({ protocol: /^https?$/ }).optional(),
});
type WPRecord = z.infer<typeof wpRecord>;

export function createContentClient(options: ContentClientOptions) {
  if (typeof window !== 'undefined')
    throw new Error('WordPress content client is server-only.');
  const origin = new URL(options.url);
  if (
    !['http:', 'https:'].includes(origin.protocol) ||
    origin.username ||
    origin.password ||
    origin.search ||
    origin.hash
  )
    throw new Error('Invalid WordPress origin.');
  if (Boolean(options.username) !== Boolean(options.applicationPassword))
    throw new Error(
      'Both preview username and application password are required.'
    );
  if (
    options.applicationPassword &&
    origin.protocol !== 'https:' &&
    !['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)
  )
    throw new Error(
      'WordPress credentials require HTTPS (except local loopback).'
    );
  const base = `${origin.href.replace(/\/$/, '')}/wp-json/wp/v2/`;
  const uploads = new URL(
    'wp-content/uploads/',
    `${origin.href.replace(/\/$/, '')}/`
  );
  const media = options.media ?? { mode: 'proxy' as const };
  const mediaBase =
    media.mode === 'public'
      ? new URL('wp-content/uploads/', `${media.origin.replace(/\/$/, '')}/`)
          .href
      : `${(media.prefix ?? '/api/cms-media').replace(/\/$/, '')}/`;
  if (media.mode === 'proxy' && !/^\/(?!\/)[^?#]*\/$/.test(mediaBase))
    throw new Error('Media proxy prefix must be a site-relative path.');
  if (media.mode === 'public' && !/^https?:\/\//i.test(mediaBase))
    throw new Error('Public media origin must use HTTP(S).');
  const mapMedia = (value: string): string => {
    // Only rewrite this installation's uploads, never arbitrary URLs or app-owned assets.
    return value.split(uploads.href).join(mediaBase);
  };
  function normalizeMedia(value: unknown): unknown {
    if (value instanceof Date) return value;
    if (typeof value === 'string') return mapMedia(value);
    if (Array.isArray(value)) return value.map(normalizeMedia);
    if (value && typeof value === 'object')
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, normalizeMedia(item)])
      );
    return value;
  }
  async function request(
    endpoint: string,
    params: Record<string, string>,
    preview = false
  ) {
    const url = new URL(endpoint, base);
    for (const [key, value] of Object.entries(params))
      url.searchParams.set(key, value);
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (preview) {
      if (!options.username || !options.applicationPassword)
        throw new Error('Preview requires server credentials.');
      headers.Authorization = `Basic ${Buffer.from(`${options.username}:${options.applicationPassword}`).toString('base64')}`;
    }
    const response = await fetch(url, {
      headers,
      redirect: 'error',
      signal: AbortSignal.timeout(options.timeoutMs ?? 15000),
      cache: 'no-store',
    });
    if (!response.ok)
      throw new Error(
        `WordPress ${endpoint} returned HTTP ${response.status}.`
      );
    return { response, data: (await response.json()) as unknown };
  }
  async function list(
    endpoint: string,
    extra: Record<string, string> = {},
    preview = false
  ): Promise<WPRecord[]> {
    const records: WPRecord[] = [];
    let pages = 1;
    for (let page = 1; page <= pages; page++) {
      const { response, data } = await request(
        endpoint,
        {
          per_page: '100',
          page: String(page),
          orderby: 'id',
          order: 'asc',
          status: preview ? 'any' : 'publish',
          context: preview ? 'edit' : 'view',
          ...extra,
        },
        preview
      );
      const totalPages = response.headers.get('X-WP-TotalPages');
      if (totalPages === null || !/^\d+$/.test(totalPages))
        throw new Error(`WordPress ${endpoint} omitted pagination metadata.`);
      pages = Number(totalPages);
      records.push(...z.array(wpRecord).parse(data));
    }
    if (new Set(records.map((record) => record.slug)).size !== records.length)
      throw new Error(`Duplicate WordPress slugs in ${endpoint}.`);
    return records;
  }
  function mapEntry<K extends CollectionName>(
    name: K,
    record: WPRecord
  ): ContentEntry<K> {
    const raw = { ...record.bdk_data };
    if (name === 'blog') {
      if (typeof raw.pubDate !== 'string')
        throw new Error(`Missing publication date for ${record.slug}.`);
      raw.pubDate = new Date(raw.pubDate);
      raw.draft = record.status !== 'publish';
    }
    const data = collectionSchemas[name].parse(
      normalizeMedia(raw)
    ) as CollectionData<K>;
    if (name === 'blog' && !record.content)
      throw new Error(`Missing blog body for ${record.slug}.`);
    return {
      id: record.slug,
      wpId: record.id,
      data,
      ...(name === 'blog'
        ? {
            body: {
              format: 'html' as const,
              html: mapMedia(record.content?.rendered ?? ''),
              originalMarkdown: record.bdk_original_markdown,
            },
          }
        : {}),
    };
  }
  async function page<K extends PageKey>(
    key: K,
    preview = false
  ): Promise<PageData<K>> {
    if (!(key in pageSchemas)) throw new Error(`Unknown fixed page: ${key}`);
    const records = await list('marketing-pages', { slug: key }, preview);
    if (records.length !== 1)
      throw new Error(`Expected one WordPress page: ${key}.`);
    return pageSchemas[key].parse(
      normalizeMedia(records[0].bdk_data)
    ) as PageData<K>;
  }
  return {
    async getCollection<K extends CollectionName>(
      name: K
    ): Promise<ContentEntry<K>[]> {
      const records = await list(
        collectionEndpoints[name],
        name === 'blog' ? { bdk_managed: 'true' } : {}
      );
      if (records.some((record) => record.status !== 'publish'))
        throw new Error(
          'WordPress returned non-public content to a public request.'
        );
      return records.map((record) => mapEntry(name, record));
    },
    getPage: <K extends PageKey>(key: K) => page(key),
    async getSettings(): Promise<SiteSettings> {
      const records = await list('site-settings', { slug: 'site' });
      if (records.length !== 1)
        throw new Error('Expected one published site settings record.');
      return settingsSchema.parse(normalizeMedia(records[0].bdk_data));
    },
    preview: {
      /** Immutable editor snapshot. Token is verified by Astro and WordPress, never a public read. */
      async getSnapshot(token: string) {
        if (!options.username || !options.applicationPassword)
          throw new Error('Preview requires server credentials.');
        const response = await fetch(
          new URL('../../bdk/v1/preview-snapshot', base),
          {
            headers: {
              Authorization: `Basic ${Buffer.from(`${options.username}:${options.applicationPassword}`).toString('base64')}`,
              'X-BDK-Preview': token,
            },
            redirect: 'error',
            cache: 'no-store',
            signal: AbortSignal.timeout(options.timeoutMs ?? 15000),
          }
        );
        if (!response.ok)
          throw new Error(
            `WordPress preview returned HTTP ${response.status}.`
          );
        return wpRecord.parse(await response.json());
      },
      mapEntry,
      mapPage<K extends PageKey>(key: K, record: WPRecord): PageData<K> {
        return pageSchemas[key].parse(
          normalizeMedia(record.bdk_data)
        ) as PageData<K>;
      },
      mapSettings(record: WPRecord): SiteSettings {
        return settingsSchema.parse(normalizeMedia(record.bdk_data));
      },
      async getEntry<K extends CollectionName>(
        name: K,
        wpId: number
      ): Promise<ContentEntry<K>> {
        if (!Number.isSafeInteger(wpId) || wpId < 1)
          throw new Error('Invalid preview post ID.');
        const { data } = await request(
          `${collectionEndpoints[name]}/${wpId}`,
          { context: 'edit' },
          true
        );
        return mapEntry(name, wpRecord.parse(data));
      },
      getPage: <K extends PageKey>(key: K) => page(key, true),
    },
    normalizeMediaUrl: mapMedia,
  };
}
export type ContentClient = ReturnType<typeof createContentClient>;
