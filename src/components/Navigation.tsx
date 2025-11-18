import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { Logo } from '@/components/Logo';
import { Menu, X, ArrowRight } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
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
  currentPath = '',
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Determine if we should show transitions
  const isServicesPage = currentPath.startsWith('/services');
  const showTransitions = !isServicesPage;

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
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass border-primary/10 border-b shadow-lg backdrop-blur-xl'
          : 'bg-transparent shadow-sm backdrop-blur-sm'
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative flex h-16 items-center justify-between">
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
                      'hover:text-primary bg-transparent! transition-all hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent!'
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
                      'hover:text-primary bg-transparent! transition-all hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent!'
                    )}
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Services Dropdown */}
                <ServicesDropdown
                  services={services}
                  showTransitions={showTransitions}
                />

                {/* Blog Dropdown */}
                <BlogDropdown blogPosts={blogPosts} />

                {/* Contact */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/contact"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'hover:text-primary bg-transparent! transition-all hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent!'
                    )}
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Theme Toggle - Desktop */}
          <div className="z-10 hidden items-center md:flex">
            <ThemeToggle />
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-accent rounded-md p-2"
            >
              {isOpen ? (
                <X className="text-foreground h-6 w-6" />
              ) : (
                <Menu className="text-foreground h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="glass border-t md:hidden">
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
                        {...(showTransitions && {
                          style: {
                            viewTransitionName: `service-icon-${service.slug}`,
                          } as any,
                        })}
                      >
                        <Icon className="text-accent mt-0.5 h-4 w-4 shrink-0 transition-colors duration-300" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-sm font-medium"
                        {...(showTransitions && {
                          style: {
                            viewTransitionName: `service-title-${service.slug}`,
                          } as any,
                        })}
                      >
                        {service.title}
                      </div>
                      <div
                        className="text-muted-foreground line-clamp-1 text-xs"
                        {...(showTransitions && {
                          style: {
                            viewTransitionName: `service-description-${service.slug}`,
                          } as any,
                        })}
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

            {/* Contact */}
            <a
              href="/contact"
              className="text-muted-foreground hover:text-primary hover:bg-accent block rounded-md px-3 py-2 transition-colors duration-300"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
