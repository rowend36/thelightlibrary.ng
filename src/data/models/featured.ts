import { Book } from "./book";

export class Featured {
  book_id!: number;
  synopsis!: string;
  enabled!: boolean;
  feature_image1?: string;
  feature_image2?: string;
  feature_image3?: string;
  images?: string[];
  created_at?: number;
  updated_at?: Date;
  book?: Book;
}
