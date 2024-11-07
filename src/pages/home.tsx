import BookSlider from "../components/home/BookSlider";
import CallToAction from "../components/home/CallToAction";
import Footer from "../components/home/Footer";
import Hero from "../components/home/Hero";
import Navbar from "../components/home/Navbar";
import RecommendedBooks from "../components/home/RecommendedBooks";
import SectionOne from "../components/home/SectionOne";
import Testimonial from "../components/home/Testimonial";
import BlogSection from "../components/home/BlogSection";

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
