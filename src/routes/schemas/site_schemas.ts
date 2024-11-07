import { z } from "zod";

export const siteSchema = z.object({
  profile: z.string().default("default"),
  title: z.string(),
  background_img: z.string().optional(),
  landing_img: z.string().optional(),
  author_img: z.string().optional(),
  about_website: z.string().optional(),
  about_author: z.string().optional(),
  description: z.string().optional(),
  title2: z.string().optional(),
  description2: z.string().optional(),
});
