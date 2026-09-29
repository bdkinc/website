import { defineCollection } from 'astro:content';
import { collectionSchemas } from '@bdkinc/content/schemas';
import { wordpressLoader } from './lib/loaders/wordpress';

export const collections = {
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
