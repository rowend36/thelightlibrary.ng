import Image from "next/image";
import { cookies } from "next/headers";
import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Testimonial from "@/components/home/Testimonial";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/home/Footer";
import { getBooks } from "@/services/book_service";
import { SearchBar } from "@/components/base/SearchBar";
import { ButtonBase } from "@/components/base/ButtonBase";

export default async function Home() {
  const books = await getBooks();
  return (
    <>
      <Navbar />
      <Hero />
      <div className="text-white bg-slate-600 py-12 w-full">
        <h1 className="container text-2xl">Find any book</h1>
        <p className="container ">Search over 1 books....</p>
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
      <Footer />
    </>
  );
}
