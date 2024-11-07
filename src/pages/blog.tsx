import { useQuery } from "@tanstack/react-query";
import { Link2 } from "iconsax-react";
import { ButtonBase } from "../components/base/ButtonBase";
import Loader from "../components/Loader";
import { mapResponseToBlogList } from "../data/actions/mappers";
import { queryFn } from "../data/actions/queryFn";
import { Post } from "../data/models/post";
import formatDate from "../utils/format_date";
import Link from "../components/base/Link";
import Navbar from "../components/home/Navbar";
import CallToAction from "../components/home/CallToAction";
import Footer from "../components/home/Footer";
import { PostView } from "../components/home/BlogSection";

export default function BlogPage() {
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
    <>
      <Navbar />
      <section
        id="vlog"
        className="bg-gradient-radial from-gray-200 via-gray-50 py-1"
      >
        <div className="container mt-32 text-aligned lg:text-center">
          {/* Heading */}
          <h2 className="text-4xl font-bold text-center mb-8">Latest Posts</h2>
          {/* vlog Container */}

          {/* Testimonial 1 */}
          {isLoading ? (
            <Loader />
          ) : posts?.length ? (
            posts?.map((post: Post) => (
              <PostView key={post.post_id} post={post} />
            ))
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </section>
      <CallToAction />
      <Footer />
    </>
  );
}
