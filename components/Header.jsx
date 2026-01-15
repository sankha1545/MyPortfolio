import Image from "next/image";
import Link from "next/link";

import Socials from "../components/Socials";

const Header = () => {
  return (
    <header className="absolute top-0 left-0 z-30 w-full">
      <div className="container px-6 mx-auto xl:px-0">
        <div className="flex items-center justify-between h-[88px]">
          
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0"
            aria-label="Go to homepage"
          >
            <Image
              src="/logo.AVIF"
              alt="Sankha Subhra Das Logo"
              width={180}            // ✅ controlled width
              height={36}            // ✅ logo-height driven
              priority
              className="object-contain"
            />
          </Link>

          {/* Social icons */}
          <div className="flex items-center">
            <Socials />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
