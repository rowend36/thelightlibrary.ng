import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmpassword: z.string().min(6),
    username: z.string().min(6),
    redirecturl: z.string().optional().default("/admin"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
