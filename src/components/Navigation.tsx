import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { iconMap } from "@/lib/icons";

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
  currentPath = "",
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Determine if we should show transitions
  const isServicesPage = currentPath.startsWith('/services');
  const showTransitions = !isServicesPage;

  // Format date helper
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation - Centered on window */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Home */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent! hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl hover:text-primary focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent! transition-all"
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
                      "bg-transparent! hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl hover:text-primary focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent! transition-all"
                    )}
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Services Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      "bg-transparent! hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl hover:text-primary focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent! transition-all"
                    )}
                  >
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background">
                    <ul className="grid w-[600px] gap-3 p-4 md:w-[700px] md:grid-cols-3 lg:w-[800px] ">
                      {services.map((service, index) => {
                        const Icon = iconMap[service.icon];
                        return (
                          <li 
                            key={service.slug}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <NavigationMenuLink asChild>
                              <a
                                href={`/services/${service.slug}`}
                                className={cn(
                                  "block select-none space-y-2 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-center"
                                )}
                              >
                                {Icon && (
                                  <div 
                                    className="flex justify-center mb-2"
                                    {...(showTransitions && {
                                      style: { ['view-transition-name']: `service-icon-${service.slug}` } as any
                                    })}
                                  >
                                    <Icon className="h-8 w-8 text-primary" />
                                  </div>
                                )}
                                <div 
                                  className="text-sm font-medium leading-none"
                                  {...(showTransitions && {
                                    style: { ['view-transition-name']: `service-title-${service.slug}` } as any
                                  })}
                                >
                                  {service.title}
                                </div>
                                <p 
                                  className="line-clamp-2 text-xs leading-snug text-muted-foreground"
                                  {...(showTransitions && {
                                    style: { ['view-transition-name']: `service-description-${service.slug}` } as any
                                  })}
                                >
                                  {service.description}
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                      {/* View All Link */}
                      <li 
                        className="mt-2 pt-2 border-t border-input col-span-3 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                        style={{ animationDelay: `${services.length * 50}ms` }}
                      >
                        <NavigationMenuLink asChild>
                          <a
                            href="/services"
                            className={cn(
                              "block select-none rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-primary font-medium text-sm"
                            )}
                          >
                            View All Services →
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
                      "bg-transparent! hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl hover:text-primary focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent! transition-all"
                    )}
                  >
                    Blog
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background">
                    <ul className="w-[400px] p-4">
                      {/* Recent Posts */}
                      {blogPosts.length > 0 ? (
                        <>
                          <li className="mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
                            <div className="px-3 py-2 text-sm font-semibold text-foreground">
                              Recent Posts
                            </div>
                          </li>
                          {blogPosts.slice(0, 3).map((post, index) => (
                            <li 
                              key={post.slug}
                              className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                              style={{ animationDelay: `${(index + 1) * 50}ms` }}
                            >
                              <NavigationMenuLink asChild>
                                <a
                                  href={`/blog/${post.slug}`}
                                  className={cn(
                                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  )}
                                >
                                  <div className="text-sm font-medium leading-snug">
                                    {post.title}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(post.pubDate)}
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          ))}
                          {/* View All Link */}
                          <li 
                            className="mt-2 pt-2 border-t border-input animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                            style={{ animationDelay: `${(blogPosts.slice(0, 3).length + 1) * 50}ms` }}
                          >
                            <NavigationMenuLink asChild>
                              <a
                                href="/blog"
                                className={cn(
                                  "block select-none rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-primary font-medium text-sm"
                                )}
                              >
                                View All Posts →
                              </a>
                            </NavigationMenuLink>
                          </li>
                        </>
                      ) : (
                        <li className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
                          <NavigationMenuLink asChild>
                            <a
                              href="/blog"
                              className={cn(
                                "block select-none rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              )}
                            >
                              <div className="text-sm font-medium">
                                Visit Blog
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
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
                <NavigationMenuItem>
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
                </NavigationMenuItem>

                {/* Contact */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/contact"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent! hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl hover:text-primary focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent! transition-all"
                    )}
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Theme Toggle - Desktop */}
          <div className="hidden md:flex items-center z-10">
            <ThemeToggle />
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-accent"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t glass">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Home */}
            <a
              href="/"
              className="block px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors duration-300"
            >
              Home
            </a>

            {/* About */}
            <a
              href="/about"
              className="block px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors duration-300"
            >
              About
            </a>

            {/* Mobile Services Section */}
            <div className="pt-2">
              <div className="px-3 py-2 text-sm font-medium text-foreground">
                Services
              </div>
              {services.map((service) => {
                const Icon = iconMap[service.icon];
                return (
                  <a
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="flex items-start gap-2 px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors duration-300"
                  >
                    {Icon && (
                      <div
                        {...(showTransitions && {
                          style: { ['view-transition-name']: `service-icon-${service.slug}` } as any
                        })}
                      >
                        <Icon className="h-4 w-4 text-accent mt-0.5 shrink-0 transition-colors duration-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div 
                        className="text-sm font-medium"
                        {...(showTransitions && {
                          style: { ['view-transition-name']: `service-title-${service.slug}` } as any
                        })}
                      >
                        {service.title}
                      </div>
                      <div 
                        className="text-xs text-muted-foreground line-clamp-1"
                        {...(showTransitions && {
                          style: { ['view-transition-name']: `service-description-${service.slug}` } as any
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
              <div className="px-3 py-2 text-sm font-medium text-foreground">
                Blog
              </div>
              {blogPosts.length > 0 ? (
                <>
                  {blogPosts.slice(0, 3).map((post) => (
                    <a
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="block px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                    >
                      <div className="text-sm font-medium line-clamp-2">
                        {post.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(post.pubDate)}
                      </div>
                    </a>
                  ))}
                  <a
                    href="/blog"
                    className="block px-3 py-2 rounded-md text-primary hover:bg-accent transition-colors font-medium text-sm"
                  >
                    View All Posts →
                  </a>
                </>
              ) : (
                <a
                  href="/blog"
                  className="block px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                >
                  Visit Blog
                </a>
              )}
            </div>

            {/* Contact */}
            <a
              href="/contact"
              className="block px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors duration-300"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
