import Link from 'next/link';
import Image from 'next/image';

import illustrationIntro from '../assets/images/illustration-intro.svg';

const Hero = () => {
  return (
    <section id='hero'>
      {/* Flex Container */}
      <div className='container flex flex-col-reverse items-center px-6 mx-auto mt-10 space-y-0 md:space-y-0 md:flex-row'>
        {/* Left Item */}
        <div className='flex flex-col mb-32 space-y-12 md:w-1/2'>
          <h1 className='max-w-md text-4xl font-bold text-center md:text-5xl md:text-left'>
          Welcome to NYSC Library
          </h1>
          <p className='max-w-sm text-center text-darkGrayishBlue md:text-left'>
          NYSC Library is a modern e-library platform that offers a vast collection of books, articles, and resources for all your reading needs. Whether you're a student, professional, or avid reader, NYSC Library has something for everyone.
          </p>
          <div className='flex justify-center md:justify-start'>
            <Link
              href='#'
              className='p-3 px-6 pt-2 text-white bg-brightRed rounded-full baseline hover:bg-brightRedLight'
            >
              Get Started
            </Link>
          </div>
        </div>
        {/* Image */}
        <div className='md:w-1/2'>
          <Image src={illustrationIntro} alt='' />
        </div>
      </div>
    </section>
  );
};

export default Hero;
