import { defineCollection, z } from 'astro:content';
import { pageSchemas, settingsSchema } from '@bdkinc/content/editorial';
import { collectionSchemas } from '@bdkinc/content/schemas';
import { wordpressLoader, wordpressPagesLoader, wordpressSettingsLoader } from './lib/loaders/wordpress';

const variants = Object.entries(pageSchemas).map(([key, schema]) =>
  z.object({ key: z.literal(key), data: schema })
);
const pageVariants = variants as [
  (typeof variants)[number],
  ...(typeof variants)[number][],
];

export const collections = {
  marketingPages: defineCollection({
    loader: wordpressPagesLoader(),
    schema: z.union(pageVariants),
  }),
  siteSettings: defineCollection({
    loader: wordpressSettingsLoader(),
    schema: settingsSchema,
  }),
  services: defineCollection({
    loader: wordpressLoader('services'),
    schema: collectionSchemas.services,
  }),
  blog: defineCollection({
    loader: wordpressLoader('blog'),
    schema: collectionSchemas.blog,
  }),
  locations: defineCollection({
    loader: wordpressLoader('locations'),
    schema: collectionSchemas.locations,
  }),
  testimonials: defineCollection({
    loader: wordpressLoader('testimonials'),
    schema: collectionSchemas.testimonials,
  }),
  pseoServices: defineCollection({
    loader: wordpressLoader('pseoServices'),
    schema: collectionSchemas.pseoServices,
  }),
  pseoIndustries: defineCollection({
    loader: wordpressLoader('pseoIndustries'),
    schema: collectionSchemas.pseoIndustries,
  }),
  partners: defineCollection({
    loader: wordpressLoader('partners'),
    schema: collectionSchemas.partners,
  }),
};
