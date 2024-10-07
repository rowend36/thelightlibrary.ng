import Navbar from "../components/home/Navbar";
import CallToAction from "../components/home/CallToAction";
import SectionOne from "../components/home/SectionOne";
import Hero from "../components/home/Hero";
import Testimonial from "../components/home/Testimonial";
import Footer from "../components/home/Footer";
import Link from "../components/base/Link";
import BookSlider from "../components/home/BookSlider";
import { MessageQuestion } from "iconsax-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="h-24 bg-black max-md:h-36 max-sm:h-24" />
      <div className="container pt-24 flex flex-col  items-center">
        <MessageQuestion size={48} className="text-gray-400" />
        <h1 className="text-3xl font-bold text-red-600 mt-8 mb-4">
          Oops. Page Not Found.
        </h1>
        <Link href="/home">Return Home</Link>
      </div>
      <BookSlider />
      <div className="pb-12" />

      <Footer />
    </>
  );
}
