import { ButtonBase } from "@/components/base/ButtonBase";
import { SearchBar } from "@/components/base/SearchBar";
import BookList from "@/components/books/BookList";
import SearchSection from "@/components/books/SearchSection";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import { Book } from "@/data/models/book";
import { getBooks, searchBooks } from "@/services/book_service";
import reshape from "@/utils/reshape";
import { SearchNormal } from "iconsax-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const res = await searchBooks(searchParams.query);
  return (
    <>
      <SearchSection searchParam={searchParams.query} />
      <h1 className="container text-3xl font-bold mt-8">
        Here are your top search results...
      </h1>
      <p className="container text-lg italic text-darkGrayishBlue">
        {res.length > 50 ? "Over " : ""}
        <b className="text-text">{res.length}</b> results found.{" "}
      </p>
      <BookList books={res} category="search_results" title="" />
    </>
  );
}
