import type { APIRoute } from 'astro';

/** Byte-for-byte match of the former public/robots.txt when the flag is unset. */
const publishedRobots =
  'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /*.pdf$\n\nSitemap: https://www.bdkinc.com/sitemap-index.xml\n';

export const prerender = true;

export const GET: APIRoute = () => {
  const noindex =
    (process.env.BDK_NOINDEX || import.meta.env.BDK_NOINDEX) === 'true';
  const body = noindex ? 'User-agent: *\nDisallow: /\n' : publishedRobots;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
