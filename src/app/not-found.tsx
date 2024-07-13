import Link from "@/components/base/Link";
import { SearchBar } from "@/components/base/SearchBar";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import { getBooks } from "@/services/book_service";
import { getUser } from "@/utils/get_user";

export default async function NotFound() {
  const books = await getBooks();
  const user = await getUser();
  return (
    <>
      <Navbar user={user ?? undefined} />
      <div className="container text-center min-h-48 flex justify-center items-center flex-col py-8">
        Oops! You seem to have lost your way. Let's get you back on track.
        <br />
        <Link href="/" className="text-primary">
          Return home
        </Link>
      </div>
      <div className="text-white bg-darkBlue py-12 w-full">
        <h1 className="container text-2xl">Find any book</h1>
        <p className="container ">Search over 1 books....</p>
        <div className="container">
          <SearchBar className="mt-4 flex-grow flex flex-wrap gap-8 w-full items-center max-w-lg" />
        </div>
      </div>
      <Footer />
    </>
  );
}
