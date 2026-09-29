import type { APIRoute } from 'astro';
import { authorize, previewHeaders } from '@/lib/content';
export const prerender = false;
export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token') || '';
  try {
    const { route } = await authorize(token);
    return new Response(null, { status: 302, headers: { ...previewHeaders, Location: `/preview${route.path === '/' ? '/' : route.path}?token=${encodeURIComponent(token)}` } });
  } catch { return new Response('Preview authorization failed or expired.', { status: 401, headers: previewHeaders }); }
};
