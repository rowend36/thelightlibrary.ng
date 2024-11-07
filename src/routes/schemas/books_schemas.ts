import { z } from "zod";

export const searchAuthorSchema = z.object({
  name: z.string(),
});

export const submitBookSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  price: z.string().refine((val) => !Number.isNaN(parseFloat(val))),
  book_cover_url: z.string(),
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
  enabled: z.boolean().optional().default(true),
  pdf_url: z.string(),
});

export const updateBookSchema = submitBookSchema.partial();

export const recommendBooksSchema = z.object({
  books: z.array(z.number()),
});

export const featureSchema = z.object({
  book_id: z.number(),
  synopsis: z.string(),
  images: z.array(z.string().url()).max(3).min(0).optional().default([]),
  enabled: z.boolean().optional().default(true),
});
