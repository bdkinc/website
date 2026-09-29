import { z } from 'zod/v4';

export const servicesSchema = z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    order: z.number(),
  });

export const blogSchema = z.object({
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
  });

export const locationsSchema = z.object({
    name: z.string(),
    state: z.string(),
    region: z.string(),
    population: z.number(),
    counties: z.array(z.string()).optional(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  });

export const testimonialsSchema = z.object({
    quote: z.string(),
    author: z.string(),
    company: z.string(),
    industry: z.string(),
    order: z.number().optional(),
  });

export const pseoServicesSchema = z.object({
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
  });

export const pseoIndustriesSchema = z.object({
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
  });

export const partnersSchema = z.object({
    name: z.string(),
    description: z.string(),
    detail: z.string().optional(),
    category: z.string().optional(),
    order: z.number().optional(),
    featured: z.boolean().optional(),
    showOnAbout: z.boolean().optional(),
    logo: z.string().optional(),
  });

export const collectionSchemas = {
  services: servicesSchema,
  blog: blogSchema,
  locations: locationsSchema,
  testimonials: testimonialsSchema,
  pseoServices: pseoServicesSchema,
  pseoIndustries: pseoIndustriesSchema,
  partners: partnersSchema,
} as const;
export type CollectionName = keyof typeof collectionSchemas;
export type CollectionData<K extends CollectionName> = z.infer<(typeof collectionSchemas)[K]>;
export type Service = z.infer<typeof servicesSchema>;
export type BlogPost = z.infer<typeof blogSchema>;
export type Location = z.infer<typeof locationsSchema>;
export type Testimonial = z.infer<typeof testimonialsSchema>;
export type Partner = z.infer<typeof partnersSchema>;
export type PseoService = z.infer<typeof pseoServicesSchema>;
export type PseoIndustry = z.infer<typeof pseoIndustriesSchema>;
