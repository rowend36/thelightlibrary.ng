import { ModelRepository } from "../utils/model_repository";

export const reviewRepository = new ModelRepository("reviews", "review_id", [
  "review_id",
  "book_id",
  "comment",
  "created_at",
  "user_id",
  "rating",
])
  .hasOne({
    table: "users",
    columns: ["username"],
    pk: "user_id",
  })
  .hasOne({
    table: "books",
    columns: ["title"],
    pk: "book_id",
  });

export const siteReviewRepository = new ModelRepository(
  "site_reviews",
  "comment_id",
  [
    "comment_id",
    "content",
    "guest_name",
    "guest_photo",
    "guest_title",
    "created_at",
    "updated_at",
  ]
);

export const getAllReviewFiles = function () {
  return [
    siteReviewRepository
      .select()
      .clearSelect()
      .select("guest_photo", "site_reviews.updated_at"),
  ];
};
