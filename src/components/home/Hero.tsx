import { Link } from "react-router-dom";

import { ButtonBase } from "../base/ButtonBase";
import { useSiteInfo } from "../../data/services/site_info";
const Hero = () => {
  const siteInfo = useSiteInfo();
  return (
    <section id="hero">
      <style>
        {`
         .backdrop-image {
            max-width: 1920px;
            margin: auto;
            background-image: url('${siteInfo?.background_img}');
            background-size: cover;
            background-position: 100%;
         } 
        `}
      </style>
      <div className="backdrop-image bg-gray-900 text-white pt-32 lg:pt-24">
        {/* Flex Container */}
        <div className="container min-h-[calc(100vh-6rem)]  flex flex-col-reverse md:justify-between items-stretch md:gap-8 space-y-0 md:space-y-0 md:flex-row">
          {/* Left Item */}
          <div className="flex flex-col mt-8  md:mt-12 mb-12 space-y-8 md:w-1/2 justify-center items-aligned   max-md:rounded-3xl max-md:py-8 max-md:shadow max-md:px-4">
            <h1
              className=" bg-black/10 ps-4 -ms-4 max-w-md text-4xl font-bold max-sm:text-left text-aligned md:text-5xl py-2 leading-tight md:leading-tight"
              dangerouslySetInnerHTML={{ __html: siteInfo?.title || "" }}
            ></h1>
            <p
              className="max-w-sm max-sm:text-left text-aligned  "
              dangerouslySetInnerHTML={{ __html: siteInfo?.description || "" }}
            ></p>
            <div className="flex justify-center md:justify-start w-full py-2">
              {/*@ts-expect-error  Hello */}
              <ButtonBase as={Link} to="/books">
                Read Now
              </ButtonBase>
            </div>
          </div>
          {/* Image */}
          <div className="md:w-1/2 xl:w-2/3 min-h-full flex items-center justify-center px-4 max-sm:pt-16 md:p-8">
            <img
              src={siteInfo?.landing_img}
              className="object-cover aspect-[0.75] min-h-72 lg:min-h-60 xl:min-h-72 max-h-[70vh] object-bottom bg-black rounded-2xl"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
