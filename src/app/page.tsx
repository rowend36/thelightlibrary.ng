import SearchSection from "@/components/books/SearchSection";
import { getBooks } from "@/services/book_service";
import BookList from "@/components/books/BookList";
import Footer from "@/components/about/Footer";
import Navbar from "@/components/about/Navbar";
import { getUser } from "@/utils/get_user";

export default async function Home() {
  const res = await getBooks();
  console.log({ res });
  const user = await getUser();
  return (
    <>
      <Navbar user={user ?? undefined} />
      <SearchSection />
      <BookList books={res} category="sciences" title="Sciences" />
      <Footer />
    </>
  );
}
