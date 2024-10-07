import { Link2 } from "iconsax-react";
import { ButtonBase } from "../base/ButtonBase";
import Link from "../base/Link";

export default function BlogSection() {
  return (
    <section
      id="vlog"
      className="bg-gradient-radial from-gray-200 via-gray-50 py-1"
    >
      <div className="container mt-32 text-aligned lg:text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center">Latest Posts</h2>
        {/* vlog Container */}
        <div className="flex flex-col md:mt-16 md:flex-row gap-x-12 gap-y-16 flex-wrap">
          {/* Testimonial 1 */}
          <Post />
          <Post />
          <Post />
        </div>
        {/* Button */}
        <div className="mt-16 mb-16 text-center">
          {/* @ts-expect-error Error*/}
          <ButtonBase as={Link} href="/blog" className="align-top">
            <Link2 size={24} className="inline-block text-white me-2 -mt-1 " />
            View all posts
          </ButtonBase>
        </div>
      </div>
    </section>
  );
}

function Post() {
  return (
    <div className="text-start">
      <h1 className="text-2xl font-bold mb-4">This is a post</h1>
      <p className="text-justify text-text break-all">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Totam quidem
        illo ipsum, in, repellendus dolores quos dolor, nulla exercitationem
        pariatur voluptas ducimus. Repudiandae nobis dolor ullam iste impedit
        rem recusandae!
      </p>
      <p className="text-sm text-end">Two weeks ago</p>
      <div className="mt-4 leading-8">
        <span className="text-white bg-gray-500 px-2 mr-2  py-1  rounded-md">
          Motivation{" "}
        </span>

        <span className="text-white bg-gray-500 px-2 mr-2  py-1 rounded-md">
          Motivation{" "}
        </span>

        <span className="text-white bg-gray-500 px-2 mr-2  py-1 rounded-md">
          Motivation{" "}
        </span>
      </div>
    </div>
  );
}
