import Logo from "./Logo";
import ModeToggle from "./ModeToggle";
import NavMenu from "./NavMenu";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full mt-4 z-50">
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="w-[16rem] h-auto -ml-6 -mt-6">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>
      </div>
      <div>
        <NavMenu />
      </div>
    </header>
  );
}
