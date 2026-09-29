import type { APIRoute } from 'astro';
import { wordpressOrigin } from '@/lib/content';
export const prerender = false;
export const GET: APIRoute = async ({ params }) => {
  let path: string;
  try { path = decodeURIComponent(params.path || ''); } catch { return new Response(null,{status:400}); }
  if (!path || path.includes('\\') || path.includes('%') || path.includes('?') || path.includes('#') || path.split('/').some(part=>!part || part==='.' || part==='..')) return new Response(null,{status:400});
  const base = new URL('/wp-content/uploads/', wordpressOrigin());
  const target = new URL(path.split('/').map(encodeURIComponent).join('/'), base);
  if (target.origin !== base.origin || !target.pathname.startsWith(base.pathname)) return new Response(null,{status:400});
  try {
    const response = await fetch(target, {redirect:'error',signal:AbortSignal.timeout(15000)});
    const type=response.headers.get('content-type') || '';
    if(!response.ok) return new Response(null,{status:404});
    if(!type.startsWith('image/')) return new Response(null,{status:415});
    return new Response(response.body,{headers:{'Content-Type':type,'Cache-Control':'public, max-age=3600','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox",'X-Robots-Tag':'noindex'}});
  } catch { return new Response(null,{status:502}); }
};
