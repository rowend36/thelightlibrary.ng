import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "iconsax-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CartItem from "../components/cart/CartItem";
import Footer from "../components/home/Footer";
import Navbar from "../components/home/Navbar";
import { mapResponseToPuchase } from "../data/actions/mappers";
import { authQueryFn } from "../data/actions/queryFn";
import { useAuth } from "../data/services/user_manager";

export default function PurchaseCompletedPage() {
  const [params] = useSearchParams();
  const { data: purchase } = useQuery({
    queryKey: ["cart", "/checkout", "/" + params.get("reference")],
    queryFn: authQueryFn,
    select: mapResponseToPuchase,
  });
  const navigate = useNavigate();
  const user = useAuth().user;
  const [email, setEmail] = useState<string>();
  const pathname = useLocation().pathname;

  useEffect(() => {
    if (user) setEmail(user.email);
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="h-24 bg-black max-md:h-36 max-sm:h-24" />
      <div className="container  pt-12">
        <button
          className="text-primary -left-4 relative hover:bg-primary/10 active:bg-primary/20 rounded-full p-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={32} />
        </button>
      </div>
      <div className="container pb-8 bg-gray-50">
        {!purchase ? (
          <div className="text-lg text-center my-16">
            <div className="mx-auto mb-4 border-4 border-b-transparent border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
            <span className="text-sm text-gray-700">
              Loading. Please wait ...
            </span>
          </div>
        ) : (
          <div className="pb-8 pt-4 flex-grow container pl-0 basis-96">
            <h3 className="text-2xl font-bold text-darkBlue pb-4">
              Cart Items
            </h3>
            {purchase.cart!.books.map((book) => (
              <CartItem book={book} key={book.book_id} showDownloadLink />
            ))}
          </div>
        )}
      </div>
      <div className="pb-12" />
      <Footer />
    </>
  );
}
