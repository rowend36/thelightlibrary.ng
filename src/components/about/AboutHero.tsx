import { Link } from "react-router-dom";
import illustrationIntro from "../../assets/my_images/man-thinker.jpg";
import { ButtonBase } from "../base/ButtonBase";
import bookImage from "../../assets/images/library.jpg";
const AboutHero = () => {
  return (
    <section id="hero">
      <style>
        {`
         .backdrop-image {
            max-width: 1920px;
            margin: auto;
            background-image: url('${bookImage}');
            background-size: cover;
            background-position: 100%;
         } 
        `}
      </style>
      <div className="backdrop-image bg-gray-900 text-white pt-32 lg:pt-24">
        {/* Flex Container */}
        <div className="container bg-gray-900/25 landscape:min-h-[calc(100vh-6rem)]  flex flex-col-reverse justify-center items-center  md:gap-8 space-y-0 md:space-y-0 md:flex-row">
          <h1 className="text-7xl md:text-9xl pb-12 md:pb-24 pt-8 font-bold tracking-wide text-gray-100 leading-snug ">
            About Us
          </h1>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
