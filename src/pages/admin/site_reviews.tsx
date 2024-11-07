import { useQuery } from "@tanstack/react-query";
import { DataView } from "../../components/admin/DataView";
import { queryFn } from "../../data/actions/queryFn";
import { SiteReview } from "../../data/models/site_review";
import { mapResponseToSiteReviews } from "../../data/actions/mappers";
import { ButtonBase } from "../../components/base/ButtonBase";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EditOpenDeletePanel } from "../../components/admin/EditOpenDeletePanel";

export default function SiteReviewsPage(): JSX.Element {
  const {
    data: siteReviews,
    // error,
    isLoading,
  } = useQuery({
    queryKey: ["site-reviews"],
    select: mapResponseToSiteReviews,
    queryFn,
  });
  return (
    <>
      <ButtonBase
        className="mb-4 block ml-auto w-max"
        as={Link}
        to="/admin/site-reviews/new"
      >
        Add Site Review
      </ButtonBase>
      <DataView<Omit<SiteReview, "guest_photo">>
        data={siteReviews}
        specs={{
          comment_id: {
            label: "ID",
          },
          guest_name: {
            label: "Name",
          },
          guest_title: {
            label: "Title",
          },
          content: {
            label: "Content",
          },
          created_at: {
            label: "Created At",
            formType: "date",
          },
        }}
        actions={(e) => (
          <EditOpenDeletePanel
            onEdit={"/admin/site-reviews/" + e.comment_id}
            onDelete={"site-reviews/" + e.comment_id}
            refreshRoute={["site-reviews"]}
          />
        )}
      />
    </>
  );
}
