import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
