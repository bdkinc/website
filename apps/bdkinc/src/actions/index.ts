import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { createAppContentReader } from '@/lib/content';
import type { PageData } from '@bdkinc/content';
import { matchPath, rootServiceSlug, SITE_ORIGIN } from '@/lib/public-url';

/** Resolve the existing referrer routing using server-resolved editorial copy. */
export function referrerSuggestions(
  copy: PageData<'contact'>['referrerSuggestions'],
  from?: string | null
): string[] {
  const defaults = [copy.defaults.quote, copy.defaults.network, copy.defaults.managedServices, copy.defaults.cloud];
  const withFirst = (question: string) => [question, ...defaults.slice(1)];
  const serviceQuestion = (slug: string) => copy.serviceQuote.replace(
    '{referrerTitle}',
    slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
  );
  if (!from) return defaults;
  if (!from.includes('/') && !from.includes('://')) {
    if (from === 'services') return withFirst(copy.services);
    if (from === 'about') return withFirst(copy.about);
    if (from === 'blog') return withFirst(copy.blog);
    if (from === 'blog-post') return withFirst(copy.article);
    return withFirst(serviceQuestion(from));
  }
  try {
    const { pathname } = from.startsWith('/') && !from.startsWith('//')
      ? new URL(from, SITE_ORIGIN)
      : new URL(from);
    const path = matchPath(pathname.toLowerCase());
    const slug = rootServiceSlug(path) ?? (path.startsWith('/services/') ? path.slice('/services/'.length) : undefined);
    if (slug) return withFirst(serviceQuestion(slug));
    if (pathname === '/blog') return withFirst(copy.blog);
    if (pathname.startsWith('/blog/')) return withFirst(copy.article);
  } catch {
    // Ignore parsing errors, retaining the existing default suggestions.
  }
  return defaults;
}

export const server = {
  getReferrerSuggestions: defineAction({
    input: z.object({ from: z.string().optional() }),
    handler: async (input, context) => {
      const reader = createAppContentReader();
      const copy = (await reader.getPage('contact')).referrerSuggestions;
      const from = input.from || context.request.headers.get('referer');
      return { suggestions: referrerSuggestions(copy, from) };
    },
  }),
};
