import Footer from "@/components/about/Footer";
import Navbar from "@/components/about/Navbar";
import { getUser } from "@/utils/get_user";

export default async function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <>
      <Navbar user={user ?? undefined} />
      {children}
      <Footer />
    </>
  );
}
