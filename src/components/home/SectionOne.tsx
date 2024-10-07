import { ReactNode } from "react";
import booksImage from "../../assets/images/books.jpg";
import bookImage from "../../assets/my_images/image.png";
import { ButtonBase } from "../base/ButtonBase";
import Link from "../base/Link";
import { mapResponseToBooks } from "../../data/actions/mappers";
import { queryFn } from "../../data/actions/queryFn";
import { useCart } from "../../data/services/cart_manager";
import { useNavigate } from "react-router-dom";
import { Book } from "../../data/models/book";
import { useQuery } from "@tanstack/react-query";
const SectionOne = () => {
  const {
    data: books,
    // error,
    isLoading,
  } = useQuery({
    queryKey: ["books", "/featured"],
    select: mapResponseToBooks,
    queryFn,
  });

  return (
    <section
      id="features"
      className=" md:bg-gradient-to-r from-gray-200 via-50%-gray-200 via-55%-white pt-1"
    >
      {/* Flex Container */}
      <div className="container flex flex-col space-y-12 md:space-y-0 md:flex-row">
        {/* What's Different */}
        <div className="bgmd:bg-gradient-to-r from-transparent to-gray-200 md:pb-16 md:w-1/2 md:pr-8 lg:pr-16">
          <div className="flex flex-col  pt-16 items-aligned md:sticky md:top-24 ">
            <h2 className="max-w-md text-4xl font-bold text-aligned items-start">
              OUR LATEST <span className="whitespace-nowrap">PAGE-TURNERS</span>
            </h2>
            <p className="max-w-sm text-text text-aligned pt-8 md:pb-16">
              Books that touch on almost every topic of life. The real leaders
              in every field are the top readers in that field.
            </p>

            <div className="w-full max-md:hidden">
              <img
                src={booksImage}
                alt="Books"
                className="object-cover max-w-2xl w-full rounded-md"
              />
            </div>
          </div>
        </div>
        {/* Numbered List */}
        <div className="flex flex-col space-y-24 md:w-1/2 md:pt-32 min-h-screen md:pl-8 lg:pl-16  bg-white">
          {books
            ?.slice()
            .sort(
              (a, b) =>
                (a.created_at?.getTime() ?? 0) - (b.created_at?.getTime() ?? 0)
            )
            .slice(0, 3)
            .map((e) => (
              <ListItem book={e}></ListItem>
            ))}

          <div className="pt-0 pb-32">
            <h1 className="font-bold text-4xl uppercase text-end  text-gray-800">
              <span className="text-tertiary">New books</span> are being
              uploaded every day.
            </h1>
            <ButtonBase
              href="/books"
              as={Link}
              className="block text-center mt-8 bg-tertiary"
            >
              Browse all our books
            </ButtonBase>
          </div>
        </div>
      </div>
    </section>
  );
};

function ListItem({ book }: { book: Book }) {
  const { title, synopsis, description, book_cover_url } = book;
  const cart = useCart();
  const navigate = useNavigate();

  return (
    <div className="flex-col flex md:items-start items-center">
      <img
        src={book_cover_url}
        className="object-cover rounded-md w-56 h-auto self-end"
        alt=""
      />
      <h3 className="mb-4 text-lg font-bold md:block mt-8">{title}</h3>
      <p className="text-justify">{synopsis || description}</p>
      <ButtonBase
        className="md:self-end mt-8"
        onClick={async () => {
          if (!cart.has(book)) await cart.addToCart(book);
          navigate("/cart");
        }}
      >
        PRE-ORDER NOW
      </ButtonBase>
    </div>
  );
}

export default SectionOne;
