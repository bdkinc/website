import * as stylex from '@stylexjs/stylex';
import { PiArrowRight } from 'react-icons/pi';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@bdkinc/design-system';
import { formatDate } from '@/lib/utils';

const enter = stylex.keyframes({
  from: { opacity: 0, transform: 'translate3d(0, 1rem, 0)' },
});
const ease = 'cubic-bezier(0.4, 0, 0.2, 1)';
const transition =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';
const colorTransition =
  'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke';
const focusRing = '0 0 0 2px var(--background), 0 0 0 4px var(--ring)';
const cardShadow = '0 4px 20px -4px rgba(0, 212, 255, 0.1)';

const styles = stylex.create({
  // The trigger's transparent background is forced in every state; hover only
  // changes text color and blur. Focus/open keep the inherited color: the legacy
  // primitive's focus/open text utilities were never generated for this app.
  trigger: {
    backgroundColor: 'transparent',
    color: {
      default: 'inherit',
      ':hover': { default: null, '@media (hover: hover)': 'var(--primary)' },
      '[aria-current="page"]': 'var(--primary)',
    },
    backdropFilter: {
      default: null,
      ':hover': { default: null, '@media (hover: hover)': 'blur(24px)' },
    },
    transitionProperty: transition,
    transitionTimingFunction: ease,
    transitionDuration: '150ms',
  },
  content: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, var(--border) 50%, transparent)',
    backgroundColor: 'color-mix(in oklab, var(--background) 95%, transparent)',
    backdropFilter: 'blur(24px)',
  },
  list: { width: 400, padding: 16 },
  enter: {
    animationName: enter,
    animationDuration: '500ms',
    animationTimingFunction: 'ease',
    animationFillMode: 'both',
  },
  headingItem: { marginBottom: 8 },
  postItem: { marginBottom: 12 },
  heading: {
    paddingInline: 12,
    paddingBlock: 8,
    color: 'var(--foreground)',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 600,
  },
  card: {
    position: 'relative',
    display: 'block',
    overflow: 'hidden',
    borderRadius: 'var(--radius)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: 'color-mix(in oklab, var(--border) 40%, transparent)',
      ':hover': {
        default: null,
        '@media (hover: hover)':
          'color-mix(in oklab, var(--primary) 30%, transparent)',
      },
    },
    backgroundColor: {
      default: 'color-mix(in oklab, var(--card) 60%, transparent)',
      ':hover': {
        default: null,
        '@media (hover: hover)':
          'color-mix(in oklab, var(--card) 80%, transparent)',
      },
    },
    padding: 16,
    backdropFilter: 'blur(24px)',
    boxShadow: {
      default: 'none',
      ':hover': { default: null, '@media (hover: hover)': cardShadow },
      ':focus-visible': {
        default: focusRing,
        ':hover': {
          default: null,
          '@media (hover: hover)': `${focusRing}, ${cardShadow}`,
        },
      },
    },
    outline: 'none',
    userSelect: 'none',
    transitionProperty: transition,
    transitionTimingFunction: ease,
    transitionDuration: '300ms',
    '--blog-accent-color': {
      default: 'var(--muted-foreground)',
      ':hover': { default: null, '@media (hover: hover)': 'var(--primary)' },
    },
    '--blog-title-color': {
      default: 'var(--foreground)',
      ':hover': { default: null, '@media (hover: hover)': 'var(--primary)' },
    },
    '--blog-rule-color': {
      default: 'var(--border)',
      ':hover': {
        default: null,
        '@media (hover: hover)':
          'color-mix(in oklab, var(--primary) 30%, transparent)',
      },
    },
  },
  body: { display: 'flex', flexDirection: 'column', gap: 6 },
  title: {
    color: 'var(--blog-title-color)',
    fontSize: '0.875rem',
    lineHeight: 1.25,
    fontWeight: 700,
    transitionProperty: colorTransition,
    transitionTimingFunction: ease,
    transitionDuration: '300ms',
  },
  description: {
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    color: 'var(--muted-foreground)',
    fontSize: '0.75rem',
    lineHeight: 1.625,
  },
  metadata: { display: 'flex', marginTop: 4, alignItems: 'center', gap: 8 },
  rule: {
    width: 16,
    height: 1,
    backgroundColor: 'var(--blog-rule-color)',
    transitionProperty: colorTransition,
    transitionTimingFunction: ease,
    transitionDuration: '150ms',
  },
  date: {
    color: 'var(--blog-accent-color)',
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.05em',
    transitionProperty: colorTransition,
    transitionTimingFunction: ease,
    transitionDuration: '150ms',
  },
  footerItem: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--input)',
    paddingTop: 8,
  },
  footerLink: {
    display: 'flex',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: {
      default: 8,
      ':hover': { default: null, '@media (hover: hover)': 12 },
    },
    borderRadius: 'calc(var(--radius) - 2px)',
    padding: 12,
    color: {
      default: 'var(--foreground)',
      ':hover': { default: null, '@media (hover: hover)': 'var(--primary)' },
      ':focus': 'var(--primary)',
    },
    fontSize: '0.875rem',
    lineHeight: 1,
    fontWeight: 500,
    textDecoration: 'none',
    boxShadow: { default: 'none', ':focus-visible': focusRing },
    outline: 'none',
    userSelect: 'none',
    transitionProperty: transition,
    transitionTimingFunction: ease,
    transitionDuration: '300ms',
    '--blog-arrow-shift': {
      default: '0px',
      ':hover': { default: null, '@media (hover: hover)': '0.25rem' },
    },
  },
  // The link already turns primary on hover, so the arrow follows currentColor.
  arrow: {
    width: 16,
    height: 16,
    color: 'currentColor',
    transform: 'translateX(var(--blog-arrow-shift))',
    transitionProperty: 'transform',
    transitionTimingFunction: ease,
    transitionDuration: '300ms',
  },
  emptyLink: {
    display: 'block',
    borderRadius: 'calc(var(--radius) - 2px)',
    padding: 12,
    color: {
      default: 'var(--foreground)',
      ':hover': { default: null, '@media (hover: hover)': 'var(--primary)' },
      ':focus': 'var(--primary)',
    },
    lineHeight: 1,
    textDecoration: 'none',
    boxShadow: { default: 'none', ':focus-visible': focusRing },
    outline: 'none',
    userSelect: 'none',
    transitionProperty: transition,
    transitionTimingFunction: ease,
    transitionDuration: '300ms',
  },
  emptyTitle: { fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 500 },
  emptyDescription: {
    marginTop: 4,
    color: 'var(--muted-foreground)',
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
});

