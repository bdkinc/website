// Server-only: consumers supply configuration; no framework/environment imports.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod/v4';
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
