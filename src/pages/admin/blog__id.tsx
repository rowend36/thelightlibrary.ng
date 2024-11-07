import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import "react-quill/dist/quill.snow.css";
import { Form, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { mapResponseToBlog } from "../../data/actions/mappers";
import { authQueryFn, fetcher } from "../../data/actions/queryFn";
import InputBase from "../../components/base/InputBase";
import { Post } from "../../data/models/post";

import { ButtonBase } from "../../components/base/ButtonBase";
import { Save2 } from "iconsax-react";
import isServerSide from "../../utils/isServerSide";

export default function AdminEditBlogPage() {
  const route = useParams();
  const queryClient = useQueryClient();
  const {
    data: post,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["posts/", "admin/", route.id!],
    queryFn: authQueryFn,
    select: mapResponseToBlog,
  });

  if (!post) return <Loader />;
  return <BlogForm post={post} />;
}

export function BlogForm({ post }: { post?: Post }) {
  const [title, setTitle] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ReactQuill, setReactQuill] = useState<any>(null);
  useEffect(() => {
    if (!isServerSide) {
      import("react-quill").then((module) => {
        setReactQuill(() => module.default);
      });
    }
  }, []);
  const navigate = useNavigate();
  const [published, setPublished] = useState(false);
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  useEffect(() => {
    setTitle(post?.title ?? "");
    setPublished(post?.status === "published");
    setContent(post?.content ?? "");
  }, [post]);

  return (
    <Form>
      <InputBase
        name="title"
        className="mb-8"
        label="Title of the Post"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="flex items-center mb-8 justify-end">
        <input
          name="status"
          type="checkbox"
          id="status"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="mr-2 mb-1 w-4 h-4"
        />
        <label htmlFor="status">Publish</label>
      </div>
      <style>{`
        .ql-editor {
          min-height: 300px;
          font-size: 16px;
          color: #333333;
        }
        .ql-editor h1,h2,h3,h4,h5,h6 {
          font-weight: 700;
        }
        .ql-editor img {
          max-width: 480px;
          width: 100%;
          height: auto;
          display: block;
        }
      `}</style>
      {ReactQuill ? (
        <ReactQuill
          theme="snow"
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ align: ["right", "center", "justify"] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
            ],
          }}
          value={content}
          defaultValue={post?.content ?? ""}
          onChange={setContent}
        />
      ) : null}
      <ButtonBase
        className="mt-8 flex gap-2 "
        onClick={async () => {
          if (post) {
            // update post
            fetcher("posts/" + post.post_id, {
              method: "PATCH",
              data: {
                title,
                content,
                status: published ? "published" : "draft",
              },
            }).then(() => {
              queryClient.invalidateQueries({
                queryKey: ["posts/"],
              });
            });
          } else {
            // create post
            const { post_id } = await fetcher("posts/", {
              data: {
                title,
                content,
                status: published ? "published" : "draft",
              },
            });

            queryClient.invalidateQueries({
              queryKey: ["posts/"],
            });

            navigate("/admin/blog/" + post_id);
          }
        }}
      >
        <Save2 className="mb-1" />
        <span>{post ? "Update Post" : "Add New Post"}</span>
      </ButtonBase>
      <div className="h-16" />
    </Form>
  );
}
