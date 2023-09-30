import RecentPosts from "@/components/RecentPosts";
import { blogFetcher, createBlogUrl } from "@/repository/blogRepository";
import dayjs from "dayjs";
import Image from "next/image";
import { Suspense } from "react";
import { FaCalendar } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

function Fallback() {
  return (
    <div className="grid grid-cols-3">
      <div className="col-span-2">
        <article>
          <div className="animate-pulse mt-8 h-[389px] w-full max-w-3xl mb-10 bg-slate-100 dark:bg-slate-800"></div>
          <header className="font-heading">
            <div className="animate-pulse block h-12 max-w-2xl mb-3 w-full bg-slate-100 dark:bg-slate-800"></div>
            <div className="animate-pulse block h-12 max-w-2xl mb-6 w-full bg-slate-100 dark:bg-slate-800"></div>
            <div className="flex items-center mb-3 w-full max-w-xs">
              <span className="text-xs animate-pulse text-slate-100 dark:text-slate-800">
                <FaCalendar />
              </span>
              <div className="ml-4 animate-pulse block h-4 w-full bg-slate-100 dark:bg-slate-800"></div>
            </div>
            <div className="animate-pulse">
              <div className="block h-10 mb-6 w-full max-w-md bg-slate-100 dark:bg-slate-800"></div>
            </div>
          </header>
          <section role="status" className="animate-pulse">
            <div className="block h-8 mb-4 w-full max-w-3xl bg-slate-100 dark:bg-slate-800"></div>
            <div className="block h-8 mb-4 w-full max-w-3xl bg-slate-100 dark:bg-slate-800"></div>
            <div className="block h-8 mb-4 w-full max-w-3xl bg-slate-100 dark:bg-slate-800"></div>
            <div className="block h-8 mb-4 w-full max-w-3xl bg-slate-100 dark:bg-slate-800"></div>
            <div className="block h-8 mb-4 w-full max-w-3xl bg-slate-100 dark:bg-slate-800"></div>
            <div className="sr-only">Loading...</div>
          </section>
        </article>
      </div>
      <div>
        <h3 className="text-2xl font-heading font-semibold leading-loose mb-4">
          Recent Posts
        </h3>
        <RecentPosts />
      </div>
    </div>
  );
}

async function getPost(slug) {
  return await blogFetcher(createBlogUrl({ slug }));
}

async function Post({ slug }) {
  const { data } = await getPost(slug);

  return (
    <>
      {data.map(({ id, title, body, lead, author, publishedAt, featured }) => (
        <div className="grid grid-cols-3" key={id}>
          <div className="col-span-2">
            <article
              id={`post-${id}`}
              className="prose lg:prose-lg xl:prose-xl text-gray-800 dark:text-slate-100"
              key={id}
            >
              <div>
                <Image
                  src={featured?.data.thumbnails[5].url}
                  height={featured?.data.thumbnails[5].height}
                  width={featured?.data.thumbnails[5].width}
                  alt={`${title} preview`}
                  className="w-full"
                />
              </div>
              <header className="font-heading">
                <h1 className="text-3xl text-gray-800 dark:text-slate-100 mb-0">
                  {title}
                </h1>
                <div className="flex items-center gap-x-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="text-xs">
                    <FaCalendar />
                  </span>
                  <span>{dayjs(publishedAt).format("MMMM D, YYYY")}</span>
                </div>
                <div className="font-semibold text-bdk-blue dark:text-bdk-blue-lighter">
                  by {author}
                </div>
              </header>
              <section>
                {lead ? (
                  <div dangerouslySetInnerHTML={{ __html: body }} />
                ) : (
                  <ReactMarkdown children={body} />
                )}
              </section>
            </article>
          </div>
          <div>
            <h3 className="text-2xl font-heading font-semibold leading-loose mb-4">
              Recent Posts
            </h3>
            <RecentPosts />
          </div>
        </div>
      ))}
    </>
  );
}

export default function Page({ params }) {
  return (
    <div className="container">
      <Suspense fallback={<Fallback />}>
        <Post slug={params.slug} />
      </Suspense>
    </div>
  );
}
