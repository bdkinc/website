import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const servicesCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    order: z.number(),
  }),
});

const blogCollection = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/blog',
  }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    category: z
      .enum(['Infrastructure', 'Security', 'Development', 'AI'])
      .default('Infrastructure'),
    draft: z.boolean().optional(),
  }),
});

const locationsCollection = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/locations',
  }),
  schema: z.object({
    name: z.string(),
    state: z.string(),
    region: z.string(),
    population: z.number(),
    counties: z.array(z.string()).optional(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
});

const testimonialsCollection = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.json',
    base: './src/content/testimonials',
  }),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    company: z.string(),
    industry: z.string(),
    order: z.number().optional(),
  }),
});

const pseoServicesCollection = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.json',
    base: './src/content/pseoServices',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    order: z.number(),
    category: z.enum([
      'hardware',
      'os',
      'cloud',
      'specialized',
      'software',
      'security',
      'communication',
      'support',
      'infrastructure',
    ]),
  }),
});

const pseoIndustriesCollection = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.json',
    base: './src/content/pseoIndustries',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    order: z.number(),
    category: z.enum([
      'operations',
      'regulated',
      'service',
      'production',
      'logistics',
      'community',
    ]),
  }),
});

const partnersCollection = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.json',
    base: './src/content/partners',
  }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    detail: z.string().optional(),
    category: z.string().optional(),
    order: z.number().optional(),
    featured: z.boolean().optional(),
    showOnAbout: z.boolean().optional(),
    logo: z.string().optional(),
  }),
});

export const collections = {
  services: servicesCollection,
  blog: blogCollection,
  locations: locationsCollection,
  testimonials: testimonialsCollection,
  pseoServices: pseoServicesCollection,
  pseoIndustries: pseoIndustriesCollection,
  partners: partnersCollection,
};
