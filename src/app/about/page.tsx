import CallToAction from "@/components/about/CallToAction";
import Features from "@/components/about/Features";
import Footer from "@/components/about/Footer";
import Hero from "@/components/about/Hero";
import Navbar from "@/components/about/Navbar";
import Testimonial from "@/components/about/Testimonial";
import { SearchBar } from "@/components/base/SearchBar";
import { getBookCount, getBooks } from "@/services/book_service";
import { getUser } from "@/utils/get_user";

export default async function Books() {
  const books = await getBooks();
  let numBooks: number = await getBookCount();
  numBooks =
    numBooks > 1e6
      ? 1000000
      : numBooks > 1e3
      ? Math.floor(numBooks / 1e3) * 1000
      : numBooks > 1e2
      ? Math.floor(numBooks / 1e2) * 100
      : numBooks;
  return (
    <>
      <Hero />
      <div className="text-white bg-darkBlue py-12 w-full">
        <h1 className="container text-2xl">Find any book</h1>
        <p className="container ">Search over {numBooks} books....</p>
        <div className="container">
          <SearchBar className="mt-4 flex-grow flex flex-wrap gap-8 w-full items-center max-w-lg" />
        </div>
      </div>
      <Features />
      {/* <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <ul>
          {todos?.map((todo: any) => (
            <li key={undefined}>{todo}</li>
          ))}
        </ul>
      </main> */}
      <Testimonial />
      <CallToAction />
    </>
  );
}
