import { useSiteInfo } from "../../data/services/site_info";

const AboutSite = () => {
  const siteInfo = useSiteInfo();
  return (
    <section id="hero" className="py-16 container">
      <h1 className="text-5xl font-bold mb-8">The Gleaming Catalog</h1>
      {siteInfo?.about_website.split("\n").map((e, i) => {
        return (
          <p className="leading-relaxed mb-4 text-text max-w-3xl" key={i}>
            {e}
          </p>
        );
      })}
    </section>
  );
};

export default AboutSite;
