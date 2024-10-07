import { Book } from "../models/book";
import { Purchase } from "../models/purchase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response = any;

export function mapResponseToBook(e: Response) {
  return {
    ...e,
    created_at: new Date(e.created_at),
    price: e.price == undefined ? undefined : parseFloat(e.price),
  } as Book;
}

export function mapResponseToBooks(e: Response) {
  return e.map(mapResponseToBook) as Book[];
}

export function mapResponseToCart(e: Response) {
  return { ...e, books: e.books.map(mapResponseToBook) as Book[] };
}

export function mapResponseToPuchase(e: Response) {
  return {
    ...e,
    purchase_price: parseFloat(e.purchase_price),
    cart: mapResponseToCart(e.cart),
  } as Purchase;
}
