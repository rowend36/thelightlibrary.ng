import { z } from "zod";

export const searchAuthorSchema = z.object({
  author_name: z.string(),
});
