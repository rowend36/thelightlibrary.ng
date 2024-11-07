import { useQuery } from "@tanstack/react-query";
import BlogSection, { PostView } from "../components/home/BlogSection";
import Footer from "../components/home/Footer";
import Navbar from "../components/home/Navbar";
import Loader from "../components/Loader";
import { mapResponseToBlog } from "../data/actions/mappers";
import { queryFn } from "../data/actions/queryFn";
import { useParams } from "react-router-dom";
import RecommendedBooks from "../components/home/RecommendedBooks";
import formatDate from "../utils/format_date";

export default function BlogDetailsPage() {
  const params = useParams();
  const {
    data: post,
    // error,
    isLoading,
  } = useQuery({
    queryKey: ["posts", "/" + params.id],
    select: mapResponseToBlog,
    queryFn,
  });
  return (
    <>
      <Navbar />
      <div className="pt-36 container">
        {post ? (
          <a className="text-start" href={"/blog/" + post.post_id}>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-sm text-end">{formatDate(post.published_at)}</p>
            <div className="mt-4 leading-8">
              {post.tags?.map((tag) => (
                <span className="text-white bg-gray-500 px-2 mr-2  py-1  rounded-md">
                  {tag}{" "}
                </span>
              ))}
              <p
                className="text-justify text-text break-all max-h-24 overflow-hidden line-clamp-3 mt-12 text-xl"
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></p>
            </div>
          </a>
        ) : (
          <Loader />
        )}
      </div>
      <BlogSection />
      <RecommendedBooks />
      <Footer />
    </>
  );
}
