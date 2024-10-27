import { Author } from "../data/models/author";
import { Book } from "../data/models/book";
import { Cart } from "../data/models/cart";
import { Category } from "../data/models/category";
import { Purchase } from "../data/models/purchase";
import { Review } from "../data/models/review";
import { User } from "../data/models/user";
import { Recommendation } from "../data/models/recommend";
import knex from "knex";
import { Featured } from "../data/models/featured";

export const db = knex({
  client: "pg",
  connection: {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: process.env.PGCA
      ? {
          ca: process.env.PGCA,
        }
      : Boolean(process.env.PGSECURE),
  },
  pool: {
    min: 0,
    max: 1,
  },
});

async function cleanup(e: any) {
  console.log("Received " + e + ". Cleaning up...");
  await db.destroy();
  console.log("Cleanup complete.");
  process.exit(0);
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

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
  carts: Cart;
  purchase: Purchase;
  cart_book: {
    book_id: number;
    cart_id: number;
    book_price: number;
  };
  featured: Featured;
  recommended: Recommendation;
  users: User;
  reviews: Review;
};
// Utility function for type inference
export function Type<T>(e: T) {
  return e;
}

// Represents table names (keys of 'metadata')
export type Table = keyof metadata;

// Represents columns for a given table
export type Column<T extends Table = Table> = {
  [key in T]: Exclude<keyof metadata[key], symbol>;
}[T];

// Join columns in 'Table.Column' format or just 'Column'
export type JoinColumn<T extends Table = Table> =
  | Column<T>
  | {
      [key in T]: `${key}.${Exclude<keyof metadata[key], symbol>}`;
    }[T];

// Property access notation like 'prop[]' or 'prop.subProp'
type PropNotation<T> =
  `${keyof T & string}${`[${"a" | "b" | "c"}]` | "[]" | "."}${string}`;

// Filters tables whose metadata matches type 'T'
type Values<T> = {
  [key in Table]: metadata[key] extends T ? key : never;
}[Table];

// Column selection with optional aliasing, like 'column as alias'
export type Selection<T extends metadata[Table] = any> =
  | JoinColumn<Values<T>>
  | `${JoinColumn} as ${PropNotation<T>}`;

// SQL join condition like 'table1.column = table2.column'
export type JoinPredicate = `${JoinColumn} = ${JoinColumn}`;
