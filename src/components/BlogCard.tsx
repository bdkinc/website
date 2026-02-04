import { PiCalendar, PiClock } from 'react-icons/pi';
import type { CollectionEntry } from 'astro:content';
import { TechCard } from '@/components/TechCard';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  post: CollectionEntry<'blog'>;
  readTime: string;
  className?: string;
  index: number;
}

export function BlogCard({ post, readTime, className, index }: BlogCardProps) {
  const { title, description, pubDate } = post.data;

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
      metadata={`POST_UUID_${post.id.substring(0, 8).toUpperCase()}`}
      className={cn('h-full', className)}
    >
      <article className="relative z-10 flex h-full flex-col p-6 text-left">
        {/* Header (Date & Read Time) */}
        <div className="text-muted-foreground/80 mb-5 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <PiCalendar className="text-primary/70 h-3.5 w-3.5" />
            <time dateTime={pubDate.toISOString()}>{formattedDate}</time>
          </div>
          <div className="flex items-center gap-1.5">
            <PiClock className="text-primary/70 h-3.5 w-3.5" />
            <span>{readTime}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1">
          <h3 className="font-display text-foreground group-hover:text-primary mb-3 line-clamp-2 text-xl leading-snug font-bold tracking-tight transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </article>
    </TechCard>
  );
}
