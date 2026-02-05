import { z, defineCollection } from 'astro:content';

const servicesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    order: z.number(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
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
  type: 'content',
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
  type: 'data',
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    company: z.string(),
    industry: z.string(),
    order: z.number().optional(),
  }),
});

const pseoServicesCollection = defineCollection({
  type: 'data',
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
  type: 'data',
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
  type: 'data',
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
