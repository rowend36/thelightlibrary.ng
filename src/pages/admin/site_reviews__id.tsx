import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataForm } from "../../components/admin/DataView";
import {
  mapResponseToSiteReview,
  mapResponseToSiteReviews,
} from "../../data/actions/mappers";
import { fetcher, queryFn } from "../../data/actions/queryFn";
import { SiteReview } from "../../data/models/site_review";
import Loader from "../../components/Loader";

export default function AdminEditSiteReviewsPage(): JSX.Element {
  const params = useParams();
  const {
    data: siteReview,
    // error,
    isLoading,
  } = useQuery({
    queryKey: ["site-reviews", "/" + params.id],
    select: mapResponseToSiteReview,
    queryFn,
  });

  return siteReview ? <SiteReviewForm data={siteReview} /> : <Loader />;
}

export function SiteReviewForm({
  data: siteReview,
}: {
  data?: SiteReview | undefined;
}) {
  const navigate = useNavigate();
  return (
    <>
      <DataForm<Omit<SiteReview, "created_at">>
        onSubmit={async (data) => {
          if (siteReview) {
            await fetcher("site-reviews/" + siteReview?.comment_id, {
              method: "PATCH",
              data: data,
            });
          } else {
            await fetcher("site-reviews", {
              method: "POST",
              data: data,
            });
          }
          navigate("/admin/site-reviews");
        }}
        initial={siteReview ?? null}
        specs={{
          guest_photo: {
            label: "Reviewer Photo",
            formType: "image",
            placeholder: "Upload a photo",
          },
          guest_name: { label: "Reviewer Name" },
          guest_title: {
            label: "Reviewer Title",
            placeholder: "e.g CEO Reelest Studios",
          },
          content: { label: "Review", formType: "longtext" },
        }}
      />
      <div className="h-40" />
    </>
  );
}
