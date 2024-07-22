import { MONTHS } from "@/utils/constants";
import { z } from "zod";

export const submitBookSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  published_date: z
    .string()
    .refine((date) => {
      const [year, month] = date.split("-");
      return year.length === 4 && month.length === 2 && parseInt(month) <= 12;
    })
    .transform((date) => {
      const [year, month] = date.split("-");
      return new Date(parseInt(year), parseInt(month) - 1);
    }),
  authors: z
    .array(
      z.object({
        name: z.string().min(3),
        author_id: z.coerce.number(),
        biography: z.string().optional().default(""),
      })
    )
    .min(1),

  pdf: z.instanceof(File).refine((e) => e.size > 0, "File is required"),
});
