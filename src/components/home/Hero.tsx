import { Link } from "react-router-dom";
import illustrationIntro from "../../assets/my_images/man-thinker.jpg";
import { ButtonBase } from "../base/ButtonBase";
import bookImage from "../../assets/my_images/image.png";
const Hero = () => {
  return (
    <section id="hero">
      <style>
        {`
         .backdrop-image {
            max-width: 1920px;
            margin: auto;
            background-image: url('${illustrationIntro}');
            background-size: cover;
            background-position: 100%;
         } 
        `}
      </style>
      <div className="backdrop-image bg-gray-900 text-white pt-32">
        {/* Flex Container */}
        <div className="container min-h-[calc(100vh-8rem)]  flex flex-col-reverse md:justify-between items-stretch md:gap-8 space-y-0 md:space-y-0 md:flex-row">
          {/* Left Item */}
          <div className="flex flex-col mt-8 mb-16 space-y-8 md:w-1/2 justify-center items-aligned   max-md:rounded-3xl max-md:py-8 max-md:shadow max-md:px-4">
            <h1 className=" bg-black/10 ps-4 -ms-4 max-w-md text-4xl font-bold max-sm:text-left text-aligned md:text-5xl py-2 leading-tight md:leading-tight">
              The <span className="text-primaryLight">Book</span> That Will{" "}
              <span className="text-white">Change</span>{" "}
              <span className="text-tertiary">Everything</span>
            </h1>
            <p className="max-w-sm max-sm:text-left text-aligned  ">
              NYSC Abia Library is a modern e-library platform that offers a
              vast collection of books, articles, and resources for all your
              reading needs. Whether you're a student, professional, or avid
              reader, NYSC Abia Library has something for everyone.
            </p>
            <div className="flex justify-center md:justify-start w-full py-2">
              {/*@ts-expect-error  Hello */}
              <ButtonBase as={Link} href="/">
                Get Started
              </ButtonBase>
            </div>
          </div>
          {/* Image */}
          <div className=" md:w-1/2 xl:w-2/3 min-h-full flex items-center justify-center px-4 pt-16 md:p-8">
            <img
              src={bookImage}
              className="object-contain mx-auto rounded-xl w-full h-full max-h-[70vh] max-md:max-w-none max-sm:w-screen sm:max-md:w-[calc(100vw-14px)] max-md:flex-shrink-0 max-md:max-h-[50vmax]"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
