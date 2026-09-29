import * as stylex from '@stylexjs/stylex';
import { BlogCard } from '@/components/BlogCard';
import type { BlogPostContent } from '@/lib/blog';

// Extended type to include pre-calculated readTime
export type BlogPostWithReadTime = BlogPostContent & {
  readTime: string;
};

interface BlogListProps {
  posts: BlogPostWithReadTime[];
}

const styles = stylex.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(1, minmax(0, 1fr))',
      '@media (min-width: 48rem)': 'repeat(2, minmax(0, 1fr))',
      '@media (min-width: 64rem)': 'repeat(3, minmax(0, 1fr))',
    },
    gap: '2rem',
  },
  link: { display: 'block', height: '100%' },
});

export function BlogList({ posts }: BlogListProps) {
  return (
    <div>
      {/* Grid (no motion to avoid stuck initial state) */}
      <div {...stylex.props(styles.grid)}>
        {posts.map((post, index) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            {...stylex.props(styles.link)}
          >
            <BlogCard post={post} readTime={post.readTime} index={index} />
          </a>
        ))}
      </div>
    </div>
  );
}
