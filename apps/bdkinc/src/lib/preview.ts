import { verifyPreviewToken as verify, previewHeaders } from '@bdkinc/content/preview';
import { getSiteRoutes, getPreviewRoute, type SiteRoute } from '@bdkinc/content/routes';
import { wordpressClient, type ContentContext } from '@/lib/content';
export { previewHeaders };
export function verifyPreviewToken(token: string) {
  return verify(token, {
    secret: process.env.BDK_PREVIEW_SECRET || import.meta.env.BDK_PREVIEW_SECRET || '',
    audience: process.env.BDK_PREVIEW_AUDIENCE || import.meta.env.BDK_PREVIEW_AUDIENCE || '',
  });
}
export async function resolvePreviewContext(token: string, path: string): Promise<ContentContext> {
  const grant = verifyPreviewToken(token);
  if (grant.path !== path) throw new Error('Wrong preview target.');
  const client = wordpressClient();
  const snapshot = await client.preview.getSnapshot(token);
  if (snapshot.id !== grant.postId) throw new Error('Wrong preview entity.');
  const route = getPreviewRoute(await getSiteRoutes(client), grant, snapshot);
  if (!route || route.path !== path) throw new Error('Unregistered preview target.');
  // Validate the snapshot shape before any template is invoked.
  if (grant.kind === 'collection') client.preview.mapEntry(grant.key as Parameters<typeof client.preview.mapEntry>[0], snapshot);
  else if (grant.kind === 'page') client.preview.mapPage(grant.key as Parameters<typeof client.preview.mapPage>[0], snapshot);
  else client.preview.mapSettings(snapshot);
  return { mode: 'preview', publicPath: path, target: { kind: grant.kind, key: grant.key, postId: grant.postId }, snapshot };
}
export async function previewTemplate(context: ContentContext): Promise<SiteRoute | undefined> {
  return getPreviewRoute(await getSiteRoutes(wordpressClient()), context.target, context.snapshot);
}
