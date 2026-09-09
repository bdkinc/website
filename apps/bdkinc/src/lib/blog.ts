import { getCollection, getEntry } from 'astro:content';

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
  };
}

export async function getBlogPosts(): Promise<BlogPostContent[]> {
  const localEntries = await getCollection('blog', ({ data }) => !data.draft);

  return sortByDateDesc(
    localEntries.map((entry) =>
      toBlogPost(entry.id, entry.data, entry.body || '')
    )
  );
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostContent | null> {
  const localEntry = await getEntry('blog', slug);

  if (!localEntry || localEntry.data.draft) {
    return null;
  }

  return toBlogPost(localEntry.id, localEntry.data, localEntry.body || '');
}
