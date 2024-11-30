import {
  getDatabase,
  JoinColumn,
  Selection,
  Table,
  Type,
} from "../config/database";
import { Author } from "../data/models/author";
import { Book } from "../data/models/book";
import { Featured } from "../data/models/featured";
import { User } from "../data/models/user";
import { encrypt } from "../utils/encryption";
import { createRelations } from "../utils/relation_utils";
import reshape from "../utils/reshape";
import { search } from "../utils/search";
import { bookRepository } from "./book_repository";
import { cartRepository } from "./cart_service";
import { purchaseRepository } from "./purchase_service";
import { reviewRepository } from "./review_service";

function selectBooks() {
  return bookRepository.select().orderBy("books.book_id", "desc");
}
export async function getBooks(limit: number = 100, offset: number = 0) {
  return reshape(
    await selectBooks().where("enabled", true).limit(limit).offset(offset)
  ).map(prefixBucket) as Book[];
}

export async function getBookDownloadLink(
  book_id: number,
  user: User | null,
  lifetimeMs = 24 * 60 * 60 * 1000
) {
  const book = await getBookById(book_id, true);
  if (!book) {
    return null;
  }
  const token = await encrypt(
    JSON.stringify({
      user_id: user!.user_id,
      issueTimeMs: Date.now(),
      lifetimeMs,
      url: book.pdf_url,
    })
  );
  return token + "/" + encodeURIComponent(book.title);
}

export async function getBookById(
  book_id: number,
  withPdfURL = false
): Promise<Book> {
  return reshape(
    await (withPdfURL ? selectBooks().select("pdf_url") : selectBooks())
      .where("books.book_id", book_id)
      .limit(1)
  ).map(prefixBucket)[0] as Book;
}

function selectFeatured() {
  return selectBooks()
    .innerJoin(
      Type<Table>("featured"),
      Type<JoinColumn>("featured.book_id"),
      Type<JoinColumn>("books.book_id")
    )
    .select(
      Type<Selection[]>([
        "featured.synopsis",
        "feature_image1 as images[a]",
        "feature_image2 as images[b]",
        "feature_image3 as images[c]",
      ])
    );
}

export async function getFeatured(limit: number = 100, offset: number = 0) {
  return reshape(
    await selectFeatured()
      .where("featured.enabled", true)
      .limit(limit)
      .offset(offset)
  ).map(prefixBucket);
}

export async function getFeaturedAdmin(
  limit: number = 100,
  offset: number = 0
) {
  return reshape(
    await selectFeatured()
      .select("featured.enabled")
      .limit(limit)
      .offset(offset)
  ).map(prefixBucket);
}
export async function feature(
  book_id: number,
  synopsis: string,
  images: string[],
  enabled = false
) {
  const db = getDatabase();
  await db<Featured>(Type<Table>("featured"))
    .insert({
      book_id,
      synopsis,
      feature_image1: images[0],
      feature_image2: images[1],
      feature_image3: images[3],
      updated_at: new Date(),
      enabled: enabled,
    })
    .onConflict("book_id")
    .merge([
      "synopsis",
      "feature_image1",
      "feature_image2",
      "feature_image3",
      "updated_at",
      "enabled",
    ]);
}
export async function unfeature(book_id: number) {
  const db = getDatabase();
  await db<Featured>(Type<Table>("featured"))
    .where("book_id", book_id)
    .delete();
}

