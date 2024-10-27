import { z } from "zod";

export const addToCartSchema = z.object({
  cart: z.array(z.number()),
});

export const checkoutSchema = z.object({
  anonymous: z.boolean().optional(),
  cart: z.array(z.number()),
});

export const paySchema = z.object({
  email: z.string().email(),
});
