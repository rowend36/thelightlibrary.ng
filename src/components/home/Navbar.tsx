"use client";
import { withUser } from "@/utils/with_user";
import { Menu, User as UserIcon } from "iconsax-react";
import { User } from "@/data/models/user";
import NextLink from "next/link";
import { useState } from "react";
import { AppLogo } from "../AppLogo";
import { ButtonBase } from "../base/ButtonBase";
import Link from "../base/Link";

const Navbar = ({ user }: { user?: User }) => {
  console.log({ user });
  const [toggleMenu, setToggleMenu] = useState(false);

  const links = (
    <>
      <Link href="/upload">Upload</Link>
      <Link href="#">Product</Link>
      <Link href="#">About Us</Link>
      <Link href="#">Careers</Link>
      <Link href="#">Community</Link>
    </>
  );
  return (
    <nav className="relative container  py-2 border-b ">
      {/* Flex Container */}
      <div className="flex items-center justify-between">
        <AppLogo />
        {/* Menu Items */}
        <div className="hidden xl:space-x-6 space-x-3 md:flex">{links}</div>
        {/* Button */}
        <div>
          <ButtonBase
            as={NextLink}
            className="hidden md:inline-block align-middle ml-2 lg:ml-4"
            href="/books"
            variant="contained"
          >
            Browse
          </ButtonBase>
          <ButtonBase
            as={NextLink}
            blank
            className="hidden md:inline-block align-middle ml-2 lg:ml-4 !rounded-full !p-3 hover:bg-primaryLight border"
            href="/admin"
            variant="contained"
          >
            <UserIcon size={20} />
          </ButtonBase>
        </div>

        {/* Hamburger Icon */}
        <button
          className={
            toggleMenu
              ? "open block hamburger md:hidden focus:outline-none text-primary"
              : "block hamburger md:hidden focus:outline-none text-text"
          }
          onClick={() => setToggleMenu(!toggleMenu)}
        >
          <Menu size={20} />
        </button>
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

export const getServersideProps = withUser;
export default Navbar;
