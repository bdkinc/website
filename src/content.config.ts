import { z, defineCollection } from "astro:content";

const servicesCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    order: z.number(),
  }),
});

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});

const locationsCollection = defineCollection({
  type: "content",
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

const pseoServicesCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    order: z.number(),
    category: z.enum(["hardware", "os", "cloud", "specialized", "software", "security", "communication", "support", "infrastructure"]),
  }),
});

export const collections = {
  services: servicesCollection,
  blog: blogCollection,
  locations: locationsCollection,
  pseoServices: pseoServicesCollection,
};
