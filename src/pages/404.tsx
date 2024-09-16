import Navbar from "../components/home/Navbar";
import CallToAction from "../components/home/CallToAction";
import Features from "../components/home/Features";
import Hero from "../components/home/Hero";
import Testimonial from "../components/home/Testimonial";
import Footer from "../components/admin/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <Hero />

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
