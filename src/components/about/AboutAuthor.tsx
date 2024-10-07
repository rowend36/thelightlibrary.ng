import authorImage from "../../assets/my_images/man_in_pink_suit.jpg";

const AboutAuthor = () => {
  return (
    <section id="hero" className="py-16 container">
      <h1 className="text-5xl font-bold mb-8 text-end">About Author</h1>
      <div className="flex max-sm:flex-wrap items-start">
        <img
          src={authorImage}
          className="w-96 max-w-full min-w-[50%] max-h-[calc(100vh-6rem)] object-cover object-top"
        />
        <div className="sm:container sm:pr-0 pt-24 basis-1/2 top-24">
          <p className="leading-relaxed mb-4 text-text text-justify">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem aut
            laborum nihil excepturi, iusto doloremque error alias molestias
            autem dolor quod magnam repudiandae soluta iste amet sapiente quas
            corporis porro.
          </p>
          <p className="leading-relaxed mb-4 text-text text-justify">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem aut
            laborum nihil excepturi, iusto doloremque error alias molestias
            autem dolor quod magnam repudiandae soluta iste amet sapiente quas
            corporis porro.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutAuthor;
