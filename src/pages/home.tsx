import Navbar from "../components/home/Navbar";
import CallToAction from "../components/home/CallToAction";
import SectionOne from "../components/home/SectionOne";
import Hero from "../components/home/Hero";
import Testimonial from "../components/home/Testimonial";
import Footer from "../components/home/Footer";
import BlogSection from "../components/home/VLog";
import RecommendedBooks from "../components/home/RecommendedBooks";
import BookSlider from "../components/home/BookSlider";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SectionOne />
      <BookSlider />
      <Testimonial />
      <RecommendedBooks />
      <BlogSection />
      <CallToAction />
      <Footer />
    </>
  );
}
