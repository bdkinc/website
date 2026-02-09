import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';
import { PiList, PiX, PiArrowRight } from 'react-icons/pi';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn, formatDate } from '@/lib/utils';
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
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for enhanced blur effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-300',
        scrolled
          ? 'glass border-primary/10 border-b shadow-lg backdrop-blur-xl'
          : 'bg-transparent shadow-sm backdrop-blur-sm'
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative flex h-20 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation - Centered on window */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Home */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'hover:text-primary bg-transparent! transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent!'
                    )}
                  >
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* About */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/about"
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

                {/* Contact */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/contact"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'hover:text-primary bg-transparent! transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent!'
                    )}
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA + Theme Toggle - Desktop */}
          <div className="z-10 hidden items-center gap-3 md:flex">
            <a
              href="/contact"
              className="border-primary/50 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-sm font-semibold transition-all duration-300"
            >
              Get In Touch
              <PiArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <ThemeToggle />
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-controls="mobile-navigation"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              className="hover:bg-accent focus-visible:ring-primary/50 focus-visible:ring-offset-background rounded-md p-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {isOpen ? (
                <PiX className="text-foreground h-6 w-6" />
              ) : (
                <PiList className="text-foreground h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div id="mobile-navigation" className="glass border-t md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {/* Home */}
            <a
              href="/"
              className="text-muted-foreground hover:text-primary hover:bg-accent block rounded-md px-3 py-2 transition-colors duration-300"
            >
              Home
            </a>

            {/* About */}
            <a
              href="/about"
              className="text-muted-foreground hover:text-primary hover:bg-accent block rounded-md px-3 py-2 transition-colors duration-300"
            >
              About
            </a>

            {/* Mobile Services Section */}
            <div className="pt-2">
              <div className="text-foreground px-3 py-2 text-sm font-medium">
                Services
              </div>
              {services.map((service) => {
                const Icon = iconMap[service.icon];
                return (
                  <a
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="text-muted-foreground hover:text-primary hover:bg-accent flex items-start gap-2 rounded-md px-3 py-2 transition-colors duration-300"
                  >
                    {Icon && (
                      <div
                        style={{
                          viewTransitionName: `service-icon-${service.slug}`,
                        }}
                      >
                        <Icon className="text-accent mt-0.5 h-4 w-4 shrink-0 transition-colors duration-300" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-sm font-medium"
                        style={{
                          viewTransitionName: `service-title-${service.slug}`,
                        }}
                      >
                        {service.title}
                      </div>
                      <div
                        className="text-muted-foreground line-clamp-1 text-xs"
                        style={{
                          viewTransitionName: `service-description-${service.slug}`,
                        }}
                      >
                        {service.description}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Mobile Blog Section */}
            <div className="pt-2">
              <div className="text-foreground px-3 py-2 text-sm font-medium">
                Blog
              </div>
              {blogPosts.length > 0 ? (
                <>
                  {blogPosts.slice(0, 3).map((post) => (
                    <a
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="text-muted-foreground hover:text-primary hover:bg-accent block rounded-md px-3 py-2 transition-colors"
                    >
                      <div className="line-clamp-2 text-sm font-medium">
                        {post.title}
                      </div>
                      <div className="text-muted-foreground mt-0.5 text-xs">
                        {formatDate(post.pubDate)}
                      </div>
                    </a>
                  ))}
                  <a
                    href="/blog"
                    className="text-primary hover:bg-accent block rounded-md px-3 py-2 text-sm font-medium transition-colors"
                  >
                    View All Posts →
                  </a>
                </>
              ) : (
                <a
                  href="/blog"
                  className="text-muted-foreground hover:text-primary hover:bg-accent block rounded-md px-3 py-2 transition-colors"
                >
                  Visit Blog
                </a>
              )}
            </div>

            {/* Contact CTA */}
            <div className="border-border/40 mt-3 border-t pt-3">
              <a
                href="/contact"
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-300"
              >
                Get In Touch
                <PiArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
