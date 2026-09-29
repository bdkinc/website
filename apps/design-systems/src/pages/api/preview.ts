import type { APIRoute } from 'astro';
import { verify, previewHeaders } from '@/lib/content';
export const prerender = false;
export const GET: APIRoute = ({ url }) => {
  try {
    const token = url.searchParams.get('token') || '';
    const grant = verify(token);
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
