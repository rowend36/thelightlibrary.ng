import { Link } from "react-router-dom";

import avatarAnisha from "../../assets/images/avatar-anisha.png";
// import avatarAli from "../assets/images/avatar-ali.png";
// import avatarRichard from "../assets/images/avatar-richard.png";
import { useQuery } from "@tanstack/react-query";
import { Link2, QuoteUpCircle } from "iconsax-react";
import { mapResponseToReviewList } from "../../data/actions/mappers";
import { queryFn } from "../../data/actions/queryFn";
import { SiteReview } from "../../data/models/site_review";
import { ButtonBase } from "../base/ButtonBase";
import Loader from "../Loader";

const Testimonial = () => {
  const {
    data: reviews,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["site-reviews", "?limit=3"],
    queryFn: queryFn,
    select: mapResponseToReviewList,
  });
  return (
    <section
      id="testimonials"
      className="bg-gradient-radial from-gray-200 via-gray-50 py-1"
    >
      {/* Container to heading and testm blocks */}
      <div className="container mt-32 text-aligned lg:text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center">Book Reviews</h2>
        {/* Testimonials Container */}
        <div className="flex flex-col md:mt-16 md:flex-row md:-space-x-6 justify-center">
          {reviews?.length ? (
            reviews.map((review, i) => {
              return (
                <Card
                  review={review}
                  center={
                    (i === 1 && reviews.length === 3) ||
                    (i === 0 && reviews.length === 1)
                  }
                />
              );
            })
          ) : (
            <Loader />
          )}
        </div>
        {/* Button */}
        <div className="mt-8 mb-16 text-center">
          {/* @ts-expect-error Error*/}
          <ButtonBase as={Link} href="/books" className="align-top">
            <Link2 size={24} className="inline-block text-white me-2 -mt-1 " />
            View our entire library
          </ButtonBase>
        </div>
      </div>
    </section>
  );
};

const Card = function Card({ center = false, review = null! as SiteReview }) {
  return (
    <div
      className={` ${
        center ? " z-10 relative md:bottom-8" : ""
      } flex flex-col mb-16 max-w-md items-center text-center md:w-1/3 flex-grow`}
    >
      <div
        className={` ${
          center ? "bg-gray-800 text-white md:shadow-lg   " : "bg-white"
        } shadow-md p-6 pb-14 rounded-sm w-full`}
      >
        {/* <Image src={avatarRichard} className='object-contain w-16 -mt-14' alt='' /> */}
        <QuoteUpCircle
          className={`${
            center ? "text-gray-600" : "text-gray-200"
          } mb-6 block mx-auto`}
          size={48}
        />

        <p className={`${center ? "text-white" : "text-text"} text-sm px-8`}>
          {review.content}”
        </p>
      </div>

      <img
        src={review.guest_photo || avatarAnisha}
        className="w-16 h-16 rounded-full -mt-8 z-10"
      />
      <span className="mt-2">{review.guest_name}</span>
      <span className="text-sm">{review.guest_title}</span>
    </div>
  );
};

export default Testimonial;
