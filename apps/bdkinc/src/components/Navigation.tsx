import { useState, useEffect } from 'react';
import * as stylex from '@stylexjs/stylex';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';
import { PiList, PiX, PiArrowRight } from 'react-icons/pi';
import {
  Button,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from '@bdkinc/design-system';
import { formatDate } from '@/lib/utils';
import { iconMap } from '@/lib/icons';
import { ServicesDropdown } from '@/components/ServicesDropdown';
import { BlogDropdown } from '@/components/BlogDropdown';

import type { SiteSettings } from '@bdkinc/content';

const enterFromTop = stylex.keyframes({
  from: { opacity: 0, transform: 'translate3d(0, -0.5rem, 0)' },
});
const ease = 'cubic-bezier(0.4, 0, 0.2, 1)';
const transition =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';
const colorTransition =
  'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke';
const focusRing = '0 0 0 2px var(--background), 0 0 0 4px var(--ring)';

const styles = stylex.create({
  nav: {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 50,
    boxShadow:
      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    transitionProperty: transition,
    transitionTimingFunction: ease,
    transitionDuration: '300ms',
  },
  // .glass (unlayered) supplies the scrolled background and blur.
  scrolled: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
  },
  unscrolled: {
    backgroundColor: 'transparent',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    backdropFilter: 'blur(8px)',
  },
  container: { maxWidth: '80rem', marginInline: 'auto' },
  bar: {
    position: 'relative',
    display: 'flex',
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 'calc(var(--radius) - 2px)',
    boxShadow: { default: 'none', ':focus-visible': focusRing },
    outline: 'none',
  },
  desktopMenu: {
    position: 'absolute',
    left: '50%',
    display: { default: 'none', '@media (min-width: 768px)': 'flex' },
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'translateX(-50%)',
  },
  // Matches the dropdown triggers: trigger sizing on the link primitive, with
  // the transparent background forced in every state.
  aboutLink: {
    display: 'inline-flex',
    height: 44,
    width: 'max-content',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'calc(var(--radius) - 2px)',
    paddingInline: 16,
    paddingBlock: 8,
    fontWeight: 500,
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
  desktopActions: {
    zIndex: 10,
    display: { default: 'none', '@media (min-width: 768px)': 'flex' },
    alignItems: 'center',
    gap: 24,
  },
  mobileActions: {
    display: { default: 'flex', '@media (min-width: 768px)': 'none' },
    alignItems: 'center',
    gap: 8,
  },
  menuButton: {
    display: 'flex',
    width: 44,
    minWidth: 44,
    height: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'calc(var(--radius) - 2px)',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, '@media (hover: hover)': 'var(--accent)' },
    },
    boxShadow: { default: 'none', ':focus-visible': focusRing },
    outline: 'none',
    transitionProperty: colorTransition,
    transitionTimingFunction: ease,
    transitionDuration: '150ms',
  },
  menuIcon: { width: 24, height: 24, color: 'var(--foreground)' },
  mobilePanel: {
    display: { default: 'block', '@media (min-width: 768px)': 'none' },
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    animationName: enterFromTop,
    animationDuration: '200ms',
    animationTimingFunction: 'ease',
    animationFillMode: 'both',
  },
  mobileBody: { paddingInline: 8, paddingTop: 8, paddingBottom: 12 },
  // Same spacing as the former space-y-1 stacks.
  stacked: { marginBottom: { default: 4, ':last-child': 0 } },
  section: { paddingTop: 8 },
  sectionHeading: {
    paddingInline: 12,
    paddingBlock: 8,
    color: 'var(--foreground)',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
  },
  mobileLink: {
    display: 'flex',
    minHeight: 44,
    alignItems: 'center',
    borderRadius: 'calc(var(--radius) - 2px)',
    paddingInline: 12,
    paddingBlock: 8,
    color: {
      default: 'var(--muted-foreground)',
      ':hover': { default: null, '@media (hover: hover)': 'var(--primary)' },
      '[aria-current="page"]': 'var(--primary)',
    },
    backgroundColor: {
      default: 'transparent',
      ':hover': {
        default: null,
        '@media (hover: hover)':
          'color-mix(in oklab, var(--accent) 40%, transparent)',
      },
    },
    boxShadow: { default: 'none', ':focus-visible': focusRing },
    outline: 'none',
    transitionProperty: colorTransition,
    transitionTimingFunction: ease,
    transitionDuration: '300ms',
  },
  serviceLink: { alignItems: 'flex-start', gap: 8 },
  serviceIcon: {
    marginTop: 2,
    width: 16,
    height: 16,
    flexShrink: 0,
    color: 'var(--accent)',
    transitionProperty: colorTransition,
    transitionTimingFunction: ease,
    transitionDuration: '300ms',
  },
  serviceText: { minWidth: 0, flex: '1' },
  serviceTitle: {
    display: 'block',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
  },
  // The legacy block display overrode line-clamp's -webkit-box display.
  serviceDescription: {
    display: 'block',
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
    color: 'var(--muted-foreground)',
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
  postLink: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    transitionDuration: '150ms',
  },
  postTitle: {
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
  },
  postDate: {
    marginTop: 2,
    color: 'var(--muted-foreground)',
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
  allPostsLink: {
    gap: 8,
    color: 'var(--primary)',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
    transitionDuration: '150ms',
  },
  arrow: { width: 16, height: 16 },
  contact: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'color-mix(in oklab, var(--border) 40%, transparent)',
    paddingTop: 12,
  },
  contactButton: { width: '100%', justifyContent: 'center' },
  contactArrow: { marginLeft: 8, width: 16, height: 16 },
});

