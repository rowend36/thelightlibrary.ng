import { Link2 } from "iconsax-react";
import { ButtonBase } from "../base/ButtonBase";
import Link from "../base/Link";
import { useQuery } from "@tanstack/react-query";
import { mapResponseToBlogList } from "../../data/actions/mappers";
import { queryFn } from "../../data/actions/queryFn";
import { Post } from "../../data/models/post";
import Loader from "../Loader";
import formatDate from "../../utils/format_date";

export default function BlogSection() {
  const {
    data: posts,
    // error,
    isLoading,
  } = useQuery({
    queryKey: ["posts"],
    select: mapResponseToBlogList,
    queryFn,
  });
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
          {isLoading ? (
            <Loader />
          ) : posts?.length ? (
            posts?.slice(0, 3).map((post: Post) => (
              <div className="md:w-1/3 flex-grow">
                <PostView key={post.post_id} post={post} spaced />
              </div>
            ))
          ) : (
            <p>No posts available</p>
          )}
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

export function PostView({ post, spaced }: { post: Post; spaced?: boolean }) {
  return (
    <a
      className={
        "text-start w-full" + (spaced ? " md:flex md:flex-col md:h-full" : "")
      }
      href={"/blog/" + post.post_id}
    >
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p
        className="text-justify text-text break-all max-h-24 overflow-hidden line-clamp-3"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></p>
      {spaced ? <div style={{ flexGrow: 1 }} /> : null}
      <p className="text-sm text-end">{formatDate(post.published_at)}</p>
      <div className="mt-4 leading-8">
        {post.tags?.map((tag) => (
          <span className="text-white bg-gray-500 px-2 mr-2  py-1  rounded-md">
            {tag}{" "}
          </span>
        ))}
      </div>
    </a>
  );
}
