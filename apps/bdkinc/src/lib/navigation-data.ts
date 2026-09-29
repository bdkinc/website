import { getContentCollection, type ContentContext } from '@/lib/content';

import { getBlogPosts } from '@/lib/blog';

export async function getNavigationData(context?: ContentContext) {
  // Resolve published services, or the single authorized preview overlay.
  const servicesEntries = await getContentCollection('services', context);
  const servicesData = servicesEntries
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => ({
      slug: entry.id,
      title: entry.data.title,
      description: entry.data.description,
      icon: entry.data.icon,
    }));

  // Get recent blog posts
  const blogEntries = await getBlogPosts(context);
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
