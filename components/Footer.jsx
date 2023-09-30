import FooterLinks from "./FooterLinks";
import SocialLinks from "./SocialLinks";
import Link from "next/link";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <>
      <footer className="py-6">
        <div className="container">
          <div className="py-6 -mx-6 w-full flex">
            <div className="px-6 w-1/4">
              <SocialLinks />
            </div>
            <div className="px-6 w-3/4">
              <FooterLinks />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="h-[2px] bg-slate-200 dark:bg-slate-800 w-full"></div>
        </div>
        <div className="container flex items-center justify-between py-6">
          <div className="flex gap-2 items-baseline">
            <Link
              href="/"
              className="font-semibold no-underline text-white visited:text-bdk-blue hover:text-bdk-blue-light"
            >
              <strong className="font-bold text-bdk-blue text-lg">BDK</strong>
              <span className="text-bdk-blue dark:text-white">
                inc &copy;{year}
              </span>
            </Link>
            <small>All Rights Reserved</small>
          </div>
          <div className="flex gap-4">
            <Link
              href="/privacy-policy"
              className="font-semibold no-underline text-bdk-blue visited:text-bdk-blue hover:text-bdk-blue-light"
            >
              Privacy Policy
            </Link>
            <span>|</span>
            <Link
              href="/terms-of-use"
              className="font-semibold no-underline text-bdk-blue visited:text-bdk-blue hover:text-bdk-blue-light"
            >
              Terms of Use
            </Link>
            <span>|</span>
            <Link
              href="/accessibility-policy"
              className="font-semibold no-underline text-bdk-blue visited:text-bdk-blue hover:text-bdk-blue-light"
            >
              Accessibility Policy
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
