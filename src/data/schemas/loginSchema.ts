import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  redirecturl: z.string().optional().default("/admin"),
});
