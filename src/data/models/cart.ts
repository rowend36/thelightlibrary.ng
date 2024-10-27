import { Book } from "./book";

export class Cart {
  cart_id!: number;
  user_id!: number | null;
  checked_out?: boolean;
  created_at!: number;
  books?: Book[];
}
