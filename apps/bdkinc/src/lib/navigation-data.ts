import { getCollection } from 'astro:content';

import { getBlogPosts } from '@/lib/blog';

export async function getNavigationData() {
  // Get services data (now from JSON files)
  const servicesEntries = await getCollection('services');
  const servicesData = servicesEntries
    .sort((a: any, b: any) => a.data.order - b.data.order)
    .map((entry: any) => ({
      slug: entry.id,
      title: entry.data.title,
      description: entry.data.description,
      icon: entry.data.icon,
    }));

  // Get recent blog posts
  const blogEntries = await getBlogPosts();
  const recentPosts = blogEntries
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf())
    .slice(0, 3)
    .map((entry) => ({
      slug: entry.slug,
      title: entry.title,
      description: entry.description,
      pubDate: entry.pubDate,
    }));

  return {
    servicesData,
    recentPosts,
  };
}
