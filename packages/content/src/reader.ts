// Server-only: create one reader per render; never share it across requests.
import type { ContentClient, ContentEntry } from './client.ts';
import type { CollectionName } from './schemas.ts';
import type { PageKey, PageData, SiteSettings } from './editorial.ts';
import type { PreviewContext } from './preview.ts';

/** Astro's published store has slug identity but may not retain a WordPress ID. */
export type ContentRecord<K extends CollectionName> = Omit<ContentEntry<K>, 'wpId'> & {
  wpId?: number;
};

export interface ContentSource {
  getCollection<K extends CollectionName>(key: K): Promise<ContentRecord<K>[]>;
  getPage<K extends PageKey>(key: K): Promise<PageData<K>>;
  getSettings(): Promise<SiteSettings>;
}
export type ContentReader = ContentSource;

export function createContentReader(options: {
  published: ContentSource;
  preview?: {
    context: PreviewContext;
    mapper: Pick<ContentClient['preview'], 'mapEntry' | 'mapPage' | 'mapSettings'>;
  };
}): ContentReader {
  const { published } = options;
  // Capture the authorized identity/data, not a caller-owned mutable context.
  const context = options.preview ? structuredClone(options.preview.context) : undefined;
  const mapper = options.preview?.mapper;
  const collections = new Map<string, Promise<unknown>>();
  const pages = new Map<string, Promise<unknown>>();
  const settings = new Map<string, Promise<unknown>>();

  async function read<T>(cache: Map<string, Promise<unknown>>, key: string, acquire: () => Promise<T>): Promise<T> {
    // Each map/key is used with exactly one result type by the methods below.
    let pending = cache.get(key) as Promise<T> | undefined;
    if (!pending) {
      pending = Promise.resolve().then(acquire).then(value => structuredClone(value)).catch(error => {
        cache.delete(key);
        throw error;
      });
      cache.set(key, pending);
    }
    return structuredClone(await pending);
  }

  return {
    getCollection<K extends CollectionName>(key: K) {
      return read(collections, key, async () => {
        const entries = await published.getCollection(key);
        if (context?.target.kind !== 'collection' || context.target.key !== key || !mapper)
          return entries;
        const draft = mapper.mapEntry(key, context.snapshot);
        return [
          ...entries.filter(entry => entry.id !== draft.id &&
            !(draft.wpId !== undefined && entry.wpId !== undefined && entry.wpId === draft.wpId)),
          draft,
        ];
      });
    },
    getPage<K extends PageKey>(key: K) {
      return read(pages, key, async () =>
        context?.target.kind === 'page' && context.target.key === key && mapper
          ? mapper.mapPage(key, context.snapshot)
          : published.getPage(key));
    },
    getSettings() {
      return read(settings, 'site', async () =>
        context?.target.kind === 'settings' && context.target.key === 'site' && mapper
          ? mapper.mapSettings(context.snapshot)
          : published.getSettings());
    },
  };
}
