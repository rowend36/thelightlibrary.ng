"use client";
import { useState } from "react";
import Link from "./Link";
import NextLink from "next/link";

import companyLogo from "../assets/images/logo.svg";
import Image from "next/image";
import { SearchBar } from "./SearchBar";
import { ButtonBase } from "./base/ButtonBase";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <nav className="relative container mx-auto p-6">
      {/* Flex Container */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="pt-2">
          <Image src={companyLogo} className="object-contain" alt="" />
        </div>
        {/* Menu Items */}
        <div className="hidden space-x-6 md:flex">
          <Link href="#">Pricing</Link>
          <Link href="#">Product</Link>
          <Link href="#">About Us</Link>
          <Link href="#">Careers</Link>
          <Link href="#">Community</Link>
        </div>
        {/* Button */}
        <ButtonBase
          as={NextLink}
          className="hidden md:block ml-2"
          href="#"
          variant="contained"
        >
          Get Started
        </ButtonBase>

        {/* Hamburger Icon */}
        <button
          className={
            toggleMenu
              ? "open block hamburger md:hidden focus:outline-none"
              : "block hamburger md:hidden focus:outline-none"
          }
          onClick={() => setToggleMenu(!toggleMenu)}
        >
          <span className="hamburger-top"></span>
          <span className="hamburger-middle"></span>
          <span className="hamburger-bottom"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div
          className={
            toggleMenu
              ? "absolute flex flex-col items-center self-end py-8 mt-10 space-y-6 font-bold bg-white sm:w-auto sm:self-center left-6 right-6 drop-shadow-md"
              : "absolute flex-col items-center hidden self-end py-8 mt-10 space-y-6 font-bold bg-white sm:w-auto sm:self-center left-6 right-6 drop-shadow-md"
          }
        >
          <Link href="#">Pricing</Link>
          <Link href="#">Product</Link>
          <Link href="#">About Us</Link>
          <Link href="#">Careers</Link>
          <Link href="#">Community</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
