"use client";

import { useLocation } from "react-router-dom";
import Link from "../base/Link";

export default function Sidebar() {
  const route = useLocation().pathname;
  return (
    <>
      <div className="border-t mb-1" />
      <Link
        href="/admin/"
        className={`w-full mt-4 mb-1  py-2  text-text font-normal  ${
          route === "/admin"
            ? "bg-primary hover:bg-primaryHover hover:text-white text-white"
            : ""
        }`}
      >
        Dashboard
      </Link>
      <div className="border-t mb-3 mt-1" />
      <Link
        href="/admin/books"
        className={`w-full mb-2 py-2  text-text font-normal  ${
          route.startsWith("/admin/books")
            ? "bg-primary hover:bg-primaryHover hover:text-white text-white"
            : ""
        }`}
      >
        Books
      </Link>
      <Link
        href="/admin/users"
        className={`w-full mb-2 py-2  text-text font-normal  ${
          route.startsWith("/admin/users")
            ? "bg-primary hover:bg-primaryHover hover:text-white text-white"
            : ""
        }`}
      >
        Users
      </Link>
      <Link
        href="/admin/purchases"
        className={`w-full mb-2 py-2  text-text font-normal  ${
          route.startsWith("/admin/users")
            ? "bg-primary hover:bg-primaryHover hover:text-white text-white"
            : ""
        }`}
      >
        Purchases
      </Link>
      <Link
        href="/admin/reviews"
        className={`w-full mb-2 py-2  text-text font-normal  ${
          route.startsWith("/admin/users")
            ? "bg-primary hover:bg-primaryHover hover:text-white text-white"
            : ""
        }`}
      >
        Reviews
      </Link>
      <Link
        href="/admin/blog"
        className={`w-full mb-2 py-2  text-text font-normal  ${
          route.startsWith("/admin/users")
            ? "bg-primary hover:bg-primaryHover hover:text-white text-white"
            : ""
        }`}
      >
        Blog
      </Link>
      <div className="border-t mb-3 mt-1" />
      <Link
        href="/admin/site"
        className={`w-full mb-2 py-2  text-text font-normal  ${
          route.startsWith("/admin/users")
            ? "bg-primary hover:bg-primaryHover hover:text-white text-white"
            : ""
        }`}
      >
        Site Management
      </Link>
    </>
  );
}
