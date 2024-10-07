import { Book } from "../models/book";
import { mapResponseToCart } from "./mappers";
import { fetcher } from "./queryFn";

export async function syncCartToServer(books: Book[]) {
  return fetcher("cart", {
    data: { cart: books.map((e) => e.book_id) },
  });
}

export async function syncCartFromServer() {
  return (await fetcher("cart")).map(mapResponseToCart);
}
