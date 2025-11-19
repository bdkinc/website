import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

/**
 * Action to get referrer information from the request headers
 * and return appropriate suggestions for the contact form
 */
export const server = {
  getReferrerSuggestions: defineAction({
    input: z.object({
      from: z.string().optional(),
    }),
    handler: async (input, context) => {
      const defaultSuggestions = [
        'How can I get a quote for IT services?',
        'I need help with network infrastructure',
        'What managed IT services do you offer?',
        'Tell me about your cloud services',
      ];

      // Prefer explicit `from` parameter if present
      const from = input.from || context.request.headers.get('referer');

      if (!from) {
        return { suggestions: defaultSuggestions };
      }

      // If `from` is a simple string (like 'services', 'about', etc.)
      if (!from.includes('/') && !from.includes('://')) {
        if (from === 'services') {
          return {
            suggestions: [
              'How can I get a quote for your IT services?',
              ...defaultSuggestions.slice(1),
            ],
          };
        }

        if (from === 'about') {
          return {
            suggestions: [
              'How can BDKinc support our IT strategy long-term?',
              ...defaultSuggestions.slice(1),
            ],
          };
        }

        if (from === 'blog') {
          return {
            suggestions: [
              'Can you help us apply these IT best practices?',
              ...defaultSuggestions.slice(1),
            ],
          };
        }

        if (from === 'blog-post') {
          return {
            suggestions: [
              'Can we implement the recommendations from this article?',
              ...defaultSuggestions.slice(1),
            ],
          };
        }

        // Service slugs (e.g. cloud-hosting, managed-it, etc.)
        const humanReadable = from
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');

        const question = `How can I get a quote for ${humanReadable}?`;
        return {
          suggestions: [question, ...defaultSuggestions.slice(1)],
        };
      }

      // Parse full URL from referer
      try {
        const url = new URL(from);
        const path = url.pathname;

        // Service detail pages: /services/:slug
        if (path.startsWith('/services/')) {
          const slug = path.replace('/services/', '').replace(/\/$/, '');

          if (slug) {
            const humanReadable = slug
              .split('-')
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
              .join(' ');

            const question = `How can I get a quote for ${humanReadable}?`;
            return {
              suggestions: [question, ...defaultSuggestions.slice(1)],
            };
          }
        }

        // Blog listing or post
        if (path === '/blog') {
          return {
            suggestions: [
              'Can you help us apply these IT best practices?',
              ...defaultSuggestions.slice(1),
            ],
          };
        }

        if (path.startsWith('/blog/')) {
          return {
            suggestions: [
              'Can we implement the recommendations from this article?',
              ...defaultSuggestions.slice(1),
            ],
          };
        }
      } catch {
        // Ignore parsing errors
      }

      return { suggestions: defaultSuggestions };
    },
  }),
};
