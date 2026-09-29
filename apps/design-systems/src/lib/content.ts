import {
  createContentClient,
  type CollectionName,
  type PageKey,
} from '@bdkinc/content';
import { getSiteRoutes, getPreviewRoute } from '@bdkinc/content/routes';
import { verifyPreviewToken, previewHeaders } from '@bdkinc/content/preview';
export { previewHeaders };

export function client() {
  const url = process.env.WORDPRESS_URL || import.meta.env.WORDPRESS_URL;
  if (!url) throw new Error('WORDPRESS_URL is required. No fixture fallback.');
  return createContentClient({
    url,
    username:
      process.env.WORDPRESS_USERNAME || import.meta.env.WORDPRESS_USERNAME,
    applicationPassword:
      process.env.WORDPRESS_APPLICATION_PASSWORD ||
      import.meta.env.WORDPRESS_APPLICATION_PASSWORD,
    media: { mode: 'proxy', prefix: '/api/cms-media' },
  });
}
export function verify(token: string) {
  return verifyPreviewToken(token, {
    secret:
      process.env.BDK_PREVIEW_SECRET ||
      import.meta.env.BDK_PREVIEW_SECRET ||
      '',
    audience:
      process.env.BDK_PREVIEW_AUDIENCE ||
      import.meta.env.BDK_PREVIEW_AUDIENCE ||
      '',
  });
}
export interface Context {
  grant: ReturnType<typeof verify>;
  snapshot: Awaited<
    ReturnType<ReturnType<typeof client>['preview']['getSnapshot']>
  >;
}
export async function resolve(token: string, path: string) {
  const grant = verify(token);
  if (grant.path !== path) throw new Error('Preview path mismatch');
  const cms = client();
  const snapshot = await cms.preview.getSnapshot(token);
  if (snapshot.id !== grant.postId) throw new Error('Preview entity mismatch');
  const route = getPreviewRoute(await getSiteRoutes(cms), grant, snapshot);
  if (!route || route.path !== path) throw new Error('Unregistered preview');
  if (grant.kind === 'page')
    cms.preview.mapPage(grant.key as PageKey, snapshot);
  else if (grant.kind === 'collection')
    cms.preview.mapEntry(grant.key as CollectionName, snapshot);
  else cms.preview.mapSettings(snapshot);
  return { route, context: { grant, snapshot } };
}
// A fresh reader belongs to one render. An authorized snapshot overlays only its record.
export function reader(context?: Context) {
  const cms = client();
  return {
    async getCollection<K extends CollectionName>(key: K) {
      const published = await cms.getCollection(key);
      if (context?.grant.kind !== 'collection' || context.grant.key !== key)
        return published;
      const draft = cms.preview.mapEntry(key, context.snapshot);
      return [
        ...published.filter((p) => p.wpId !== draft.wpId && p.id !== draft.id),
        draft,
      ];
    },
    async getPage<K extends PageKey>(key: K) {
      return context?.grant.kind === 'page' && context.grant.key === key
        ? cms.preview.mapPage(key, context.snapshot)
        : cms.getPage(key);
    },
    async getSettings() {
      return context?.grant.kind === 'settings'
        ? cms.preview.mapSettings(context.snapshot)
        : cms.getSettings();
    },
  };
}
export type Reader = ReturnType<typeof reader>;
