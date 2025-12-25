import React, { useState } from 'react';
import { BlogCard } from './BlogCard';
import { cn } from '@/lib/utils';
import type { CollectionEntry } from 'astro:content';
import { motion, AnimatePresence } from 'framer-motion';

// Extended type to include pre-calculated readTime
export type BlogPostWithReadTime = CollectionEntry<'blog'> & {
  readTime: string;
};

interface BlogListProps {
  posts: BlogPostWithReadTime[];
}

const CATEGORIES = ['All', 'Infrastructure', 'Security', 'Development', 'AI'];

export function BlogList({ posts }: BlogListProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = posts.filter(
    (post) => activeCategory === 'All' || post.data.category === activeCategory
  );

  return (
    <div className="space-y-12">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-mono transition-all duration-300 border',
              activeCategory === category
                ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_-5px_rgba(0,212,255,0.4)]'
                : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:border-primary/30'
            )}
          >
            {category === 'All' ? 'System.All' : `sys.${category}`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <a href={`/blog/${post.slug}`} className="block h-full">
                <BlogCard post={post} readTime={post.readTime} className="h-full" index={index} />
              </a>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20 border border-dashed border-primary/20 rounded-xl bg-primary/5">
          <p className="text-muted-foreground font-mono">
            // No briefings found for category: {activeCategory}
          </p>
        </div>
      )}
    </div>
  );
}
