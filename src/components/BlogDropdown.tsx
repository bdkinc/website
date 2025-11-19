import { ArrowRight } from 'lucide-react';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { cn, formatDate } from '@/lib/utils';

interface BlogPostDropdownItemProps {
  post: { slug: string; title: string; description: string; pubDate: Date };
  index: number;
}

// Blog Dropdown Item with improved tech design
function BlogPostDropdownItem({
  post,
  index,
}: BlogPostDropdownItemProps) {
  return (
    <li
      className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500"
      style={{ animationDelay: `${(index + 1) * 50}ms` }}
    >
      <NavigationMenuLink asChild>
        <a
          href={`/blog/${post.slug}`}
          className="group relative block overflow-hidden rounded-lg border border-border/40 bg-card/30 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-card/60 hover:shadow-[0_4px_20px_-4px_rgba(0,212,255,0.1)] outline-none select-none"
        >
          <div className="flex flex-col gap-1.5">
            <h4 className="text-sm font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary">
              {post.title}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {post.description}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-px w-4 bg-border group-hover:bg-primary/30 transition-colors" />
              <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider group-hover:text-primary/60 transition-colors">
                {formatDate(post.pubDate)}
              </span>
            </div>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

interface BlogDropdownProps {
  blogPosts: Array<{
    slug: string;
    title: string;
    description: string;
    pubDate: Date;
  }>;
}

export function BlogDropdown({ blogPosts }: BlogDropdownProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          'hover:text-primary bg-transparent! transition-all hover:bg-[oklch(0.205_0_0/0.15)] hover:backdrop-blur-xl focus:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent!'
        )}
      >
        Blog
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-background">
        <ul className="w-[400px] p-4 space-y-3">
          {/* Recent Posts */}
          {blogPosts.length > 0 ? (
            <>
              <li className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both mb-2 duration-500">
                <div className="text-foreground px-3 py-2 text-sm font-semibold">
                  Recent Posts
                </div>
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
                className="border-input animate-in fade-in slide-in-from-bottom-4 fill-mode-both mt-2 border-t pt-2 duration-500"
                style={{
                  animationDelay: `${(blogPosts.slice(0, 3).length + 1) * 50}ms`,
                }}
              >
                <NavigationMenuLink asChild>
                  <a
                    href="/blog"
                    className={cn(
                      'group flex flex-row items-center gap-2 rounded-md p-3 text-sm leading-none font-medium text-foreground no-underline transition-all duration-300 hover:gap-3 hover:bg-accent hover:text-primary focus:bg-accent focus:text-primary outline-none select-none'
                    )}
                  >
                    <span>View All Posts</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
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
  );
}
