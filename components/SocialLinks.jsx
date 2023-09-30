import Link from "next/link";
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

export default function SocialLinks() {
  return (
    <>
      <div className="mb-2 font-semibold">Visit us on social media</div>
      <div className="flex items-center gap-6 text-4xl">
        <Link
          className="transition text-bdk-blue hover:text-bdk-blue-light focus:ring-2"
          href={"https://twitter.com/bdkinctech"}
        >
          <FaTwitter />
        </Link>
        <Link
          className="transition text-bdk-blue hover:text-bdk-blue-light focus:ring-2"
          href={"https://www.instagram.com/bdkinctech"}
        >
          <FaInstagram />
        </Link>
        <Link
          className="transition text-bdk-blue hover:text-bdk-blue-light focus:ring-2"
          href={"https://www.facebook.com/bdkinctech/"}
        >
          <FaFacebook />
        </Link>
        <Link
          className="transition text-bdk-blue hover:text-bdk-blue-light focus:ring-2"
          href={"https://www.linkedin.com/company/bdk-inc."}
        >
          <FaLinkedin />
        </Link>
      </div>
    </>
  );
}
