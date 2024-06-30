import Image from "next/image";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonial from "@/components/Testimonial";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import { getBooks } from "@/services/book_service";
import { SearchBar } from "@/components/SearchBar";
import { ButtonBase } from "@/components/base/ButtonBase";

export default async function Home() {
  const books = await getBooks();
  return (
    <>
      <Navbar />
      <Hero />
      <div className="bg-slate-600 py-8 flex justify-center">
        <SearchBar className="mr-4 block w-96" />
        <ButtonBase>Search</ButtonBase>
      </div>
      {books.map((book) => JSON.stringify(book))}
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
