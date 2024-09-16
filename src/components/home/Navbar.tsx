import { User } from "../../data/models/user";

import { useLocation } from "react-router-dom";
import { useState } from "react";
import { AppLogo } from "../AppLogo";

import Link from "../base/Link";

import { SearchBar } from "../base/SearchBar";

import useScrollTop from "../../utils/useScrollTop";

const Navbar = ({ user }: { user?: User }) => {
  console.log({ user });
  const [toggleMenu, setToggleMenu] = useState(false);
  const isScrolled = useScrollTop(null, false, (scroll) => scroll > 56);
  console.log({ isScrolled });
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
    <nav
      className={`${
        isScrolled ? "bg-white" : "bg-black/20 backdrop-blur-sm"
      } fixed top-0  py-2  w-full`}
    >
      {/* Flex Container */}
      <div className="container flex items-center">
        {/* Hamburger Icon */}
        <button
          className={
            (isScrolled ? "" : "text-white ") +
            (toggleMenu
              ? "open block hamburger lg:hidden focus:outline-none text-primary mr-4"
              : "block hamburger lg:hidden focus:outline-none text-text mr-4")
          }
          onClick={() => setToggleMenu(!toggleMenu)}
        >
          <i className="bx bx-menu bx-lg" />
        </button>
        <div className="lg:hidden flex-1"></div>
        <AppLogo className={isScrolled ? "" : "invert brightness-0"} />
        {/* Menu Items */}
        <div className="flex-1"></div>
        <div className="hidden xl:space-x-6 space-x-3 lg:flex md:mx-8">
          {links}
        </div>
        <div className="flex-1"></div>

        <SearchBar
          className="flex gap-4 max-md:hidden"
          style={{
            backgroundColor: isScrolled ? undefined : "transparent",
            color: isScrolled ? undefined : "white",
          }}
        />
      </div>
      <div className="container">
        <SearchBar
          className="flex gap-4 md:hidden"
          style={{
            backgroundColor: isScrolled ? undefined : "transparent",
            color: isScrolled ? undefined : "white",
          }}
        />
      </div>
      {/* Mobile Menu */}
      <div className="lg:hidden" onClick={() => setToggleMenu(false)}>
        <div
          className={
            "rounded-t-sm rounded-b-2xl absolute flex flex-col items-stretch px-4 py-8 self-end mt-0 space-y-4 text-center bg-gray-100 sm:w-auto sm:self-center left-4 right-4 drop-shadow-md"
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
