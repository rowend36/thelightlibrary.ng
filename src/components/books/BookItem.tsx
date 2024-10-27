import { Minus, MinusCirlce, MinusSquare } from "iconsax-react";
import { Book } from "../../data/models/book";
import { useCart } from "../../data/services/cart_manager";
import { formatNaira } from "../../utils/formatNumber";
import { ButtonBase } from "../base/ButtonBase";

export default function BookItem({
  book,
  horizontal,
}: {
  book: Book;
  horizontal: boolean;
}) {
  const cart = useCart();
  return (
    <div
      className={
        " bg-white overflow-hidden rounded-lg shadow-lg border-gray-100 hover:border-primaryLight active:border-primary border " +
        (horizontal
          ? "flex flex-row flex-wrap justify-center"
          : "flex flex-col")
      }
    >
      <div
        className={
          "flex items-center justify-center py-4 px-4 overflow-hidden bg-gradient-radial from-gray-300 to-gray-200 " +
          (horizontal ? "w-40" : "w-full md:px-8 lg:px-16 ")
        }
      >
        <img
          className=" self-stretch w-auto aspect-[3/4] object-cover rounded-lg shadow-lg h-40"
          src={book.book_cover_url}
          width={320}
          height={480}
          alt="book"
        />
      </div>
      <div className="pb-2 px-2 pt-4 flex-grow basis-48 flex flex-col">
        <div className="py-2 flex flex-grow flex-col items-start justify-start w-full p-2 md:pl-4 basis-24">
          <h3 className="font-bold text-gray-800  text-lg h-12 overflow-hidden overflow-clip line-clamp-2">
            {book.title}
          </h3>
          <div className="flex justify-between w-full flex-wrap gap-y-8">
            <div>
              <p className="text-sm text-darkGray">
                <span className="text-darkGrayishBlue text-[10px] mr-1">
                  By
                </span>{" "}
                {book.authors?.map((e) => e.name).join(",") || "N/A"}
              </p>
              <p className="text-sm text-darkGray">
                <span className="text-darkGrayishBlue text-[10px] mr-1">
                  Published
                </span>{" "}
                {book.created_at?.getFullYear() || "N/A"}
              </p>
              <p className="mt-2">{formatNaira(book.price ?? 0)}</p>
            </div>
          </div>
        </div>
        {
          <ButtonBase
            className={
              "w-full text-center block mt-2" +
              (cart?.has(book) ? " !text-secondary bg-transparent" : "")
            }
            onClick={() =>
              cart.has(book) ? cart.removeFromCart(book) : cart.addToCart(book)
            }
          >
            {cart.has(book) ? (
              <>
                {/* <MinusCirlce size={28} className="inline mr-2" /> */}
                Remove From Cart
              </>
            ) : (
              "Add to Cart"
            )}
          </ButtonBase>
        }
      </div>
    </div>
  );
}
