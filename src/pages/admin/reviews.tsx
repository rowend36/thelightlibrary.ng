import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash } from "iconsax-react";
import DataTable from "react-data-table-component";
import Loader from "../../components/Loader";
import {
  mapResponseToReview,
  mapResponseToReviewList,
} from "../../data/actions/mappers";
import { authQueryFn, fetcher } from "../../data/actions/queryFn";
import { Review } from "../../data/models/review";

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const {
    data: reviews,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["reviews/"],
    queryFn: authQueryFn,
    select: mapResponseToReviewList,
  });
  console.log({ reviews, error, isLoading });
  if (!reviews) return <Loader />;
  return (
    <>
      <DataTable
        className="w-full mb-8"
        data={reviews!}
        keyField="book_id"
        columns={[
          {
            name: "ID",
            minWidth: "auto",
            grow: 0,
            selector(e: Review) {
              return e.review_id;
            },
          },
          {
            name: "Rating",
            selector(e: Review) {
              return e.rating;
            },
          },
          {
            name: "Review",

            selector(e: Review) {
              return e.comment;
            },
          },
          {
            name: "Created At",

            selector(e: Review) {
              return e.created_at?.toDateString() ?? "--";
            },
          },

          {
            name: "-",
            grow: 0,
            minWidth: "184px",
            selector(e: Review) {
              return (
                <div className="flex h-full items-center gap-2">
                  <button
                    className=" text-red-700 hover:bg-red-100 active:bg-red-200 p-2 rounded-md text-sm flex-0"
                    onClick={async () => {
                      const res = confirm("Delete review " + e.review_id);
                      if (res) {
                        await fetcher("reviews/" + e.review_id, {
                          method: "DELETE",
                        });
                        await queryClient.refetchQueries({
                          queryKey: ["reviews/"],
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
        progressPending={!reviews}
        progressComponent={<Loader className="pt-14" />}
      />
    </>
  );
}
