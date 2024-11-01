import { ModelService } from "../utils/model_service";

export const reviewService = new ModelService("reviews", "review_id", [
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

export const siteReviewService = new ModelService(
  "site_reviews",
  "comment_id",
  ["comment_id", "content", "guest_name", "guest_photo", "guest_title"]
);
