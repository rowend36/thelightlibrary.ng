import { Author } from "@/data/models/author";
import { Book } from "@/data/models/book";
import { Category } from "@/data/models/category";
import { Review } from "@/data/models/review";
import { User } from "@/data/models/user";
import knex from "knex";
import { type } from "os";
export const db = knex({
  client: "pg",
  connection: {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
  pool: {
    min: 0,
    max: 1,
  },
});

type metadata = {
  authors: Author;
  categories: Category;
  books: Book;
  book_authors: {
    book_id: number;
    author_id: number;
  };
  book_categories: {
    book_id: number;
    category_id: number;
  };
  users: User;
  reviews: Review;
};

export function Type<T>(e: T) {
  return e;
}
export type Table = keyof metadata;
export type Column<T extends Table = Table> = {
  [key in T]: Exclude<keyof metadata[key], symbol>;
}[T];
export type JoinColumn<T extends Table = Table> =
  | Column<T>
  | {
      [key in T]: `${key}.${Exclude<keyof metadata[key], symbol>}`;
    }[T];

// Attempts to write a more complex version failed
export type PropNotation<T> = `${keyof T & string}${"[]" | "."}${any}`;
export type Values<T> = {
  [key in Table]: metadata[key] extends T ? key : never;
}[Table];
export type Selection<T extends metadata[Table] = any> =
  | JoinColumn<Values<T>>
  | `${JoinColumn} as ${PropNotation<T>}`;
export type JoinPredicate = `${JoinColumn} = ${JoinColumn}`;
