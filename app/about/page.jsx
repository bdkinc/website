import PageHeading from "@/components/PageHeading.jsx";
import RecentPosts from "@/components/RecentPosts.jsx";
import Image from "next/image";
import { FaImage } from "react-icons/fa";

export const metadata = {
  title: "BDKinc :: About",
};

export default () => (
  <div className="py-2">
    <main className="container">
      <div>
        <Image
          src={"/img/bdk-company-picture.jpg"}
          width={2048}
          height={1020}
          alt="BDK, inc. Company Photo"
          priority
        />
      </div>
      <PageHeading>Who we are</PageHeading>
      <div className="grid grid-cols-3">
        <div className="col-span-2">
          <div className="prose lg:prose-lg xl:prose-xl text-gray-800 dark:text-gray-200">
            <p>
              BDK is a managed service provider and IT services & consulting
              firm headquartered in Easton, Maryland. We provide a full range of
              IT services with one goal in mind - to be a strategic technology
              partner that helps our clients achieve their business objectives.
              We're extremely proud of our portfolio of clients. We provide
              services for large national customers, but we also serve small
              businesses in our local community. We love this mix. It keeps us
              grounded in our small-town roots, but it also challenges us to
              always be current on the latest technology innovations and trends.
            </p>
            <h2 className="text-3xl text-gray-900 dark:text-blue-200 leading-loose">
              We're family-owned and family-run
            </h2>
            <p>
              They say if you want something done, ask a busy person. That
              certainly applies to Bruce and Edwina Kimball, the
              husband-and-wife team who launched BDK in 1999. The couple has
              eight children, so they know a thing or two about managing
              priorities and putting systems in place to keep things running
              smoothly!Kimball Family
            </p>
            <p>
              Prior to BDK, Bruce and Edwina each held leadership positions with
              local companies - Bruce in banking and Edwina in manufacturing.
              They saw a need for an IT services firm that truly understands how
              business works. They also saw an opportunity to make IT
              approachable by building a team that is down-to-earth and customer
              service oriented. They envisioned a family-run business that
              treats clients like part of the family.
            </p>
            <p>
              Today, the Kimballs' oldest son Brian and son-in-law Adam play key
              roles at BDK. The company has grown to 37 employees who are all
              part of the BDK family.
            </p>
            <h3 className="text-3xl text-gray-900 dark:text-blue-200 leading-loose">
              Our approach to working with clients
            </h3>
            <p>
              Many IT firms take a "one size fits all" approach. That just
              doesn't make sense to us. Different manufacturers have different
              production processes. Different banks serve different types of
              clients. Different healthcare organizations treat different kinds
              of patients. Trying to pigeon-hole every business into a single,
              off-the-shelf IT solution will produce mediocre results at best.
            </p>
            <p>
              We invest time at the beginning of a new client relationship to
              truly understand your goals, products, processes, and the markets
              you serve. We look for opportunities to be a strategic partner
              that adds value through technology. Our team can then tap into our
              vast experience with a huge range of hardware and software
              applications. We choose the solution that is best for your
              business, and we fully customize it for optimum performance.
            </p>
            <p>
              For some clients, we handle every aspect of their IT needs. We
              become their outsourced IT department through a managed services
              agreement.
            </p>
            <p>
              For other clients, we supplement the skillsets of their existing
              IT staff. If you need a specialist to handle a certain part of
              your technology infrastructure, our team can handle that for you.
            </p>
            <p>
              BDK is headquartered in the center of the Delmarva Peninsula in
              Easton, Maryland. We also have offices in Salisbury, Maryland and
              Newark, Delaware, as well as a data-center locations in Reston
              Virginia and Denver Colorado.
            </p>
            <h4 className="text-3xl text-gray-900 dark:text-blue-200 leading-loose">
              We provide services and solutions
            </h4>
            <p>
              We can bring an entire solution(s) to you or provide just one
              service at a time. Our skills and packages provided are diverse
              and can satisfy any situation.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-16">
          <div>
            <div className="h-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-900 mb-3 flex items-center justify-center text-2xl text-slate-300 dark:text-slate-900">
              <FaImage />
            </div>
            <h3 className="text-2xl font-semibold font-heading">
              Call to Action
            </h3>
          </div>
          <div>
            <h4 className="text-2xl font-semibold font-heading mb-3">
              Recent Posts
            </h4>
            <RecentPosts />
          </div>
        </div>
      </div>
    </main>
  </div>
);
