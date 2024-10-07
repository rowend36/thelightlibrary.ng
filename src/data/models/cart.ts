import { Book } from "./book";

export class Cart {
  cart_id?: number;
  books: Book[] = [];
  checked_out?: boolean;
}
