import { ButtonBase } from "@/components/base/ButtonBase";
import { SearchBar } from "@/components/base/SearchBar";
import BookList from "@/components/books/BookList";
import SearchSection from "@/components/books/SearchSection";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import { Book } from "@/data/models/book";
import { getBooks } from "@/services/book_service";
import reshape from "@/utils/reshape";
import { SearchNormal } from "iconsax-react";

export default async function Books() {
  const res = await getBooks();
  return (
    <>
      <SearchSection />
      <BookList books={res} category="sciences" title="Sciences" />
    </>
  );
}
