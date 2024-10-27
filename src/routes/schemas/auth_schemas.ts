import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  redirecturl: z.string().optional().default("/admin"),
});

export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmpassword: z.string().min(6),
    username: z
      .string()
      .min(4)
      .transform((e) => e.toLocaleLowerCase()),
    redirecturl: z.string().optional().default("/admin"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