export async function getBooksAdmin(limit: number = 100, offset: number = 0) {
  return reshape(
    await selectBooks()
      .select("pdf_url")
      .select("enabled")
      .limit(limit)
      .offset(offset)
  ).map(prefixBucket);
}
export function getAllBookFiles() {
  return [
    selectBooks()
      .clearSelect()
      .select("pdf_url", "book_cover_url", "books.updated_at"),
    selectFeatured()
      .clearSelect()
      .select(
        "feature_image1",
        "feature_image2",
        "feature_image3",
        "featured.updated_at"
      ),
  ];
}
export async function deleteBook(book_id: number) {
  try {
    const db = getDatabase();
    return db.transaction(async (trx) => {
      const purchases = (
        await purchaseRepository
          .select(trx)
          .clearSelect()
          .select("purchase.status")
          .where("books.book_id", book_id)
          .where((trx) => {
            trx
              .where("purchase.status", "success")
              .orWhere("purchase.status", "pending")
              .andWhere(
                "purchase.created_at",
                ">=",
                new Date(Date.now() - 24 * 7 * 60 * 60 * 1000)
              );
          })
          .count()
          .groupBy(["purchase.status"])
      ).reduce((a, e) => {
        a[e.status] = parseInt(e.count);
        return a;
      }, {});

      if (purchases.success > 0 || purchases.pending > 0) {
        throw new Error(
          "Cannot delete book that has been checked out. Disable instead?"
        );
      } else {
        await purchaseRepository
          .select(trx)
          .where("books.book_id", book_id)
          .delete();
        await cartRepository
          .select(trx)
          .where("books.book_id", book_id)
          .delete();
        await reviewRepository
          .select(trx)
          .where("books.book_id", book_id)
          .delete();
        await trx<Featured>(Type<Table>("featured"))
          .where("book_id", book_id)
          .delete();
        await bookRepository
          .select(trx)
          .where("books.book_id", book_id)
          .delete();
      }
    });
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.log((e as any).constructor);
  }
}

export async function searchBooks(
  query: string,
  limit: number = 100,
  offset: number = 0
) {
  return (
    await search<Book>(query, "books.tsv", selectBooks(), offset, limit)
  ).map(prefixBucket);
}

const prefixBucket = (e: Partial<Book>) => {
  return e;
};

export async function addBook({
  authors,
  ...book
}: Omit<Book, "book_id" | "is_presale" | "enabled" | "recommended"> & {
  authors: Author[];
}) {
  const db = getDatabase();
  return db.transaction(async (trx) => {
    const book_id = (
      await trx<Book>(Type<Table>("books"))
        .insert({ enabled: true, ...book })
        .returning("book_id")
    )[0].book_id;
    await createRelations({
      from: "books",
      item_id: book_id,
      to: "authors",
      trx,
      tags: authors,
    });
    return book_id;
  });
}

export async function updateBook(
  book_id: number,
  {
    authors,
    ...book
  }: Partial<
    Omit<Book, "book_id" | "is_presale" | "enabled" | "recommended">
  > & {
    authors?: Author[];
  }
) {
  const db = getDatabase();
  return db.transaction(async (trx) => {
    await trx<Book>(Type<Table>("books"))
      .where("book_id", book_id)
      .update({ enabled: true, ...book, updated_at: new Date() })
      .returning("book_id");
    if (authors) {
      await createRelations({
        from: "books",
        item_id: book_id,
        to: "authors",
        trx,
        tags: authors,
        update: true,
      });
    }
    return book_id;
  });
}

export async function setRecommended({ books = [] }: { books: number[] }) {
  const db = getDatabase();
  return db.transaction(async (trx) => {
    if (books.length > 0) {
      await trx<Book>(Type<Table>("books"))
        .update({ recommended: true, updated_at: new Date() })
        .whereIn("book_id", books);

      await trx<Book>(Type<Table>("books"))
        .update({ recommended: false, updated_at: new Date() })
        .whereNotIn("book_id", books)
        .where("recommended", true);
    } else {
      await trx<Book>(Type<Table>("books")).update({
        recommended: false,
        updated_at: new Date(),
      });
    }
  });
}

export async function getRecommended() {
  return reshape(await selectBooks().where("recommended", true)).map(
    prefixBucket
  );
}

export async function getBookCount() {
  const db = getDatabase();
  return (await db<Book>(Type<Table>("books")).count())[0].count as number;
}
