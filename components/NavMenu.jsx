"use client";

import useBlogPosts from "@/components/useBlogPosts";
import { createBlogUrl } from "@/repository/blogRepository.js";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RxCaretDown } from "react-icons/rx";

const navItems = [
  { href: "/", title: "Home" },
  {
    href: "/about",
    title: "About",
    children: [
      { title: "Who we are", href: "/about" },
      { title: "Our Team", href: "/our-team" },
    ],
  },
  {
    href: "/solutions",
    title: "Solutions",
    children: [
      { title: "Managed Services", href: "/solutions/managed-services" },
      { title: "Cloud Services", href: "/solutions/cloud-services" },
      {
        title: "Development Services",
        href: "/solutions/development-services",
      },
    ],
  },
  { href: "/blog", title: "Blog", children: [] },
  { href: "/contact", title: "Contact" },
  { href: "/quote", title: "Request a Quote" },
];

const NavLink = (props) => {
  const router = useRouter();
  const isActive = router.asPath === props.href;

  return (
    <NavigationMenu.Link active={isActive} asChild>
      <Link {...props} />
    </NavigationMenu.Link>
  );
};

function BlogDropdown() {
  const { posts, isLoading, isError } = useBlogPosts(
    createBlogUrl({ limit: "3", sort: "desc" }),
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching posts</div>;

  return (
    <>
      {posts.data.map((child) => (
        <NavLink
          href={`/blog/${child.slug}`}
          key={child.slug}
          className="block leading-0 py-3 px-4 outline-none select-none leading-0 focus:ring-2 border-2 border-transparent hover:border-bdk-blue"
        >
          {child.title}
        </NavLink>
      ))}
      <NavLink
        href="/blog"
        className="block leading-0 py-3 px-4 outline-none select-none leading-0 focus:ring-2 border-2 border-transparent hover:border-bdk-blue"
      >
        All Posts
      </NavLink>
    </>
  );
}

export default function NavMenu() {
  return (
    <NavigationMenu.Root className="relative flex justify-center w-full z-1 font-semibold text-lg">
      <NavigationMenu.List className="flex justify-center py-2 list-none m-0">
        {navItems.map((item) =>
          item.hasOwnProperty("children") ? (
            <NavigationMenu.Item key={item.href}>
              <NavigationMenu.Trigger className="text-lg py-3 px-4 outline-none select-none leading-0 flex justify-between items-center gap-1 focus:ring-2 border-2 border-transparent hover:border-bdk-blue">
                {item.title}{" "}
                <RxCaretDown
                  className="relative top-[1px] transition caret-down"
                  aria-hidden
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="top-0 left-0 w-full md:absolute md:w-auto">
                {item.href === "/blog" ? (
                  <div className="min-w-[360px] p-4">
                    <BlogDropdown />
                  </div>
                ) : (
                  <div className="min-w-[360px] p-4">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.href}
                        href={child.href}
                        className="block leading-0 py-3 px-4 outline-none select-none leading-0 focus:ring-2 border-2 border-transparent hover:border-bdk-blue"
                      >
                        {child.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ) : (
            <NavigationMenu.Item key={item.href}>
              <NavLink
                href={item.href}
                className="text-lg block leading-0 py-3 px-4 outline-none select-none leading-0 focus:ring-2 border-2 border-transparent hover:border-bdk-blue"
              >
                {item.title}
              </NavLink>
            </NavigationMenu.Item>
          ),
        )}
      </NavigationMenu.List>
      <div
        className="absolute flex justify-center w-full left-0 top-[100%]"
        style={{ perspective: "2000px" }}
      >
        <NavigationMenu.Viewport className="h-[var(--radix-navigation-menu-viewport-height)] w-full md:w-[var(--radix-navigation-menu-viewport-width)] relative origin-top-center mt-3  bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-900 overflow-hidden top-[100%] shadow-lg" />
      </div>
    </NavigationMenu.Root>
  );
}
