import type { APIRoute } from 'astro';
import { verifyPreviewToken, previewHeaders } from '@/lib/preview';
export const prerender = false;
export const GET: APIRoute = ({ url }) => {
  try {
    const token = url.searchParams.get('token') || '';
    const grant = verifyPreviewToken(token);
    return new Response(null, {
      status: 302,
      headers: {
        ...previewHeaders,
        Location: `/preview${grant.path}?token=${encodeURIComponent(token)}`,
      },
    });
  } catch {
    return new Response('Preview authorization failed or expired.', {
      status: 401,
      headers: previewHeaders,
    });
  }
};
