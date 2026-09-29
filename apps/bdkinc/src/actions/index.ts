import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { getPageCopy } from '@/lib/content';
import type { PageData } from '@bdkinc/content';

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
    const path = new URL(from).pathname;
    if (path.startsWith('/services/')) {
      const slug = path.replace('/services/', '').replace(/\/$/, '');
      if (slug) return withFirst(serviceQuestion(slug));
    }
    if (path === '/blog') return withFirst(copy.blog);
    if (path.startsWith('/blog/')) return withFirst(copy.article);
  } catch {
    // Ignore parsing errors, retaining the existing default suggestions.
  }
  return defaults;
}

export const server = {
  getReferrerSuggestions: defineAction({
    input: z.object({ from: z.string().optional() }),
    handler: async (input, context) => {
      const copy = (await getPageCopy('contact')).referrerSuggestions;
      const from = input.from || context.request.headers.get('referer');
      return { suggestions: referrerSuggestions(copy, from) };
    },
  }),
};
