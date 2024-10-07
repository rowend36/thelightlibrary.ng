import AboutAuthor from "../components/about/AboutAuthor";
import AboutHero from "../components/about/AboutHero";
import AboutSite from "../components/about/AboutSite";
import CallToAction from "../components/home/CallToAction";
import Footer from "../components/home/Footer";
import Navbar from "../components/home/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutHero />
      <AboutSite />
      <AboutAuthor />
      <CallToAction />
      <Footer />
    </>
  );
}
