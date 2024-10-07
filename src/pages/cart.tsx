import { useNavigate } from "react-router-dom";
import { ButtonBase } from "../components/base/ButtonBase";
import BookList from "../components/books/BookList";
import SearchSection from "../components/books/SearchSection";
import Footer from "../components/home/Footer";
import Navbar from "../components/home/Navbar";
import RecommendedBooks from "../components/home/RecommendedBooks";

import { useCart } from "../data/services/cart_manager";

export default function CartPage() {
  const cart = useCart();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <SearchSection />
      <BookList
        title={"My Cart"}
        books={cart.synced ? cart.books : undefined}
      />
      <div className="container flex flex-col items-center ">
        <h3 className="text-3xl mb-8 text-gray-500">Done shopping?</h3>
        <ButtonBase
          className="text-xl w-96 max-w-full pulse"
          onClick={async () => {
            const purchase = await cart.checkout();

            navigate("/checkout/?reference=" + purchase.reference);
          }}
        >
          Checkout
        </ButtonBase>
      </div>
      <RecommendedBooks />
      <Footer />
    </>
  );
}
