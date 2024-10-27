import { useNavigate } from "react-router-dom";
import { fetcher } from "../../data/actions/queryFn";
import { useCart } from "../../data/services/cart_manager";
import { ButtonBase } from "../base/ButtonBase";
import BookItem from "../books/BookItem";
import { Purchase } from "../../data/models/purchase";
import { ArrowRight, ShoppingCart } from "iconsax-react";

export default function CartModal() {
  const cart = useCart();

  return (
    <div className="z-40">
      <div className="absolute w-auto sm:left-8 sm:right-8 left-0 right-0">
        <ButtonBase
          disabled={cart.books.length === 0}
          className="block mx-auto shadow-lg mb-4"
          onClick={async () => {
            await cart.checkout();
          }}
        >
          Proceed to Checkout
          <ArrowRight className="inline-block ml-2 -mt-1" />
        </ButtonBase>
      </div>
      <div className="pt-16" />
      {cart.books.length === 0 ? (
        <div className="text-center py-8">
          {" "}
          <ShoppingCart size={96} className="text-gray-200 mx-auto pr-4" />
          <span>Nothing here.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.books.map((e) => {
            return <BookItem book={e} key={e.book_id} horizontal />;
          })}
        </div>
      )}
    </div>
  );
}
