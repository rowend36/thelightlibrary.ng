import { z } from "zod";

export const siteSchema = z.object({
  profile: z.string().default("default"),
  background_img: z.string().optional().default(""),
  landing_img: z.string().optional().default(""),
  author_img: z.string().optional().default(""),
  about_website: z.string().optional(),
  about_author: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  title2: z.string().optional(),
  description2: z.string().optional(),
});
