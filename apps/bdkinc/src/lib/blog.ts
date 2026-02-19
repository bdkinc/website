import { getCollection, getEntry } from 'astro:content';

import {
  getBlogPostBySlugContent,
  getBlogPostsContent,
  type BlogPostContent,
} from '@/lib/cms';

function sortByDateDesc(posts: BlogPostContent[]): BlogPostContent[] {
  return posts.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}

async function getLocalBlogPosts(): Promise<BlogPostContent[]> {
  const localEntries = await getCollection('blog', ({ data }) => !data.draft);

  return localEntries.map((entry) => ({
    slug: entry.slug,
    title: entry.data.title,
    description: entry.data.description,
    author: entry.data.author,
    pubDate: entry.data.pubDate,
    category: entry.data.category,
    tags: entry.data.tags || [],
    image: entry.data.image,
    content: entry.body || '',
  }));
}

export async function getBlogPosts(): Promise<BlogPostContent[]> {
  const cmsPosts = await getBlogPostsContent();

  if (cmsPosts.length > 0) {
    return sortByDateDesc(cmsPosts);
  }

  const localPosts = await getLocalBlogPosts();
  return sortByDateDesc(localPosts);
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostContent | null> {
  const cmsPost = await getBlogPostBySlugContent(slug);

  if (cmsPost) {
    return cmsPost;
  }

  const localEntry = await getEntry('blog', slug);

  if (!localEntry || localEntry.data.draft) {
    return null;
  }

  return {
    slug: localEntry.slug,
    title: localEntry.data.title,
    description: localEntry.data.description,
    author: localEntry.data.author,
    pubDate: localEntry.data.pubDate,
    category: localEntry.data.category,
    tags: localEntry.data.tags || [],
    image: localEntry.data.image,
    content: localEntry.body || '',
  };
}
