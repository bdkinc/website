import {
  authorizePreview,
  verifyPreviewToken as verify,
  previewHeaders,
} from '@bdkinc/content/preview';
import { wordpressClient } from '@/lib/content';
export { previewHeaders };

function previewOptions() {
  return {
    secret: process.env.BDK_PREVIEW_SECRET || import.meta.env.BDK_PREVIEW_SECRET || '',
    audience: process.env.BDK_PREVIEW_AUDIENCE || import.meta.env.BDK_PREVIEW_AUDIENCE || '',
  };
}

// The API redirect needs only the lightweight signed-grant check.
export function verifyPreviewToken(token: string) {
  return verify(token, previewOptions());
}

export function resolvePreview(token: string, path: string) {
  return authorizePreview({
    token,
    path,
    ...previewOptions(),
    client: wordpressClient(),
  });
}
