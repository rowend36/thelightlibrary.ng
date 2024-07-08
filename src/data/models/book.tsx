import { Author } from "./author";

export class Book {
  book_id!: number;
  title!: string;
  description!: string;
  content!: string;
  pdf_url!: string;
  published_date!: Date;
  created_at!: Date;
  updated_at!: Date;
  authors?: Author[];
}
