import { useSiteInfo } from "../../data/services/site_info";

const AboutAuthor = () => {
  const siteInfo = useSiteInfo();
  return (
    <section id="hero" className="py-16 container">
      <h1 className="text-5xl font-bold mb-8 text-end">About Author</h1>
      <div className="flex max-sm:flex-wrap items-start">
        <img
          src={siteInfo?.author_img}
          className="w-96 max-w-full min-w-[50%] max-h-[calc(100vh-6rem)] object-cover object-top bg-gray-600 aspect-[0.75]"
        />
        <div className="sm:container sm:pr-0 max-lg:pt-8 pt-16 basis-1/2 top-24 flex-grow">
          {siteInfo?.about_author.split("\n").map((e) => {
            return (
              <p className="leading-relaxed mb-4 text-text text-justify">{e}</p>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutAuthor;
