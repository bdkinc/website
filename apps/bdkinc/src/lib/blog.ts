import {
  getContentCollection,
  getContentEntry,
  type ContentContext,
} from '@/lib/content';

export interface BlogPostContent {
  slug: string;
  title: string;
  description: string;
  author: string;
  pubDate: Date;
  category: 'Infrastructure' | 'Security' | 'Development' | 'AI';
  tags: string[];
  image?: string;
  content: string;
  contentFormat?: 'html' | 'markdown';
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
    category: 'Infrastructure' | 'Security' | 'Development' | 'AI';
    tags?: string[];
    image?: string;
  },
  content: string
): BlogPostContent {
  return {
    slug,
    title: data.title,
    description: data.description,
    author: data.author,
    pubDate: data.pubDate,
    category: data.category,
    tags: data.tags || [],
    image: data.image,
    content,
    contentFormat: 'html',
  };
}

export async function getBlogPosts(
  context?: ContentContext
): Promise<BlogPostContent[]> {
  const localEntries = await getContentCollection('blog', context);

  return sortByDateDesc(
    localEntries.map((entry) =>
      toBlogPost(entry.id, entry.data, entry.body?.html || '')
    )
  );
}

export async function getBlogPostBySlug(
  slug: string,
  context?: ContentContext
): Promise<BlogPostContent | null> {
  const localEntry = await getContentEntry('blog', slug, context);

  if (!localEntry) {
    return null;
  }

  return toBlogPost(
    localEntry.id,
    localEntry.data,
    localEntry.body?.html || ''
  );
}
