import { getCollection } from "astro:content";

export async function getNavigationData() {
  // Get services data (now from JSON files)
  const servicesEntries = await getCollection("services");
  const servicesData = servicesEntries
    .sort((a: any, b: any) => a.data.order - b.data.order)
    .map((entry: any) => ({
      slug: entry.id,
      title: entry.data.title,
      description: entry.data.description,
      icon: entry.data.icon,
    }));

  // Get recent blog posts
  const blogEntries = await getCollection("blog", ({ data }) => !data.draft);
  const recentPosts = blogEntries
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, 3)
    .map((entry) => ({
      slug: entry.slug,
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
    }));

  return {
    servicesData,
    recentPosts,
  };
}
