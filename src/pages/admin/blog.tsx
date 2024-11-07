import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AddSquare, Trash } from "iconsax-react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { ButtonBase } from "../../components/base/ButtonBase";
import Loader from "../../components/Loader";
import { mapResponseToBlogList } from "../../data/actions/mappers";
import { authQueryFn, fetcher } from "../../data/actions/queryFn";
import { Post } from "../../data/models/post";

export default function AdminBlogPage() {
  const queryClient = useQueryClient();
  const {
    data: posts,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["posts/", "admin"],
    queryFn: authQueryFn,
    select: mapResponseToBlogList,
  });
  console.log({ posts, error, isLoading });
  if (!posts) return <Loader />;
  return (
    <>
      <ButtonBase
        className="ml-auto mb-8 flex gap-4 items-center max-w-max "
        as={Link}
        to="/admin/blog/new/"
      >
        <AddSquare className="mb-1" />
        <span>Add New Post</span>
      </ButtonBase>
      <DataTable
        className="w-full mb-8"
        data={posts!}
        keyField="book_id"
        columns={[
          {
            name: "ID",
            minWidth: "auto",
            grow: 0,
            selector(e: Post) {
              return e.post_id;
            },
          },
          {
            name: "Title",
            selector(e: Post) {
              return e.title;
            },
          },
          {
            name: "Status",

            selector(e: Post) {
              return e.status;
            },
          },
          {
            name: "Created At",

            selector(e: Post) {
              return e.created_at?.toDateString() ?? "--";
            },
          },

          {
            name: "Updated At",

            selector(e: Post) {
              return e.updated_at?.toDateString() ?? "--";
            },
          },
          {
            name: "-",
            grow: 0,
            minWidth: "184px",
            selector(e: Post) {
              return (
                <div className="flex h-full items-center gap-2">
                  <Link
                    to={"/admin/blog/" + e.post_id}
                    className=" text-primary hover:bg-primaryHover/20 active:bg-primaryHover p-2 rounded-md text-sm"
                  >
                    <Trash className="inline mr-2 mb-1" size={16} />
                    Edit
                  </Link>

                  <button
                    className=" text-red-700 hover:bg-red-100 active:bg-red-200 p-2 rounded-md text-sm flex-0"
                    onClick={async () => {
                      const res = confirm("Delete post " + e.title);
                      if (res) {
                        await fetcher("posts/" + e.post_id, {
                          method: "DELETE",
                        });
                        await queryClient.refetchQueries({
                          queryKey: ["posts/"],
                        });
                      }
                    }}
                  >
                    <Trash className="inline mr-2 mb-1" size={16} />
                    Delete
                  </button>
                </div>
              );
            },
          },
        ]}
        progressPending={!posts}
        progressComponent={<Loader className="pt-14" />}
      />
    </>
  );
}
