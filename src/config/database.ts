import knex, { Knex } from "knex";
import { Author } from "../data/models/author";
import { Book } from "../data/models/book";
import { Cart } from "../data/models/cart";
import { Featured } from "../data/models/featured";
import { Post } from "../data/models/post";
import { Purchase } from "../data/models/purchase";
import { Review } from "../data/models/review";
import { SiteInfo } from "../data/models/site";
import { SiteReview } from "../data/models/site_review";
import { Tag } from "../data/models/tag";
import { User } from "../data/models/user";

let _database: Knex<any, unknown[]> | null = null;
export const getDatabase = () =>
  _database ||
  (_database = knex({
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
  }));

export const destroyDatabase = async () => {
  try {
    await _database?.destroy();
  } catch (e) {
    console.error(e);
  }
  _database = null;
};

async function cleanup(e: string) {
  console.log("Received " + e + ". Cleaning up...");

  await destroyDatabase();
  console.log("Cleanup complete.");
  process.exit(0);
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

type metadata = {
  authors: Author;
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
  site_info: SiteInfo;
  posts: Post;
  comments: Comment;
  tags: Tag;
  post_tags: {
    post_id: number;
    tag_id: number;
  };
  site_reviews: SiteReview;
  featured: Featured;
  users: User;
  reviews: Review;
};
// Utility function for type inference
export function Type<T>(e: T) {
  return e;
}

// Represents table names (keys of 'metadata')
export type Table = keyof metadata;
export type TableType<T extends Table> = metadata[T];

// Represents columns for a given table
export type Column<T extends Table = Table> = {
  [key in T]: Exclude<keyof metadata[key], symbol | number>;
}[T];

// Join columns in 'Table.Column' format or just 'Column'
export type JoinColumn<T extends Table = Table> =
  | Column<T>
  | {
      [key in T]: `${key}.${Exclude<keyof metadata[key], symbol>}`;
    }[T];

// Property access notation like 'prop[]' or 'prop.subProp'
type PropNotation<T> = `${keyof T & string}${
  | `[${"a" | "b" | "c"}]`
  | "[]"
  | "."}${string}`;

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
