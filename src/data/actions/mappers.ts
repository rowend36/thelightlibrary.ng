import { Book } from "../models/book";
import { Post } from "../models/post";
import { Purchase } from "../models/purchase";
import { Review } from "../models/review";
import { SiteInfo } from "../models/site";
import { SiteReview } from "../models/site_review";
import { User } from "../models/user";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response = any;

export function mapResponseToBook(e: Response) {
  return {
    ...e,
    created_at: new Date(e.created_at),
    updated_at: new Date(e.updated_at),
    published_date: new Date(e.published_date),
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

export function mapResponseToBlog(e: Response) {
  return {
    ...e,
    created_at: new Date(e.created_at),
    updated_at: new Date(e.updated_at),
    published_at: new Date(e.published_at),
  } as Post;
}

export function mapResponseToBlogList(e: Response) {
  return e.posts.map(mapResponseToBlog);
}

export function mapResponseToSiteInfo(e: Response) {
  return e as SiteInfo;
}

export function mapResponseToUser(e: Response) {
  return (e.data ?? e) as User;
}

export function mapResponseToReview(e: Response) {
  return { ...e, created_at: new Date(e.created_at) } as Review;
}

export function mapResponseToUsers(e: Response) {
  return e.data.map(mapResponseToUser);
}

export function mapResponseToReviewList(e: Response) {
  return e.map(mapResponseToReview);
}

export function mapResponseToSiteReview(e: Response) {
  return { ...e, created_at: new Date(e.created_at) } as SiteReview;
}

export function mapResponseToSiteReviews(e: Response) {
  return e.map(mapResponseToSiteReview);
}

export function mapResponseToPurchases(e: Response) {
  return e.purchases.map(mapResponseToUser);
}
