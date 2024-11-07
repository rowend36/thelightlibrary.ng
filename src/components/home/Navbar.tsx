import { User } from "../../data/models/user";

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppLogo } from "../AppLogo";

import Link from "../base/Link";

import { SearchBar } from "../base/SearchBar";

import useScrollTop from "../../utils/useScrollTop";
import { useCart } from "../../data/services/cart_manager";
import { Shop, ShoppingCart } from "iconsax-react";
import Modal from "../Modal";
import CartModal from "./CartModal";

const Navbar = ({ user }: { user?: User }) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const isScrolled = useScrollTop(null, false, (scroll) => scroll > 56);
  const cart = useCart();
  const [showCart, setShowCart] = useState(false);
  const route = useLocation().pathname;
  useEffect(() => {
    const hide = () => setShowCart(false);
    cart.on("checkout", hide);
    return () => void cart.off("checkout", hide);
  }, [cart]);
  const links = (
    <>
      {/* <Link href="/upload">Upload</Link>
      <Link href="#">Product</Link> */}
      <Link
        href="/"
        disabled={route === "/"}
        className={isScrolled ? "lg:text-xs" : "lg:text-white lg:text-xs"}
      >
        Home
      </Link>
      <Link
        href="/about"
        disabled={route === "/about"}
        className={isScrolled ? "lg:text-xs" : "lg:text-white lg:text-xs"}
      >
        About Author
      </Link>
      <Link href="/blog" disabled={route === "/blog"} className="lg:hidden">
        Blog
      </Link>
      <Link
        href="/books"
        disabled={route === "/books"}
        className={isScrolled ? "lg:text-xs" : "lg:text-white lg:text-xs"}
      >
        Books
      </Link>

      {/* <Link href="#">Careers</Link>
      <Link href="#">Community</Link> */}
    </>
  );
  return (
    <nav
      className={`${
        isScrolled
          ? "bg-white shadow-md shadow-black/5"
          : "bg-black/20 backdrop-blur-sm"
      } fixed top-0 z-50 py-2  w-full max-w-[100vw]`}
    >
      {/* Flex Container */}
      <div className="container flex items-center w-full">
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
        <div className="md:hidden flex-1"></div>
        <AppLogo className={isScrolled ? "" : "invert brightness-0"} />
        {/* Menu Items */}
        <div className="max-md:hidden flex-1 mr-8"></div>

        <SearchBar
          className={
            "flex gap-4 max-md:hidden " +
            (isScrolled ? "" : "group search-dark")
          }
          style={{
            backgroundColor: isScrolled ? undefined : "#ffffff22",
            color: isScrolled ? undefined : "white",
          }}
        />
        <div className="flex-1 max-lg:ml-10  "></div>
        <div className="hidden xl:space-x-4 space-x-1 lg:flex max-lg:mr-10 lg:mr-4 max-sm:mr-2 ">
          {links}
        </div>
        <button
          className={
            (isScrolled ? "" : "text-white ") +
            (cart.books.length ? "" : "invisible ") +
            "relative block"
          }
          onClick={() => setShowCart(true)}
        >
          <span className="absolute -top-2 -right-2 block w-5 h-5 text-center pt-1 text-white bg-secondary rounded-full text-xs">
            {cart.books.length}
          </span>
          <ShoppingCart
            size={32}
            className={isScrolled ? "text-primary" : "text-white "}
          />
        </button>
      </div>
      <div className="container max-sm:hidden">
        {route === "/books" || route === "/search" ? null : (
          <SearchBar
            className={
              "flex gap-4 md:hidden " + (isScrolled ? "" : "group search-dark")
            }
          />
        )}
      </div>
      {/* Mobile Menu */}
      {toggleMenu ? (
        <div
          className="bg-black/10 fixed lg:hidden top-0  left-0 h-screen w-screen"
          onClick={() => {
            setToggleMenu(false);
          }}
        />
      ) : null}
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
      <Modal open={showCart} onClose={() => setShowCart(false)} title="My Cart">
        <CartModal />
      </Modal>
    </nav>
  );
};

export default Navbar;
