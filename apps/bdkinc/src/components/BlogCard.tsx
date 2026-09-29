import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { PiCalendar, PiClock } from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';
import type { BlogPostContent } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPostContent;
  readTime: string;
  className?: string;
  xstyle?: StyleXStyles;
  index: number;
}
const styles = stylex.create({
  full: { height: '100%' },
  article: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    padding: 24,
    textAlign: 'left',
  },
  metadata: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    color: 'color-mix(in oklab, var(--muted-foreground) 80%, transparent)',
    fontSize: '.75rem',
    lineHeight: '1rem',
    fontWeight: 500,
  },
  detail: { display: 'flex', alignItems: 'center', gap: 6 },
  icon: {
    height: 14,
    width: 14,
    color: 'color-mix(in oklab, var(--primary) 70%, transparent)',
  },
  body: { flex: 1 },
  title: {
    marginBottom: 12,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    fontFamily: 'var(--font-display)',
    color: 'var(--tech-title-color, var(--foreground))',
    fontSize: '1.25rem',
    lineHeight: 1.375,
    fontWeight: 700,
    letterSpacing: '-.025em',
    transitionProperty: 'color',
    transitionDuration: '150ms',
  },
  description: {
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    color: 'var(--muted-foreground)',
    fontSize: '.875rem',
    lineHeight: 1.625,
  },
});

export function BlogCard({
  post,
  readTime,
  className,
  xstyle,
  index,
}: BlogCardProps) {
  const { title, description, pubDate } = post;
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(pubDate);
  return (
    <TechCard
      interactive
      variant="blog"
      delay={index * 100}
      className={className}
      xstyle={[styles.full, xstyle]}
    >
      <article {...stylex.props(styles.article)}>
        <div {...stylex.props(styles.metadata)}>
          <div {...stylex.props(styles.detail)}>
            <PiCalendar {...stylex.props(styles.icon)} />
            <time dateTime={pubDate.toISOString()}>{formattedDate}</time>
          </div>
          <div {...stylex.props(styles.detail)}>
            <PiClock {...stylex.props(styles.icon)} />
            <span>{readTime}</span>
          </div>
        </div>
        <div {...stylex.props(styles.body)}>
          <h3 {...stylex.props(styles.title)}>{title}</h3>
          <p {...stylex.props(styles.description)}>{description}</p>
        </div>
      </article>
    </TechCard>
  );
}
