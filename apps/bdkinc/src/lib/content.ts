import { getCollection, getEntry } from 'astro:content';
import { pageSchemas, settingsSchema, type PageKey, type PageData, type SiteSettings } from '@bdkinc/content/editorial';
import { createContentClient, type CollectionName } from '@bdkinc/content';
import {
  createContentReader,
  type ContentReader,
  type ContentRecord,
  type ContentSource,
} from '@bdkinc/content/reader';
import type { PreviewContext } from '@bdkinc/content/preview';

export type ContentContext = PreviewContext;
export type { ContentReader, ContentRecord } from '@bdkinc/content/reader';

export function wordpressClient() {
  const url = process.env.WORDPRESS_URL || import.meta.env.WORDPRESS_URL;
  if (!url)
    throw new Error(
      'WORDPRESS_URL is required; editorial defaults are not a runtime fallback.'
    );
  return createContentClient({
    url,
    username:
      process.env.WORDPRESS_USERNAME || import.meta.env.WORDPRESS_USERNAME,
    applicationPassword:
      process.env.WORDPRESS_APPLICATION_PASSWORD ||
      import.meta.env.WORDPRESS_APPLICATION_PASSWORD,
  });
}

/** Server-only props: readers are supplied only when importing a page renderer. */
export interface ContentProps {
  contentContext?: ContentContext;
  publicPath?: string;
  reader?: ContentReader;
}

/** One explicit reading scope per render, with the existing transport policy. */
export function createAppContentReader(context?: ContentContext): ContentReader {
  const client = context || import.meta.env.DEV ? wordpressClient() : undefined;
  const published: ContentSource = {
    async getCollection<K extends CollectionName>(name: K): Promise<ContentRecord<K>[]> {
      // Dev and preview read WP live; production reads Astro's published store.
      if (client) return client.getCollection(name);
      return (await getCollection(name)).map((entry) => ({
        id: entry.id,
        data: entry.data,
        ...(entry.rendered?.html
          ? { body: { format: 'html' as const, html: entry.rendered.html } }
          : {}),
      })) as ContentRecord<K>[];
    },
    async getPage<K extends PageKey>(key: K): Promise<PageData<K>> {
      if (client) return client.getPage(key);
      const entry = await getEntry('marketingPages', key);
      if (!entry || entry.data.key !== key)
        throw new Error(`Published marketing page snapshot is missing: ${key}`);
      return pageSchemas[key].parse(entry.data.data) as PageData<K>;
    },
    async getSettings(): Promise<SiteSettings> {
      if (client) return client.getSettings();
      const entry = await getEntry('siteSettings', 'site');
      if (!entry) throw new Error('Published site settings snapshot is missing: site');
      return settingsSchema.parse(entry.data);
    },
  };
  return createContentReader({
    published,
    ...(context && client ? { preview: { context, mapper: client.preview } } : {}),
  });
}
