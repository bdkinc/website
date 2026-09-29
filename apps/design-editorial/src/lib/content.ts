import { createContentClient } from '@bdkinc/content';
import { createContentReader } from '@bdkinc/content/reader';
import { authorizePreview, previewHeaders } from '@bdkinc/content/preview';
export { previewHeaders };
const env = (key: string) => process.env[key] || import.meta.env[key] || '';
export const wordpressOrigin = () => env('WORDPRESS_URL');
export function client() {
  return createContentClient({
    url: wordpressOrigin(),
    username: env('WORDPRESS_USERNAME'),
    applicationPassword: env('WORDPRESS_APPLICATION_PASSWORD'),
  });
}

/** One published reader per render; previews supply their authorized reader. */
export function createReader() {
  return createContentReader({ published: client() });
}

export function authorize(token: string, path?: string) {
  return authorizePreview({
    token,
    path,
    secret: env('BDK_PREVIEW_SECRET'),
    audience: env('BDK_PREVIEW_AUDIENCE'),
    client: client(),
  });
}
