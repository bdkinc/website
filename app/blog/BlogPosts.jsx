import Card from "@/components/Card";
import { cn } from "@/components/utils";
import { blogFetcher, createBlogUrl } from "@/repository/blogRepository";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

async function getBlogPosts() {
  return await blogFetcher(createBlogUrl({ sort: "desc" }));
}

export default async function BlogPosts() {
  const { data: posts } = await getBlogPosts();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-16 mb-8 xl:mb-16">
      {posts.map((post, index) =>
        index === 0 ? null : (
          <Link
            href={`/blog/${post.slug}`}
            key={post.id}
            className="transition inline-flex hover:scale-105"
            aria-label={`read more about ${post.title}`}
          >
            <article id={`post-${post.id}`} className="h-full" key={post.id}>
              <Card
                className={cn(
                  "h-full flex flex-col border border-slate-300 dark:border-bdk-blue",
                )}
              >
                {post.featured?.data && (
                  <div className="mb-6">
                    <Image
                      src={post.featured?.data.thumbnails[3].url}
                      alt={`${post.title} Preview`}
                      width={post.featured?.data.thumbnails[3].width}
                      height={post.featured?.data.thumbnails[3].height}
                      className="w-full"
                    />
                  </div>
                )}
                <Card.Title className="px-6">
                  <h3 className="text-xl font-semibold font-heading text-gray-800 dark:text-gray-100 mb-0 ">
                    {post.title}
                  </h3>
                  <small className="text-xs">by {post.author}</small>
                </Card.Title>
                <Card.Body className="px-6 pb-6">
                  {post.lead ? (
                    post.lead
                  ) : (
                    <ReactMarkdown
                      children={`${post.body
                        .split(" ")
                        .slice(0, 30)
                        .join(" ")} ...`}
                    />
                  )}
                </Card.Body>
              </Card>
            </article>
          </Link>
        ),
      )}
    </div>
  );
}
