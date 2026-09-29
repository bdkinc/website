// Server-only: consumers supply configuration; no framework/environment imports.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod/v4';
import type { ContentClient } from './client.ts';
import { collectionSchemas, type CollectionName } from './schemas.ts';
import { pageSchemas, settingsDefinition, type PageKey } from './editorial.ts';
import { createContentReader, type ContentSource } from './reader.ts';
import { getSiteRoutes, getPreviewRoute } from './routes.ts';

/** Server-only context created after the outer route authorizes a snapshot. */
export interface PreviewContext {
  mode: 'preview';
  publicPath: string;
  target: {
    kind: 'page' | 'collection' | 'settings';
    key: string;
    postId: number;
  };
  snapshot: Awaited<ReturnType<ContentClient['preview']['getSnapshot']>>;
}

const grantSchema = z.object({
  v: z.literal(1), postId: z.number().int().positive(), editor: z.number().int().positive(),
  snapshot: z.uuid(), exp: z.number().int(), aud: z.url(),
  kind: z.enum(['page', 'collection', 'settings']), key: z.string().min(1),
  path: z.string().regex(/^\/(?!\/)[^?#\\]*$/),
});
export const previewHeaders = {
  'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer',
};
export function verifyPreviewToken(token: string, options: { secret: string; audience: string }) {
  if (!options.secret || !options.audience) throw new Error('Preview is not configured.');
  if (token.length > 4096) throw new Error('Invalid preview.');
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra || !/^[A-Za-z0-9_-]+$/.test(signature)) throw new Error('Invalid preview.');
  const expected = createHmac('sha256', options.secret).update(payload).digest();
  const actual = Buffer.from(signature, 'base64url');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new Error('Invalid preview.');
  const grant = grantSchema.parse(JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')));
  if (grant.aud !== options.audience.replace(/\/$/, '') || grant.exp <= Date.now() / 1000 || grant.exp > Date.now() / 1000 + 960)
    throw new Error('Expired or wrong-audience preview.');
  return grant;
}

/** Authorize once, then reuse the published inventory reads through the returned reader. */
export async function authorizePreview(options: {
  token: string;
  path?: string;
  secret: string;
  audience: string;
  client: ContentClient;
  publishedReader?: ContentSource;
}) {
  const grant = verifyPreviewToken(options.token, options);
  const path = options.path ?? grant.path;
  if (path !== grant.path) throw new Error('Wrong preview path.');
  const { client } = options;
  // WordPress enforces snapshot UUID/editor binding against the stored immutable grant.
  const snapshot = await client.preview.getSnapshot(options.token);
  if (snapshot.id !== grant.postId) throw new Error('Wrong preview entity.');
  let allowed: boolean;
  if (grant.kind === 'collection') allowed = Object.hasOwn(collectionSchemas, grant.key);
  else if (grant.kind === 'page') allowed = Object.hasOwn(pageSchemas, grant.key);
  else allowed = grant.key === settingsDefinition.key;
  if (!allowed) throw new Error('Unknown preview target.');

  const published = createContentReader({ published: options.publishedReader ?? client });
  const route = getPreviewRoute(await getSiteRoutes(published), grant, snapshot);
  if (!route || route.path !== path) throw new Error('Unregistered preview target.');
  // Validate the full targeted record before invoking any renderer.
  if (grant.kind === 'collection') client.preview.mapEntry(grant.key as CollectionName, snapshot);
  else if (grant.kind === 'page') client.preview.mapPage(grant.key as PageKey, snapshot);
  else client.preview.mapSettings(snapshot);

  const context: PreviewContext = {
    mode: 'preview', publicPath: path,
    target: { kind: grant.kind, key: grant.key, postId: grant.postId }, snapshot,
  };
  return {
    route, context,
    reader: createContentReader({ published, preview: { context, mapper: client.preview } }),
  };
}
