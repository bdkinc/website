import { getCollection } from 'astro:content';
import {
  createContentClient,
  type ContentEntry,
  type CollectionName,
  type PageKey,
  type PageData,
} from '@bdkinc/content';

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
export interface ContentContext {
  mode: 'preview';
  publicPath: string;
  target: {
    kind: 'page' | 'collection' | 'settings';
    key: string;
    postId: number;
  };
  snapshot: Awaited<
    ReturnType<ReturnType<typeof createContentClient>['preview']['getSnapshot']>
  >;
}
export interface ContentProps {
  contentContext?: ContentContext;
  publicPath?: string;
}

// Astro's published store is slug-based; only live WP records carry a database ID.
export type ContentRecord<K extends CollectionName> = Omit<
  ContentEntry<K>,
  'wpId'
> & { wpId?: number };

/** Only the authorized snapshot overlays published data. No request/global mutable state. */
export async function getContentCollection<K extends CollectionName>(
  name: K,
  context?: ContentContext
): Promise<ContentRecord<K>[]> {
  const client = wordpressClient();
  // Dev reads live published content so a CMS publish can be reviewed without restarting Vite.
  const published =
    context || import.meta.env.DEV
      ? await client.getCollection(name)
      : ((await getCollection(name)).map((entry) => ({
          id: entry.id,
          data: entry.data,
          ...(entry.rendered?.html
            ? { body: { format: 'html' as const, html: entry.rendered.html } }
            : {}),
        })) as ContentRecord<K>[]);
  if (context?.target.kind === 'collection' && context.target.key === name) {
    const draft = client.preview.mapEntry(name, context.snapshot);
    return [
      ...published.filter(
        (entry) => entry.id !== draft.id && entry.wpId !== draft.wpId
      ),
      draft,
    ];
  }
  return published;
}
export async function getContentEntry<K extends CollectionName>(
  name: K,
  id: string,
  context?: ContentContext
) {
  return (await getContentCollection(name, context)).find(
    (entry) => entry.id === id
  );
}
export async function getPageCopy<K extends PageKey>(
  key: K,
  context?: ContentContext
): Promise<PageData<K>> {
  const client = wordpressClient();
  if (context?.target.kind === 'page' && context.target.key === key)
    return client.preview.mapPage(key, context.snapshot);
  return client.getPage(key);
}
export async function getSettings(context?: ContentContext) {
  const client = wordpressClient();
  return context?.target.kind === 'settings'
    ? client.preview.mapSettings(context.snapshot)
    : client.getSettings();
}
