import type { ContentReader } from '@/lib/content';
import { blogYoastSeoSchema, type BlogYoastSeo } from '@bdkinc/content/seo';

export interface BlogPostContent {
  slug: string;
  title: string;
  description: string;
  author: string;
  pubDate: Date;
  sourceModifiedAt?: Date;
  category: 'Infrastructure' | 'Security' | 'Development' | 'AI';
  tags: string[];
  image?: string;
  imageAlt?: string;
  content: string;
  contentFormat?: 'html' | 'markdown';
  wpId?: number;
  yoastSeo?: BlogYoastSeo;
}

function sortByDateDesc(posts: BlogPostContent[]): BlogPostContent[] {
  return posts.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}

function toBlogPost(
  slug: string,
  data: {
    title: string;
    description: string;
    author: string;
    pubDate: Date;
    sourceModifiedAt?: Date;
    category: 'Infrastructure' | 'Security' | 'Development' | 'AI';
    tags?: string[];
    image?: string;
    imageAlt?: string;
  },
  content: string
): BlogPostContent {
  return {
    slug,
    title: data.title,
    description: data.description,
    author: data.author,
    pubDate: data.pubDate,
    sourceModifiedAt: data.sourceModifiedAt,
    category: data.category,
    tags: data.tags || [],
    image: data.image,
    imageAlt: data.imageAlt,
    content,
    contentFormat: 'html',
  };
}

export async function getBlogPosts(
  reader: ContentReader
): Promise<BlogPostContent[]> {
  const localEntries = await reader.getCollection('blog');

  return sortByDateDesc(
    localEntries.map((entry) =>
      toBlogPost(entry.id, entry.data, entry.body?.html || '')
    )
  );
}

export async function getBlogPostBySlug(
  slug: string,
  reader: ContentReader
): Promise<BlogPostContent | null> {
  const localEntry = (await reader.getCollection('blog')).find((entry) => entry.id === slug);

  if (!localEntry) {
    return null;
  }

  const { data } = localEntry;
  const post = toBlogPost(localEntry.id, data, localEntry.body?.html || '');
  if (!data.draft) {
    post.wpId = localEntry.wpId;
    if ('yoastSeo' in data) {
      const result = blogYoastSeoSchema.safeParse(data.yoastSeo);
      if (result.success) post.yoastSeo = result.data;
    }
  }
  return post;
}
