import { z } from "zod";
import { slugify } from "../../utils/slugify";

export const tagSchema = z
  .object({
    name: z.string(),
    tag_id: z.number().optional().default(-1),
    slug: z.string().optional(),
  })
  .transform((e) => {
    e.slug = slugify(e.slug ?? e.name);
    return e as typeof e & Required<Pick<typeof e, "slug">>;
  });

export const postSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  content: z.string(),
  status: z.enum(["draft", "published"]).optional().default("draft"),
  tags: z.array(tagSchema).optional(),
  post_id: z.number(),
});
export const createPostSchema = postSchema
  .omit({ post_id: true })
  .transform((e) => {
    e.slug = slugify(e.slug ?? e.title);
    return e as typeof e & Required<Pick<typeof e, "slug">>;
  });

export const updatePostSchema = postSchema.partial().omit({ post_id: true });
