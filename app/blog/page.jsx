import BlogPosts from "./BlogPosts";
import LatestPost from "./LatestPost";
import PageHeading from "@/components/PageHeading";
import { Suspense } from "react";

export const metadata = {
  title: "BDKinc :: Blog",
};
export default async function Page() {
  return (
    <main>
      <header className="container">
        <PageHeading>Blog</PageHeading>
      </header>
      <div className="relative border-t-4 border-b-4 overflow-hidden border-slate-100 dark:border-slate-800 after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:bg-repeat after:heropattern-hexagons-slate-100 after:dark:heropattern-hexagons-slate-800 after:pt-36 after:-mt-36 mb-8">
        <div className="container">
          <div className="z-10 relative">
            <Suspense fallback={<div>Loading...</div>}>
              <LatestPost />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="container">
        <Suspense fallback={<div>Loading...</div>}>
          <BlogPosts />
        </Suspense>
      </div>
    </main>
  );
}
