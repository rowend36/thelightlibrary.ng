import {
  json,
  LoaderFunctionArgs,
  useLocation,
  useResolvedPath,
  useSearchParams,
} from "react-router-dom";
import BookList from "../components/books/BookList";
import SearchSection from "../components/books/SearchSection";
import Footer from "../components/home/Footer";
import Navbar from "../components/home/Navbar";
import RecommendedBooks from "../components/home/RecommendedBooks";

import { queryFn } from "../data/actions/queryFn";

import { mapResponseToBooks } from "../data/actions/mappers";
import { useQuery } from "@tanstack/react-query";

export default function BooksPage() {
  const [searchParam] = useSearchParams();
  const { search, pathname } = useLocation();

  const {
    data: books,
    // error,
    isLoading,
  } = useQuery({
    queryKey: ["books", search],
    select: mapResponseToBooks,
    queryFn,
  });

  return (
    <>
      <Navbar />
      <SearchSection searchParam={searchParam.get("query") ?? ""} />
      <BookList
        title={
          pathname === "/search" ? (
            <>
              Search Results for '
              <i className="text-base">{searchParam.get("query")}</i>'
            </>
          ) : (
            "Our Entire Collection"
          )
        }
        books={isLoading ? undefined : books}
      />
      <RecommendedBooks />
      <Footer />
    </>
  );
}
