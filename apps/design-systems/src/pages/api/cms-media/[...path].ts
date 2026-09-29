import type { APIRoute } from 'astro';
export const prerender = false;
export const GET: APIRoute = async ({ params, request }) => {
  const path = params.path || '';
  if (
    !path ||
    /[\\%?#:\x00-\x1f]/.test(path) ||
    path.split('/').some((part) => !part || part === '.' || part === '..')
  )
    return new Response('Invalid upload path.', { status: 400 });
  const origin = process.env.WORDPRESS_URL || import.meta.env.WORDPRESS_URL;
  if (!origin) return new Response('Media not configured.', { status: 503 });
  const base = new URL('wp-content/uploads/', origin.replace(/\/$/, '') + '/');
  const target = new URL(
    path.split('/').map(encodeURIComponent).join('/'),
    base
  );
  if (target.origin !== base.origin || !target.href.startsWith(base.href))
    return new Response(null, { status: 400 });
  try {
    const headers = new Headers();
    for (const name of ['Range', 'If-None-Match', 'If-Modified-Since']) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    const upstream = await fetch(target, {
      headers,
      redirect: 'error',
      signal: AbortSignal.timeout(15000),
    });
    const output = new Headers({
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control':
        upstream.ok || upstream.status === 304
          ? 'public, max-age=300'
          : 'no-store',
    });
    for (const name of [
      'Content-Type',
      'Content-Length',
      'Content-Range',
      'Accept-Ranges',
      'ETag',
      'Last-Modified',
    ]) {
      const value = upstream.headers.get(name);
      if (value) output.set(name, value);
    }
    return new Response(upstream.body, {
      status: upstream.status,
      headers: output,
    });
  } catch {
    return new Response('Media origin unavailable.', { status: 502 });
  }
};
