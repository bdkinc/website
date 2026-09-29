import { createContentClient } from '@bdkinc/content';
import { createContentReader } from '@bdkinc/content/reader';
import {
  authorizePreview,
  verifyPreviewToken,
  previewHeaders,
} from '@bdkinc/content/preview';
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

function previewConfiguration() {
  return {
    secret:
      process.env.BDK_PREVIEW_SECRET ||
      import.meta.env.BDK_PREVIEW_SECRET ||
      '',
    audience:
      process.env.BDK_PREVIEW_AUDIENCE ||
      import.meta.env.BDK_PREVIEW_AUDIENCE ||
      '',
  };
}

// The redirect endpoint verifies only the grant, as before; rendering authorizes
// the snapshot and route through the shared implementation below.
export function verify(token: string) {
  return verifyPreviewToken(token, previewConfiguration());
}

export function authorize(token: string, path?: string) {
  return authorizePreview({
    token,
    path,
    ...previewConfiguration(),
    client: client(),
  });
}

/** One published reader per render; previews supply their authorized reader. */
export function createReader() {
  return createContentReader({ published: client() });
}
