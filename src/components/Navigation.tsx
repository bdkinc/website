import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { Logo } from '@/components/Logo';
import { Menu, X } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { iconMap } from '@/lib/icons';

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

// Service Dropdown Item with mouse-tracking spotlight
function ServiceDropdownItem({
  service,
  icon: Icon,
  index,
  showTransitions,
}: {
  service: { slug: string; title: string; description: string };
  icon: any;
  index: number;
  showTransitions: boolean;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <NavigationMenuLink asChild>
        <a
          href={`/services/${service.slug}`}
          className="group relative block overflow-hidden rounded-lg border border-border/30 bg-card/40 p-5 backdrop-blur-sm no-underline transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 outline-none select-none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setMousePosition({ x, y });
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Mouse-tracking spotlight effect */}
          <div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(400px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 212, 255, 0.12), rgba(124, 58, 237, 0.08) 40%, transparent 60%)`,
            }}
          />

          <div className="relative z-10 flex flex-col items-center space-y-3 text-center">
            {/* Icon */}
            {Icon && (
              <div
                className="flex justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                {...(showTransitions && {
                  style: {
                    viewTransitionName: `service-icon-${service.slug}`,
                  } as any,
                })}
              >
                <div className="bg-primary/10 rounded-lg p-2.5">
                  <Icon className="text-primary h-10 w-10" />
                </div>
              </div>
            )}

            {/* Title */}
            <div
              className="text-foreground group-hover:text-primary text-base font-bold leading-tight transition-colors duration-300"
              {...(showTransitions && {
                style: {
                  viewTransitionName: `service-title-${service.slug}`,
                } as any,
              })}
            >
              {service.title}
            </div>

            {/* Description */}
            <p
              className="text-muted-foreground text-xs leading-relaxed"
              {...(showTransitions && {
                style: {
                  viewTransitionName: `service-description-${service.slug}`,
                } as any,
              })}
            >
              {service.description}
            </p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
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

  // Format date helper
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };


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
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      'hover:text-primary bg-transparent! transition-all hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent!'
                    )}
                  >
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background/95 backdrop-blur-xl border border-border/50">
                    <ul className="grid w-[680px] gap-4 p-6 md:w-[780px] md:grid-cols-3 lg:w-[900px]">
                      {services.map((service, index) => {
                        const Icon = iconMap[service.icon];
                        return (
                          <ServiceDropdownItem
                            key={service.slug}
                            service={service}
                            icon={Icon}
                            index={index}
                            showTransitions={showTransitions}
                          />
                        );
                      })}
                      {/* View All Link */}
                      <li
                        className="border-border/30 animate-in fade-in slide-in-from-bottom-4 fill-mode-both col-span-3 mt-2 border-t pt-4 duration-500"
                        style={{ animationDelay: `${services.length * 50}ms` }}
                      >
                        <NavigationMenuLink asChild>
                          <a
                            href="/services"
                            className="text-primary hover:text-primary/80 group flex items-center justify-center gap-2 rounded-lg p-3 text-base font-semibold tracking-wide no-underline transition-all duration-300 hover:gap-3 outline-none select-none"
                          >
                            <span>View All Services</span>
                            <svg
                              className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Blog Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      'hover:text-primary bg-transparent! transition-all hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent!'
                    )}
                  >
                    Blog
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background">
                    <ul className="w-[400px] p-4">
                      {/* Recent Posts */}
                      {blogPosts.length > 0 ? (
                        <>
                          <li className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both mb-2 duration-500">
                            <div className="text-foreground px-3 py-2 text-sm font-semibold">
                              Recent Posts
                            </div>
                          </li>
                          {blogPosts.slice(0, 3).map((post, index) => (
                            <li
                              key={post.slug}
                              className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500"
                              style={{
                                animationDelay: `${(index + 1) * 50}ms`,
                              }}
                            >
                              <NavigationMenuLink asChild>
                                <a
                                  href={`/blog/${post.slug}`}
                                  className={cn(
                                    'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-all duration-300 outline-none select-none'
                                  )}
                                >
                                  <div className="text-sm leading-snug font-medium">
                                    {post.title}
                                  </div>
                                  <p className="text-muted-foreground text-xs">
                                    {formatDate(post.pubDate)}
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          ))}
                          {/* View All Link */}
                          <li
                            className="border-input animate-in fade-in slide-in-from-bottom-4 fill-mode-both mt-2 border-t pt-2 duration-500"
                            style={{
                              animationDelay: `${(blogPosts.slice(0, 3).length + 1) * 50}ms`,
                            }}
                          >
                            <NavigationMenuLink asChild>
                              <a
                                href="/blog"
                                className={cn(
                                  'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-primary block rounded-md p-3 text-sm leading-none font-medium no-underline transition-all duration-300 outline-none select-none'
                                )}
                              >
                                View All Posts →
                              </a>
                            </NavigationMenuLink>
                          </li>
                        </>
                      ) : (
                        <li className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500">
                          <NavigationMenuLink asChild>
                            <a
                              href="/blog"
                              className={cn(
                                'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block rounded-md p-3 leading-none no-underline transition-all duration-300 outline-none select-none'
                              )}
                            >
                              <div className="text-sm font-medium">
                                Visit Blog
                              </div>
                              <p className="text-muted-foreground mt-1 text-xs">
                                Check out our latest insights
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Locations Dropdown */}
                {/* <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      "bg-transparent! hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl hover:text-primary focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent! transition-all"
                    )}
                  >
                    Locations
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background">
                    <ul className="w-[400px] p-4">
                      <li className="mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
                        <div className="px-3 py-2 text-sm font-semibold text-foreground">
                          Eastern Shore Regions
                        </div>
                      </li>
                      <li className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: "50ms" }}>
                        <NavigationMenuLink asChild>
                          <a
                            href="/locations/maryland-eastern-shore"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-snug">
                              Maryland Eastern Shore
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Cambridge, Easton, Salisbury, Ocean City
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: "100ms" }}>
                        <NavigationMenuLink asChild>
                          <a
                            href="/locations/delaware-eastern-shore"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-snug">
                              Delaware Eastern Shore
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Dover, Rehoboth Beach, Lewes, Georgetown
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem> */}

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
