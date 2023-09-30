import RecentPosts from "@/components/RecentPosts";
import Link from "next/link";
import { forwardRef } from "react";

const MenuLink = forwardRef((props, ref) => (
  <Link
    ref={ref}
    className="text-slate-900 dark:text-white hover:text-bdk-blue dark:hover:text-bdk-blue-light focus:text-bdk-blue-light transition"
    {...props}
  />
));

export default function FooterLinks() {
  return (
    <div className="grid grid-cols-4">
      <div>
        <nav className="flex flex-col gap-3">
          <MenuLink href={"/"}>Home</MenuLink>
          <MenuLink href={"/about"}>About</MenuLink>
          <MenuLink href={"/contact"}>Contact us</MenuLink>
          <MenuLink href={"/blog"}>Blog</MenuLink>
        </nav>
      </div>
    </div>
  );
}
