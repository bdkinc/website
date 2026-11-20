import type { APIRoute } from 'astro';
import { SITE_ORIGIN } from '@/lib/public-url';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const noindex =
    (process.env.BDK_NOINDEX || import.meta.env.BDK_NOINDEX) === 'true';
  const body = noindex
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /*.pdf$\n\nSitemap: ${new URL('/sitemap-index.xml', site ?? SITE_ORIGIN)}\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
