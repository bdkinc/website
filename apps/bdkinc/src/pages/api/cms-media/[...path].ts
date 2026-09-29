import type { APIRoute } from 'astro';
export const prerender = false;
export const GET: APIRoute = async ({ params, request }) => {
  const path = params.path || '';
  // No credentials, URL input, traversal, backslash or encoded second decoding.
  if (
    !path ||
    path.split('/').some((part) => !part || part === '.' || part === '..') ||
    /[\\%?#\x00-\x1f]/.test(path)
  )
    return new Response('Invalid media path.', { status: 400 });
  const origin = process.env.WORDPRESS_URL || import.meta.env.WORDPRESS_URL;
  if (!origin) return new Response('Media is not configured.', { status: 503 });
  const base = new URL('wp-content/uploads/', origin.replace(/\/$/, '') + '/');
  const url = new URL(path.split('/').map(encodeURIComponent).join('/'), base);
  if (!url.href.startsWith(base.href))
    return new Response(null, { status: 400 });
  try {
    const headers = new Headers();
    for (const key of ['Range', 'If-None-Match', 'If-Modified-Since']) {
      const value = request.headers.get(key);
      if (value) headers.set(key, value);
    }
    const upstream = await fetch(url, {
      headers,
      redirect: 'error',
      signal: AbortSignal.timeout(15000),
    });
    const resultHeaders = new Headers({ 'X-Content-Type-Options': 'nosniff' });
    for (const key of [
      'Content-Type',
      'Content-Length',
      'Content-Range',
      'Accept-Ranges',
      'ETag',
      'Last-Modified',
    ]) {
      const value = upstream.headers.get(key);
      if (value) resultHeaders.set(key, value);
    }
    resultHeaders.set(
      'Cache-Control',
      upstream.ok || upstream.status === 304
        ? 'public, max-age=300'
        : 'no-store'
    );
    return new Response(upstream.body, {
      status: upstream.status,
      headers: resultHeaders,
    });
  } catch {
    return new Response('Media origin unavailable.', { status: 502 });
  }
};
