import { z } from "zod";

export const reviewSchema = z.object({
  review_id: z.number(),
  book_id: z.number(),
  user_id: z.number(),
  rating: z.number(),
  comment: z.string(),
});
export const createReviewSchema = reviewSchema.omit({
  review_id: true,
});

export const siteReviewSchema = z.object({
  comment_id: z.number(),
  guest_name: z.string(),
  guest_title: z.string(),
  guest_photo: z.string(),
  content: z.string(),
});

export const createSiteReviewSchema = siteReviewSchema.omit({
  comment_id: true,
});