interface NavigationProps {
  copy: SiteSettings['navigation'];
  brand: SiteSettings['brand'];
  services: Array<{
    slug: string;
    title: string;
    description: string;
    icon: string;
  }>;
  blogPosts?: Array<{
    slug: string;
    title: string;
    description: string;
    pubDate: Date;
  }>;
  currentPath?: string;
}

export default function Navigation({
  copy,
  brand,
  services,
  blogPosts = [],
  currentPath,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isCurrent = (href: string) =>
    currentPath === href ||
    (href !== '/' && currentPath?.startsWith(`${href}/`));

  const navProps = stylex.props(
    styles.nav,
    scrolled ? styles.scrolled : styles.unscrolled
  );
  const mobilePanelProps = stylex.props(styles.mobilePanel);

  // Track scroll position for enhanced blur effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu with Escape for keyboard users
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <nav
      aria-label="Main navigation"
      {...navProps}
      className={scrolled ? `${navProps.className} glass` : navProps.className}
    >
      <div {...stylex.props(styles.container)}>
        <div {...stylex.props(styles.bar)}>
          {/* Logo */}
          <a
            href="/"
            {...stylex.props(styles.logoLink)}
            aria-label={copy.homeLabel}
            aria-current={isCurrent('/') ? 'page' : undefined}
          >
            <Logo copy={brand} />
          </a>

          {/* Desktop Navigation - Centered on window */}
          <div {...stylex.props(styles.desktopMenu)}>
            <NavigationMenu>
              <NavigationMenuList>
                {/* About */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/about"
                    aria-current={isCurrent('/about') ? 'page' : undefined}
                    xstyle={styles.aboutLink}
                  >
                    {copy.about}
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Services Dropdown */}
                <ServicesDropdown services={services} copy={copy} />

                {/* Blog Dropdown */}
                <BlogDropdown blogPosts={blogPosts} copy={copy} />
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA + Theme Toggle - Desktop */}
          <div {...stylex.props(styles.desktopActions)}>
            <Button asChild>
              <a href={copy.contactHref}>{copy.contact}</a>
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile menu button and theme toggle */}
          <div {...stylex.props(styles.mobileActions)}>
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-controls="mobile-navigation"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close main menu' : 'Open main menu'}
              type="button"
              {...stylex.props(styles.menuButton)}
            >
              {isOpen ? (
                <PiX {...stylex.props(styles.menuIcon)} aria-hidden="true" />
              ) : (
                <PiList {...stylex.props(styles.menuIcon)} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          id="mobile-navigation"
          {...mobilePanelProps}
          className={`${mobilePanelProps.className} glass`}
        >
          <div {...stylex.props(styles.mobileBody)}>
            <ul {...stylex.props(styles.stacked)}>
              <li {...stylex.props(styles.stacked)}>
                <a
                  href="/"
                  {...stylex.props(styles.mobileLink)}
                  aria-current={isCurrent('/') ? 'page' : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  {copy.home}
                </a>
              </li>
              <li {...stylex.props(styles.stacked)}>
                <a
                  href="/about"
                  {...stylex.props(styles.mobileLink)}
                  aria-current={isCurrent('/about') ? 'page' : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  {copy.about}
                </a>
              </li>
            </ul>

            {/* Mobile Services Section */}
            <section
              aria-labelledby="mobile-services-heading"
              {...stylex.props(styles.section, styles.stacked)}
            >
              <p
                id="mobile-services-heading"
                {...stylex.props(styles.sectionHeading)}
              >
                {copy.services}
              </p>
              <ul>
                {services.map((service) => {
                  const Icon = iconMap[service.icon];
                  const href = `/services/${service.slug}`;
                  return (
                    <li key={service.slug} {...stylex.props(styles.stacked)}>
                      <a
                        href={href}
                        aria-current={isCurrent(href) ? 'page' : undefined}
                        onClick={() => setIsOpen(false)}
                        {...stylex.props(styles.mobileLink, styles.serviceLink)}
                      >
                        {Icon && (
                          <div
                            style={{
                              viewTransitionName: `service-icon-${service.slug}`,
                            }}
                          >
                            <Icon
                              {...stylex.props(styles.serviceIcon)}
                              aria-hidden="true"
                            />
                          </div>
                        )}
                        <span {...stylex.props(styles.serviceText)}>
                          <span
                            {...stylex.props(styles.serviceTitle)}
                            style={{
                              viewTransitionName: `service-title-${service.slug}`,
                            }}
                          >
                            {service.title}
                          </span>
                          <span
                            {...stylex.props(styles.serviceDescription)}
                            style={{
                              viewTransitionName: `service-description-${service.slug}`,
                            }}
                          >
                            {service.description}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Mobile Blog Section */}
            <section
              aria-labelledby="mobile-blog-heading"
              {...stylex.props(styles.section, styles.stacked)}
            >
              <p
                id="mobile-blog-heading"
                {...stylex.props(styles.sectionHeading)}
              >
                {copy.blog}
              </p>
              <ul>
                {blogPosts.length > 0 ? (
                  <>
                    {blogPosts.slice(0, 3).map((post) => (
                      <li key={post.slug} {...stylex.props(styles.stacked)}>
                        <a
                          href={`/blog/${post.slug}`}
                          onClick={() => setIsOpen(false)}
                          {...stylex.props(styles.mobileLink, styles.postLink)}
                        >
                          <span {...stylex.props(styles.postTitle)}>
                            {post.title}
                          </span>
                          <span {...stylex.props(styles.postDate)}>
                            {formatDate(post.pubDate)}
                          </span>
                        </a>
                      </li>
                    ))}
                    <li {...stylex.props(styles.stacked)}>
                      <a
                        href="/blog"
                        onClick={() => setIsOpen(false)}
                        {...stylex.props(
                          styles.mobileLink,
                          styles.allPostsLink
                        )}
                      >
                        {copy.allPosts}
                        <PiArrowRight
                          {...stylex.props(styles.arrow)}
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  </>
                ) : (
                  <li {...stylex.props(styles.stacked)}>
                    <a
                      href="/blog"
                      onClick={() => setIsOpen(false)}
                      {...stylex.props(styles.mobileLink)}
                      aria-current={isCurrent('/blog') ? 'page' : undefined}
                    >
                      {copy.visitBlog}
                    </a>
                  </li>
                )}
              </ul>
            </section>

            {/* Contact CTA */}
            <div {...stylex.props(styles.contact)}>
              <Button asChild variant="outline" xstyle={styles.contactButton}>
                <a href={copy.contactHref} onClick={() => setIsOpen(false)}>
                  {copy.contact}
                  <PiArrowRight
                    {...stylex.props(styles.contactArrow)}
                    aria-hidden="true"
                  />
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
