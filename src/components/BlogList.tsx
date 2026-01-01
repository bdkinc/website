import type { CollectionEntry } from 'astro:content';
import { BlogCard } from '@/components/BlogCard';

// Extended type to include pre-calculated readTime
export type BlogPostWithReadTime = CollectionEntry<'blog'> & {
  readTime: string;
};

interface BlogListProps {
  posts: BlogPostWithReadTime[];
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className="space-y-10">
      {/* Grid (no motion to avoid stuck initial state) */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block h-full"
          >
            <BlogCard
              post={post}
              readTime={post.readTime}
              className="h-full"
              index={index}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
