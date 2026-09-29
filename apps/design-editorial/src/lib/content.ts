import { createContentClient, type CollectionName, type PageKey } from '@bdkinc/content';
import { getSiteRoutes, getPreviewRoute } from '@bdkinc/content/routes';
import { verifyPreviewToken, previewHeaders } from '@bdkinc/content/preview';
export { previewHeaders };
const env = (key: string) => process.env[key] || import.meta.env[key] || '';
export const wordpressOrigin = () => env('WORDPRESS_URL');
export function client() {
  return createContentClient({ url: wordpressOrigin(), username: env('WORDPRESS_USERNAME'), applicationPassword: env('WORDPRESS_APPLICATION_PASSWORD') });
}
type Snapshot = Awaited<ReturnType<ReturnType<typeof client>['preview']['getSnapshot']>>;
export interface Context { target: { kind: 'page' | 'collection' | 'settings'; key: string }; snapshot: Snapshot }
/** A request-local facade: exactly one authorized snapshot, with published siblings. */
export function content(context?: Context) {
  const cms = client();
  return {
    async collection<K extends CollectionName>(key: K) {
      const entries = await cms.getCollection(key);
      if (context?.target.kind !== 'collection' || context.target.key !== key) return entries;
      const draft = cms.preview.mapEntry(key, context.snapshot);
      return [...entries.filter(e => e.wpId !== draft.wpId && e.id !== draft.id), draft];
    },
    page<K extends PageKey>(key: K) {
      return context?.target.kind === 'page' && context.target.key === key ? Promise.resolve(cms.preview.mapPage(key, context.snapshot)) : cms.getPage(key);
    },
    settings() { return context?.target.kind === 'settings' ? Promise.resolve(cms.preview.mapSettings(context.snapshot)) : cms.getSettings(); },
  };
}
export async function authorize(token: string, path?: string) {
  const grant = verifyPreviewToken(token, { secret: env('BDK_PREVIEW_SECRET'), audience: env('BDK_PREVIEW_AUDIENCE') });
  if (path !== undefined && path !== grant.path) throw new Error('Wrong preview path.');
  const cms = client(), snapshot = await cms.preview.getSnapshot(token);
  if (snapshot.id !== grant.postId) throw new Error('Wrong preview entity.');
  const route = getPreviewRoute(await getSiteRoutes(cms), grant, snapshot);
  if (!route || route.path !== grant.path) throw new Error('Unknown preview target.');
  // Validate the complete targeted record before rendering, not just individual visible fields.
  if (grant.kind === 'page') cms.preview.mapPage(grant.key as PageKey, snapshot);
  else if (grant.kind === 'collection') cms.preview.mapEntry(grant.key as CollectionName, snapshot);
  else cms.preview.mapSettings(snapshot);
  return { route, context: { target: { kind: grant.kind, key: grant.key }, snapshot } satisfies Context };
}
