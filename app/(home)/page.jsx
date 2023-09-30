import SectionSolutions from "./SectionSolutions";
import SectionTestimonials from "./SectionTestimonials";
import SectionWhyBDK from "./SectionWhyBDK";
import IntroText from "@/app/(home)/IntroText";
import ContactForm from "@/app/contact/ContactForm.jsx";
import Button from "@/components/Button";
import RecentPosts from "@/components/RecentPosts.jsx";
import Link from "next/link";
import { FaImage } from "react-icons/fa";

export const metadata = {
  title: "BDKinc :: Home",
};

export default function IndexPage() {
  return (
    <>
      <h1 className="hidden">BDKinc Home Test</h1>
      <main className="w-full">
        <section id="hero" className="-mt-32 pt-32">
          <div className="container py-24 flex gap-x-24">
            <div className="w-3/5">
              <IntroText />
              <div className="flex gap-x-4 w-full">
                <div>
                  <Button as={Link} href="/quote">
                    Request a Quote &rarr;
                  </Button>
                </div>
                <div>
                  <Button as={Link} href="/solutions">
                    See our Solutions &rarr;
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-2/5">
              <div className="h-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-900 text-slate-300 dark:text-slate-900 flex items-center justify-center">
                <FaImage />
              </div>
            </div>
          </div>
        </section>
        <SectionSolutions />
        <SectionWhyBDK />
        <SectionTestimonials />
        <section className="py-16">
          <div className="container flex items-center gap-x-24">
            <div className="w-1/2">
              <div className="font-heading flex flex-col">
                <div className="text-4xl leading-loose">Connect with the</div>
                <div className="text-8xl font-bold leading-loose text-bdk-blue">
                  BDK Team
                </div>
                <div className="prose lg:prose-lg xl:prose-xl dark:text-slate-200">
                  <p>
                    To ask us your questions, call us at{" "}
                    <a href="tel:800-309-0004">(800) 309-0004</a>, email us at{" "}
                    <a href="mailto:info@bdkinc.com">info@bdkinc.com</a>, or
                    fill out the following information and someone will get back
                    to you.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-1/2">
              <h4 className="text-3xl font-semibold font-heading leading-loose">
                Contact Us
              </h4>
              <ContactForm />
            </div>
          </div>
        </section>
        <section className="relative py-16 border-t-4 border-b-4 overflow-hidden border-slate-100 dark:border-slate-800 after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:bg-repeat after:heropattern-circuitboard-slate-100 after:dark:heropattern-circuitboard-slate-800 after:rotate-45 after:translate-x-[24rem] after:translate-y-[-4rem]">
          <div className="relative z-10">
            <div className="container mb-6">
              <h5 className="font-heading text-3xl font-semibold leading-loose dark:text-bdk-blue-lighter">
                Latest Posts
              </h5>
              <RecentPosts limit={3} orientation="horizontal" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
