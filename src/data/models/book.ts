import { Author } from "./author";
export type Decimal = number;
export class Book {
  book_id!: number;
  title!: string;
  description!: string;
  content?: string;
  book_cover_url!: string;
  pdf_url!: string;
  enabled!: boolean;
  published_date!: Date;
  created_at?: Date;
  updated_at?: Date;
  price?: Decimal;
  authors?: Omit<Author, "biography" | "created_at">[];
  recommended!: boolean;
  is_presale!: boolean;

  // Featured Books
  synopsis?: string;
  images?: string[];
}
