import { getCollection } from 'astro:content';
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
  const client = wordpressClient();
  const published: ContentSource = {
    async getCollection<K extends CollectionName>(name: K): Promise<ContentRecord<K>[]> {
      // Dev and preview read WP live; production reads Astro's published store.
      if (context || import.meta.env.DEV) return client.getCollection(name);
      return (await getCollection(name)).map((entry) => ({
        id: entry.id,
        data: entry.data,
        ...(entry.rendered?.html
          ? { body: { format: 'html' as const, html: entry.rendered.html } }
          : {}),
      })) as ContentRecord<K>[];
    },
    getPage: client.getPage,
    getSettings: client.getSettings,
  };
  return createContentReader({
    published,
    ...(context ? { preview: { context, mapper: client.preview } } : {}),
  });
}
