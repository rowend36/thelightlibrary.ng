import { Link } from "react-router-dom";

import avatarAnisha from "../../assets/images/avatar-anisha.png";
// import avatarAli from "../assets/images/avatar-ali.png";
// import avatarRichard from "../assets/images/avatar-richard.png";
import { ButtonBase } from "../base/ButtonBase";
import { Link1, Link2, QuoteUpCircle } from "iconsax-react";

const Testimonial = () => {
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
        <div className="flex flex-col md:mt-16 md:flex-row md:-space-x-6">
          {/* Testimonial 1 */}
          <Card />
          <Card center />
          <Card />
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

const Card = function Card({ center = false }) {
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
          NYSC Abia Library is a valauable tool that has improved my academic
          research. A big shout out to the team behind it.”
        </p>
      </div>

      <img src={avatarAnisha} className="w-16 h-16 rounded-full -mt-8 z-10" />
      <span className="mt-2">Richard Watts</span>
      <span className="text-sm">Senior Developer</span>
    </div>
  );
};

export default Testimonial;
