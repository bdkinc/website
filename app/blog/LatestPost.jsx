import Button from "@/components/Button";
import { blogFetcher, createBlogUrl } from "@/repository/blogRepository";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

async function getLatestPost() {
  return await blogFetcher(createBlogUrl({ sort: "desc", limit: "1" }));
}

export default async function LatestPost() {
  const { data } = await getLatestPost();
  const featuredPost = data[0] || {};

  return (
    <article>
      <div className="flex">
        <aside className="w-3/5">
          <Image
            src={featuredPost?.featured?.data.thumbnails[5].url}
            alt={`${featuredPost.title} thumbnail`}
            width={featuredPost?.featured?.data.thumbnails[5].width}
            height={featuredPost?.featured?.data.thumbnails[5].height}
            className="w-full"
            priority
          />
        </aside>
        <div className="w-2/5 p-12 flex flex-col">
          <div className="mb-3">
            <h2 className="prose lg:prose-lg xl:prose-xl 2xl:prose-2xl font-heading font-semibold text-slate-900 dark:text-bdk-blue-lighter">
              {featuredPost?.title}
            </h2>
            <small className="text-sm">by {featuredPost?.author}</small>
          </div>
          <div className="flex-1 prose lg:prose-lg xl:prose-xl dark:text-slate-100">
            {featuredPost.lead ? (
              <div>{featuredPost.lead}</div>
            ) : (
              <ReactMarkdown
                children={`${featuredPost?.body
                  .split(" ")
                  .slice(0, 30)
                  .join(" ")} ...`}
              />
            )}
          </div>
          <div className="text-right">
            <Button
              as={Link}
              href={`/blog/${featuredPost.slug}`}
              aria-label={`read more about ${featuredPost.title}`}
            >
              <span>Read More</span>
              <span>&rarr;</span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
