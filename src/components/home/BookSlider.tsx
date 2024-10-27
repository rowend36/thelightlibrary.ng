import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useWindowSize from "../../utils/useWindowSize";
import bookImage from "../../assets/my_images/image.png";
import { ArrowLeft, ArrowLeft2, ArrowRight, ArrowRight2 } from "iconsax-react";
import { ButtonBase } from "../base/ButtonBase";
import { useQuery } from "@tanstack/react-query";
import { queryFn } from "../../data/actions/queryFn";
import { mapResponseToBooks } from "../../data/actions/mappers";
import Loader from "../Loader";
import { Book } from "../../data/models/book";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../data/services/cart_manager";
export default function BookSlider() {
  const {
    data: books,
    // error,
    isLoading,
  } = useQuery({
    queryKey: ["books", "/featured"],
    select: mapResponseToBooks,
    queryFn,
  });

  const numSlides = Math.min(
    books?.length ?? 0,
    Math.max(Math.floor(useWindowSize().width / 512), 1)
  );

  const settings: Settings = {
    dots: true,
    infinite: books?.length > 1,
    speed: 500,
    arrows: true,
    slidesToShow: numSlides,
    autoplay: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    centerMode: numSlides > 1,
  };

  return (
    <section className="pt-8 sm:pt-16 md:pt-24 container md:max-lg:px-16">
      <h2 className="text-center text-3xl font-bold">
        Browse our featured books
      </h2>
      {books?.length ? (
        books.length > 1 ? (
          <Slider {...settings}>
            {books
              .slice(Math.max(0, Math.min(books.length - 3, 3)))
              .map((e) => (
                <SliderItem book={e} key={e.book_id} />
              ))}
          </Slider>
        ) : (
          <SliderItem book={books[0]} />
        )
      ) : (
        <div className="my-16">
          <Loader />
        </div>
      )}
    </section>
  );
}

function SliderItem({ book }: { book: Book }) {
  const cart = useCart();
  const navigate = useNavigate();
  return (
    <div className="py-6 md:py-8 lg:py-12">
      <div className=" relative overflow-hidden py-12 flex flex-col justify-center group">
        <img
          src={book.book_cover_url}
          className="peer object-cover mx-auto rounded-xl w-auto h-full  max-h-[70vh] max-md:max-w-none sm:max-md:w-[calc(100vw-14px)] max-md:flex-shrink-0 max-md:max-h-[50vmax]"
          alt=""
        />
        <div className="rounded flex flex-col items-center justify-center text-justify text-white p-8 absolute inset-y-0 w-full bg-gray-800/50 opacity-0 -left-full group-active:opacity-0 group-active:-left-full  group-hover:opacity-100 group-hover:left-0 transition-[opacity,left] duration-1000  backdrop-blur-md">
          <h1 className="font-bold text-xl mb-8">{book.title}</h1>
          <p>{book.synopsis ?? book.description}</p>
          <ButtonBase
            className="mt-8 bg-secondary"
            onClick={async () => {
              if (!cart.has(book)) await cart.addToCart(book);
              navigate("/cart");
            }}
          >
            Order Now
          </ButtonBase>
        </div>
      </div>
    </div>
  );
}

function NextArrow({ slideCount = 0, currentSlide = 0, className, ...props }) {
  return (
    <ArrowRight2
      className={
        "text-primary -right-4 z-20 sm:-right-12 w-12 h-12 max-sm:bg-white/50 rounded-full hover:text-primaryHover " +
        className
      }
      {...props}
      size={48}
    />
  );
}

function PrevArrow({ slideCount = 0, currentSlide = 0, className, ...props }) {
  return (
    <ArrowLeft2
      className={
        "text-primary -left-4 z-20 sm:-left-12 w-12 h-12 max-sm:bg-white/50 rounded-full hover:text-primaryHover " +
        className
      }
      {...props}
      size={48}
    />
  );
}