interface BlogPostDropdownItemProps {
  post: { slug: string; title: string; description: string; pubDate: Date };
  index: number;
}

// Blog Dropdown Item with improved tech design
function BlogPostDropdownItem({ post, index }: BlogPostDropdownItemProps) {
  return (
    <li
      {...stylex.props(styles.enter, styles.postItem)}
      style={{ animationDelay: `${(index + 1) * 50}ms` }}
    >
      <NavigationMenuLink asChild xstyle={styles.card}>
        <a href={`/blog/${post.slug}`}>
          <div {...stylex.props(styles.body)}>
            <h4 {...stylex.props(styles.title)}>{post.title}</h4>
            <p {...stylex.props(styles.description)}>{post.description}</p>
            <div {...stylex.props(styles.metadata)}>
              <div {...stylex.props(styles.rule)} aria-hidden="true" />
              <span {...stylex.props(styles.date)}>
                {formatDate(post.pubDate)}
              </span>
            </div>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

import type { SiteSettings } from '@bdkinc/content';
interface BlogDropdownProps {
  copy: Pick<
    SiteSettings['navigation'],
    'blog' | 'recentPosts' | 'allPosts' | 'visitBlog' | 'blogDescription'
  >;
  blogPosts: Array<{
    slug: string;
    title: string;
    description: string;
    pubDate: Date;
  }>;
}

export function BlogDropdown({ blogPosts, copy }: BlogDropdownProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger xstyle={styles.trigger}>
        {copy.blog}
      </NavigationMenuTrigger>
      <NavigationMenuContent xstyle={styles.content}>
        <ul {...stylex.props(styles.list)}>
          {/* Recent Posts */}
          {blogPosts.length > 0 ? (
            <>
              <li {...stylex.props(styles.enter, styles.headingItem)}>
                <div {...stylex.props(styles.heading)}>{copy.recentPosts}</div>
              </li>
              {blogPosts.slice(0, 3).map((post, index) => (
                <BlogPostDropdownItem
                  key={post.slug}
                  post={post}
                  index={index}
                />
              ))}
              {/* View All Link */}
              <li
                {...stylex.props(styles.enter, styles.footerItem)}
                style={{
                  animationDelay: `${(blogPosts.slice(0, 3).length + 1) * 50}ms`,
                }}
              >
                <NavigationMenuLink asChild xstyle={styles.footerLink}>
                  <a href="/blog">
                    <span>{copy.allPosts}</span>
                    <PiArrowRight
                      {...stylex.props(styles.arrow)}
                      aria-hidden="true"
                    />
                  </a>
                </NavigationMenuLink>
              </li>
            </>
          ) : (
            <li {...stylex.props(styles.enter)}>
              <NavigationMenuLink asChild xstyle={styles.emptyLink}>
                <a href="/blog">
                  <div {...stylex.props(styles.emptyTitle)}>
                    {copy.visitBlog}
                  </div>
                  <p {...stylex.props(styles.emptyDescription)}>
                    {copy.blogDescription}
                  </p>
                </a>
              </NavigationMenuLink>
            </li>
          )}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
