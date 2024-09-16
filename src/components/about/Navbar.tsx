import { User } from "../../data/models/user";

import { useLocation } from "react-router-dom";
import { useState } from "react";
import { AppLogo } from "../AppLogo";

import Link from "../base/Link";

import { SearchBar } from "../base/SearchBar";

const Navbar = ({ user }: { user?: User }) => {
  console.log({ user });
  const [toggleMenu, setToggleMenu] = useState(false);
  const route = useLocation().pathname;
  const links = (
    <>
      {/* <Link href="/upload">Upload</Link>
      <Link href="#">Product</Link> */}
      <Link href="/team" disabled={route === "/team"}>
        About Author
      </Link>
      <Link href="/books" disabled={route === "/books"}>
        Books
      </Link>

      {/* <Link href="#">Careers</Link>
      <Link href="#">Community</Link> */}
    </>
  );
  return (
    <nav className="relative container  py-2 border-b ">
      {/* Flex Container */}
      <div className="flex items-center">
        {/* Hamburger Icon */}
        <button
          className={
            toggleMenu
              ? "open block hamburger md:hidden focus:outline-none text-primary mr-4"
              : "block hamburger md:hidden focus:outline-none text-text mr-4"
          }
          onClick={() => setToggleMenu(!toggleMenu)}
        >
          <i className="bx bx-menu bx-lg" />
        </button>
        <AppLogo />
        {/* Menu Items */}
        <div className="flex-1"></div>
        <div className="hidden xl:space-x-6 space-x-3 md:flex md:mx-8">
          {links}
        </div>
        <div className="flex-1"></div>
        {/* Button */}

        <SearchBar className="flex gap-4" />
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div
          className={
            "rounded-t-sm rounded-bl-2xl absolute flex flex-col items-stretch px-4 py-8 self-end mt-0 space-y-4 text-center bg-white sm:w-auto sm:self-center left-6 right-6 drop-shadow-md"
          }
          style={{
            maxHeight: !toggleMenu ? 0 : "calc(100vh - 72px)",
            paddingTop: !toggleMenu ? 0 : undefined,
            paddingBottom: !toggleMenu ? 0 : undefined,
            overflow: "auto",
            transition: "max-height fast, padding fast",
          }}
        >
          {links}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
