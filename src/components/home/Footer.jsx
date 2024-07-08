import Link from "next/link";
import Image from "next/image";

import companyLogoWhite from "@/assets/images/logo-white.svg";
import facebookLogo from "@/assets/images/icon-facebook.svg";
import youtubeLogo from "@/assets/images/icon-youtube.svg";
import twitterLogo from "@/assets/images/icon-twitter.svg";
import pinterestLogo from "@/assets/images/icon-pinterest.svg";
import instagramLogo from "@/assets/images/icon-instagram.svg";
import InputBase from "../base/InputBase";
import { ButtonBase } from "../base/ButtonBase";
import { AppLogo } from "../AppLogo";

const Footer = () => {
  return (
    <div className="bg-veryDarkBlue">
      {/* Flex Container */}
      <div className="container  flex flex-col-reverse md:flex-row max-sm:flex-wrap py-10 space-y-8 lg:flex-row lg:space-y-0 lg:space-x-4 md:space-x-16">
        {/* Logo and social links container */}
        <div className="flex flex-grow flex-col-reverse items-center justify-between space-y-12 lg:flex-col lg:space-y-0 lg:items-start">
          <div className="mx-auto my-6 text-center text-white lg:hidden">
            Copyright © 2022, All Rights Reserved
          </div>
          {/* Logo */}
          <div>
            <AppLogo />
          </div>
          {/* Social Links Container */}
          <div className="flex justify-center space-x-4">
            {/* Link 1 */}
            <Link href="#">
              <Image src={facebookLogo} className="object-contain h-8" alt="" />
            </Link>
            {/* Link 2 */}
            <Link href="#">
              <Image src={youtubeLogo} className="object-contain h-8" alt="" />
            </Link>
            {/* Link 3 */}
            <Link href="#">
              <Image src={twitterLogo} className="object-contain h-8" alt="" />
            </Link>
            {/* Link 4 */}
            <Link href="#">
              <Image
                src={pinterestLogo}
                className="object-contain h-8"
                alt=""
              />
            </Link>
            {/* Link 5 */}
            <Link href="#">
              <Image
                src={instagramLogo}
                className="object-contain h-8"
                alt=""
              />
            </Link>
          </div>
        </div>
        {/* List Container */}
        <div className="flex flex-grow flex-wrap gap-x-32 gap-y-8">
          <div className="flex md:justify-around flex-wrap gap-x-32 gap-y-4">
            <div className="flex flex-col space-y-3 text-white">
              <Link href="#" className="hover:text-primary">
                Home
              </Link>
              <Link href="#" className="hover:text-primary">
                Pricing
              </Link>
              <Link href="#" className="hover:text-primary">
                Products
              </Link>
              <Link href="#" className="hover:text-primary">
                About
              </Link>
            </div>
            <div className="flex flex-col space-y-3 text-white">
              <Link href="#" className="hover:text-primary">
                Careers
              </Link>
              <Link href="#" className="hover:text-primary">
                Community
              </Link>
              <Link href="#" className="hover:text-primary">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Input Container */}
          <div className="flex flex-grow flex-col justify-between text-white">
            <form>
              <div className="flex gap-4 items-end flex-wrap">
                <InputBase
                  type="text"
                  label="Stay updated in your inbox"
                  className="flex-1"
                  placeholder="Enter your email"
                />
                <ButtonBase>Go</ButtonBase>
              </div>
            </form>
            <div className="hidden text-white lg:block">
              Copyright © 2022, All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
