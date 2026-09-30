import type { Loader } from 'astro/loaders';
import { createContentClient, pageSchemas, type PageKey, type CollectionName } from '@bdkinc/content';

function publishedClient() {
  const url = import.meta.env.WORDPRESS_URL || process.env.WORDPRESS_URL;
  if (!url) throw new Error('WORDPRESS_URL is required for published content.');
  return createContentClient({ url });
}

export function wordpressPagesLoader(): Loader {
  return {
    name: 'wordpress-marketing-pages',
    async load({ store, parseData, generateDigest }) {
      const client = publishedClient();
      const entries = await Promise.all(
        (Object.keys(pageSchemas) as PageKey[]).map(async (key) => ({
          id: key,
          data: await parseData({ id: key, data: { key, data: await client.getPage(key) } }),
        }))
      );
      store.clear();
      for (const entry of entries) {
        store.set({ ...entry, digest: generateDigest(entry.data) });
      }
    },
  };
}

export function wordpressSettingsLoader(): Loader {
  return {
    name: 'wordpress-site-settings',
    async load({ store, parseData, generateDigest }) {
      const data = await parseData({ id: 'site', data: await publishedClient().getSettings() });
      store.clear();
      store.set({ id: 'site', data, digest: generateDigest(data) });
    },
  };
}

export function wordpressLoader(name: CollectionName): Loader {
  return {
    name: `wordpress-${name}`,
    async load({ store, parseData, generateDigest, logger }) {
      const entries = await publishedClient().getCollection(name);
      // Fetch/validate everything before replacing the published snapshot.
      const parsed = await Promise.all(
        entries.map(async (entry) => ({
          entry,
          data: await parseData({ id: entry.id, data: entry.data }),
        }))
      );
      store.clear();
      for (const { entry, data } of parsed) {
        store.set({
          id: entry.id,
          data,
          digest: generateDigest(JSON.stringify(entry)),
          ...(entry.body
            ? { body: entry.body.html, rendered: { html: entry.body.html } }
            : {}),
        });
      }
      logger.info(
        `Loaded ${entries.length} published ${name} entries from WordPress`
      );
    },
  };
}
