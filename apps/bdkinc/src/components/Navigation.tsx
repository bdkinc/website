import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';
import { PiList, PiX, PiArrowRight } from 'react-icons/pi';
import {
  Button,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  cn,
} from '@bdkinc/design-system';
import { formatDate } from '@/lib/utils';
import { iconMap } from '@/lib/icons';
import { ServicesDropdown } from '@/components/ServicesDropdown';
import { BlogDropdown } from '@/components/BlogDropdown';

interface NavigationProps {
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
  services,
  blogPosts = [],
  currentPath,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isCurrent = (href: string) =>
    currentPath === href ||
    (href !== '/' && currentPath?.startsWith(`${href}/`));

  const mobileLinkClass =
    'text-muted-foreground hover:text-primary hover:bg-accent/40 focus-visible:ring-ring focus-visible:ring-offset-background aria-[current=page]:text-primary flex min-h-11 items-center rounded-md px-3 py-2 transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none';

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
      className={cn(
        'fixed top-0 right-0 left-0 z-50 shadow-lg transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-300',
        scrolled
          ? 'glass border-primary/10 border-b backdrop-blur-xl'
          : 'bg-transparent shadow-sm backdrop-blur-sm'
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative flex h-20 items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="focus-visible:ring-ring focus-visible:ring-offset-background flex items-center rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="BDKinc home"
            aria-current={isCurrent('/') ? 'page' : undefined}
          >
            <Logo />
          </a>

          {/* Desktop Navigation - Centered on window */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {/* About */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/about"
                    aria-current={isCurrent('/about') ? 'page' : undefined}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'hover:text-primary bg-transparent! transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent!'
                    )}
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Services Dropdown */}
                <ServicesDropdown services={services} />

                {/* Blog Dropdown */}
                <BlogDropdown blogPosts={blogPosts} />
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA + Theme Toggle - Desktop */}
          <div className="z-10 hidden items-center gap-6 md:flex">
            <Button asChild>
              <a href="/contact">Get In Touch</a>
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-controls="mobile-navigation"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close main menu' : 'Open main menu'}
              type="button"
              className="hover:bg-accent focus-visible:ring-ring focus-visible:ring-offset-background flex h-11 min-h-11 w-11 min-w-11 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {isOpen ? (
                <PiX className="text-foreground h-6 w-6" aria-hidden="true" />
              ) : (
                <PiList
                  className="text-foreground h-6 w-6"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          id="mobile-navigation"
          className="glass animate-in slide-in-from-top-2 fade-in fill-mode-both border-t duration-200 md:hidden"
        >
          <div className="space-y-1 px-2 pt-2 pb-3">
            <ul className="space-y-1">
              <li>
                <a
                  href="/"
                  className={mobileLinkClass}
                  aria-current={isCurrent('/') ? 'page' : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className={mobileLinkClass}
                  aria-current={isCurrent('/about') ? 'page' : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  About
                </a>
              </li>
            </ul>

            {/* Mobile Services Section */}
            <section aria-labelledby="mobile-services-heading" className="pt-2">
              <p
                id="mobile-services-heading"
                className="text-foreground px-3 py-2 text-sm font-medium"
              >
                Services
              </p>
              <ul className="space-y-1">
                {services.map((service) => {
                  const Icon = iconMap[service.icon];
                  const href = `/services/${service.slug}`;
                  return (
                    <li key={service.slug}>
                      <a
                        href={href}
                        aria-current={isCurrent(href) ? 'page' : undefined}
                        onClick={() => setIsOpen(false)}
                        className="text-muted-foreground hover:text-primary hover:bg-accent/40 focus-visible:ring-ring focus-visible:ring-offset-background aria-[current=page]:text-primary flex min-h-11 items-start gap-2 rounded-md px-3 py-2 transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        {Icon && (
                          <div
                            style={{
                              viewTransitionName: `service-icon-${service.slug}`,
                            }}
                          >
                            <Icon
                              className="text-accent mt-0.5 h-4 w-4 shrink-0 transition-colors duration-300"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                        <span className="min-w-0 flex-1">
                          <span
                            className="block text-sm font-medium"
                            style={{
                              viewTransitionName: `service-title-${service.slug}`,
                            }}
                          >
                            {service.title}
                          </span>
                          <span
                            className="text-muted-foreground line-clamp-1 block text-xs"
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
            <section aria-labelledby="mobile-blog-heading" className="pt-2">
              <p
                id="mobile-blog-heading"
                className="text-foreground px-3 py-2 text-sm font-medium"
              >
                Blog
              </p>
              <ul className="space-y-1">
                {blogPosts.length > 0 ? (
                  <>
                    {blogPosts.slice(0, 3).map((post) => (
                      <li key={post.slug}>
                        <a
                          href={`/blog/${post.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="text-muted-foreground hover:text-primary hover:bg-accent/40 focus-visible:ring-ring focus-visible:ring-offset-background flex min-h-11 flex-col justify-center rounded-md px-3 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                          <span className="line-clamp-2 text-sm font-medium">
                            {post.title}
                          </span>
                          <span className="text-muted-foreground mt-0.5 text-xs">
                            {formatDate(post.pubDate)}
                          </span>
                        </a>
                      </li>
                    ))}
                    <li>
                      <a
                        href="/blog"
                        onClick={() => setIsOpen(false)}
                        className="text-primary hover:bg-accent/40 focus-visible:ring-ring focus-visible:ring-offset-background flex min-h-11 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        View All Posts
                        <PiArrowRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </li>
                  </>
                ) : (
                  <li>
                    <a
                      href="/blog"
                      onClick={() => setIsOpen(false)}
                      className={mobileLinkClass}
                      aria-current={isCurrent('/blog') ? 'page' : undefined}
                    >
                      Visit Blog
                    </a>
                  </li>
                )}
              </ul>
            </section>

            {/* Contact CTA */}
            <div className="border-border/40 mt-3 border-t pt-3">
              <Button
                asChild
                variant="outline"
                className="w-full justify-center"
              >
                <a href="/contact" onClick={() => setIsOpen(false)}>
                  Get In Touch
                  <PiArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
