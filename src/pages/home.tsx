import Navbar from "../components/about/Navbar";
import CallToAction from "../components/about/CallToAction";
import Features from "../components/about/Features";
import Hero from "../components/about/Hero";
import Testimonial from "../components/about/Testimonial";
import Footer from "../components/admin/Footer";

export default function Home() {
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
