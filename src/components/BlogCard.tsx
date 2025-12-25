import React from 'react';
import { cn } from '@/lib/utils';
import { PiClock, PiCalendar, PiArrowRight, PiTerminal } from 'react-icons/pi';
import type { CollectionEntry } from 'astro:content';
import { ServiceCard } from '@/components/ServiceCard';

interface BlogCardProps {
  post: CollectionEntry<'blog'>;
  readTime: string;
  className?: string;
  index: number;
}

export function BlogCard({ post, readTime, className, index }: BlogCardProps) {
  const { title, description, pubDate, category } = post.data;

  // Format date
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(pubDate);

  return (
    <ServiceCard
      asChild
      interactive
      variant="technical"
      delay={index * 100}
      metadata={`POST_UUID_${post.id.substring(0, 8).toUpperCase()}`}
      className={className}
    >
      <article className="relative z-10 flex flex-col h-full p-6 text-left">
        {/* Header Metadata */}
        <div className="flex items-center justify-between mb-4 text-xs font-mono tracking-wider">
          <span className="text-muted-foreground/60 uppercase">Technical Briefing</span>
          <span className="text-primary flex items-center gap-1.5 px-2 py-1 rounded-sm bg-primary/10 border border-primary/20">
            <PiTerminal className="w-3 h-3" />
            {category}
          </span>
        </div>

        {/* Title & Content */}
        <div className="flex-1 mb-6">
          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 font-display uppercase tracking-tight">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Footer Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono mt-auto pt-4 border-t border-primary/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <PiCalendar className="w-3.5 h-3.5 text-primary/60" />
              <time dateTime={pubDate.toISOString()}>{formattedDate}</time>
            </div>
            <div className="flex items-center gap-1.5">
              <PiClock className="w-3.5 h-3.5 text-primary/60" />
              <span>{readTime}</span>
            </div>
          </div>
          
          <div className="text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <PiArrowRight className="w-4 h-4" />
          </div>
        </div>
      </article>
    </ServiceCard>
  );
}
