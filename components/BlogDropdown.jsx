import { blogFetcher, createBlogUrl } from "@/repository/blogRepository";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";

async function getBlogPosts() {
  return await blogFetcher(createBlogUrl({ limit: "3", sort: "desc" }));
}

export default async function BlogDropdown() {
  const { data: posts } = await getBlogPosts();

  return (
    <>
      {posts.data.map((child) => (
        <Link
          href={`/blog/${child.slug}`}
          key={child.slug}
          passHref
          legacyBehavior
        >
          <NavigationMenu.Link className="block leading-0 py-3 px-4 outline-none select-none leading-0 focus:ring-2 border-2 border-transparent hover:border-bdk-blue">
            {child.title}
          </NavigationMenu.Link>
        </Link>
      ))}
      <Link href="/blog" passHref legacyBehavior>
        <NavigationMenu.Link className="block leading-0 py-3 px-4 outline-none select-none leading-0 focus:ring-2 border-2 border-transparent hover:border-bdk-blue">
          All Posts
        </NavigationMenu.Link>
      </Link>
    </>
  );
}
