import Link from "next/link";
import Image from "next/image";

import illustrationIntro from "@/assets/images/library2.jpg";
import { ButtonBase } from "../base/ButtonBase";

const Hero = () => {
  return (
    <section id="hero">
      {/* Flex Container */}
      <div className="container  flex flex-col-reverse md:justify-between items-stretch md:gap-8 space-y-0 md:space-y-0 md:flex-row">
        {/* Left Item */}
        <div className="flex flex-col mt-16 mb-16 space-y-8 md:w-1/2 justify-center items-aligned max-md:bg-white max-md:bg-opacity-75 max-md:-mt-36 max-md:rounded-3xl max-md:py-8 max-md:shadow max-md:px-4">
          <h1 className="max-w-md text-4xl font-bold max-sm:text-left text-aligned md:text-5xl py-2 leading-tight md:leading-tight">
            Welcome To{" "}
            <span className="text-nowrap max-[300px]:text-wrap text-primary">
              NYSC E&#8209;Library
            </span>
          </h1>
          <p className="max-w-sm max-sm:text-left text-aligned text-text ">
            NYSC Library is a modern e-library platform that offers a vast
            collection of books, articles, and resources for all your reading
            needs. Whether you're a student, professional, or avid reader, NYSC
            Library has something for everyone.
          </p>
          <div className="flex justify-center md:justify-start w-full py-2">
            <ButtonBase as={Link} href="/books">
              Get Started
            </ButtonBase>
          </div>
        </div>
        {/* Image */}
        <div className="md:w-1/2 xl:w-2/3 max-md:flex max-md:justify-center">
          <Image
            priority
            src={illustrationIntro}
            className="object-cover ms-auto h-full max-md:max-w-none max-sm:w-screen sm:max-md:w-[calc(100vw-14px)] max-md:flex-shrink-0 max-md:max-h-[50vmax]"
            alt=""
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
