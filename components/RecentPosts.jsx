import { cn } from "@/components/utils";
import { blogFetcher, createBlogUrl } from "@/repository/blogRepository";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

function Fallback({ limit, orientation }) {
  return (
    <ul
      className={cn(
        `flex`,
        orientation === "vertical"
          ? "flex-col gap-6"
          : "justify-between gap-16",
      )}
    >
      {Array.from(Array(JSON.parse(limit)).keys()).map((key) => (
        <li className="w-full" key={key}>
          <div className="w-full">
            <div
              className={cn(
                `flex items-center gap-4`,
                orientation === "horizontal" ? "flex-col" : "",
              )}
            >
              <div
                className={`${orientation === "vertical" ? "w-1/4" : "w-full"}`}
              >
                <div className="animate-pulse w-full h-16 bg-slate-100 dark:bg-slate-800"></div>
              </div>
              <div
                className={`${orientation === "vertical" ? "w-3/4" : "w-full"}`}
              >
                <div className="animate-pulse max-w-[600px] h-6 mb-3 bg-slate-100 dark:bg-slate-800"></div>
                <div className="animate-pulse max-w-[250px] h-6 mb-3 bg-slate-100 dark:bg-slate-800"></div>
                <div className="animate-pulse max-w-[150px] h-4 mb-2 bg-slate-100 dark:bg-slate-800"></div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

async function getPosts(limit) {
  return await blogFetcher(createBlogUrl({ limit, sort: "desc" }));
}

async function BlogPosts({ limit, orientation }) {
  const { data: posts } = await getPosts(limit);

  return (
    <ul
      className={`flex ${
        orientation === "vertical" ? "flex-col gap-6" : "justify-between gap-16"
      }`}
    >
      {posts.map((post) => (
        <li key={post.id} className="w-full">
          <Link
            href={`/blog/${post.slug}`}
            className="transition inline-block hover:scale-105 w-full"
          >
            <div
              className={`flex ${
                orientation === "horizontal" && "flex-col"
              } items-center gap-4`}
            >
              {post.featured?.data && (
                <div
                  className={`${
                    orientation === "vertical" ? "w-1/4" : "w-full"
                  }`}
                >
                  <Image
                    src={post?.featured?.data?.thumbnails[3].url}
                    width={post?.featured?.data?.thumbnails[3].width}
                    height={post?.featured?.data?.thumbnails[3].height}
                    alt={`${post.title} thumbnail`}
                    className="w-full"
                  />
                </div>
              )}
              <div
                className={`${orientation === "vertical" ? "w-3/4" : "w-full"}`}
              >
                <h5 className="text-lg font-semibold">{post.title}</h5>
                <span className="text-xs">
                  {dayjs(post.publishedAt).format("MMMM D, YYYY")}
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function RecentPosts({ limit = "5", orientation = "vertical" }) {
  return (
    <>
      <Suspense fallback={<Fallback orientation={orientation} limit={limit} />}>
        <BlogPosts limit={limit} orientation={orientation} />
      </Suspense>
      <div>
        <Link href="/blog" className="block text-right">
          <div className="text-xl transition text-bdk-blue-dark hover:text-bdk-blue font-semibold inline-flex gap-x-2">
            <span>All Posts</span>
            <span>&rarr;</span>
          </div>
        </Link>
      </div>
    </>
  );
}
