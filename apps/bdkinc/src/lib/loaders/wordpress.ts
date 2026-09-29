import type { Loader } from 'astro/loaders';
import { createContentClient, type CollectionName } from '@bdkinc/content';

export function wordpressLoader(name: CollectionName): Loader {
  return {
    name: `wordpress-${name}`,
    async load({ store, parseData, generateDigest, logger }) {
      const url = import.meta.env.WORDPRESS_URL || process.env.WORDPRESS_URL;
      if (!url)
        throw new Error('WORDPRESS_URL is required for published content.');
      const entries = await createContentClient({ url }).getCollection(name);
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
