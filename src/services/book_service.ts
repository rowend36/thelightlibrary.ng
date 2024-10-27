import { Book } from "../data/models/book";
import { db, JoinColumn, Selection, Table, Type } from "../config/database";
import reshape from "../utils/reshape";
import { Author } from "../data/models/author";
import { search } from "../utils/search";
import { type Knex } from "knex";
import { Featured } from "../data/models/featured";
import { encrypt } from "../utils/encryption";
import { User } from "../data/models/user";

function selectBooks() {
  return db<Book>(Type<Table>("books"))
    .leftJoin(
      Type<Table>("book_authors"),
      Type<JoinColumn>("books.book_id"),
      Type<JoinColumn>("book_authors.book_id")
    )
    .leftJoin(
      Type<Table>("authors"),
      Type<JoinColumn>("book_authors.author_id"),
      Type<JoinColumn>("authors.author_id")
    )
    .select(
      Type<Selection[]>([
        "books.book_id",
        "price",
        "title",
        "book_cover_url",
        "description",
        "books.created_at",
        "authors.author_id as authors[].id",
        "authors.name as authors[].name",
      ])
    ) as Knex.QueryBuilder<Book, Book[]>;
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
  await db<Featured>(Type<Table>("featured"))
    .insert({
      book_id,
      synopsis,
      feature_image1: images[0],
      feature_image2: images[1],
      feature_image3: images[3],
      enabled: enabled,
    })
    .onConflict("book_id")
    .merge([
      "synopsis",
      "feature_image1",
      "feature_image2",
      "feature_image3",
      "enabled",
    ]);
}
export async function unfeature(book_id: number) {
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

export async function deleteBook(book_id: number) {
  return db<Book>(Type<Table>("books")).where("book_id", book_id).delete();
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
  // if (e.pdf_url)
  //   e.pdf_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${e.pdf_url}`;
  return e;
};

export async function searchAuthors(
  query: string,
  limit: number = 100,
  offset: number = 0
) {
  return await search(
    query,
    "authors.tsv",
    db<Author>(Type<Table>("authors")).select(
      Type<Selection<Author>[]>(["author_id", "name"])
    ),
    offset,
    limit
  );
}

export async function addBook({
  authors,
  ...book
}: Omit<Book, "book_id" | "is_presale" | "enabled" | "recommended"> & {
  authors: Author[];
}) {
  return db.transaction(async (trx) => {
    const book_id = (
      await trx<Book>(Type<Table>("books"))
        .insert({ enabled: true, ...book })
        .returning("book_id")
    )[0].book_id;
    const new_authors = authors.filter(
      (author) => (author.author_id ?? 0) <= 0
    );
    let mapped_authors: Author[] = [];
    if (new_authors.length) {
      console.log("Uploading authors....");
      mapped_authors = await trx<Author>(Type<Table>("authors"))
        .insert(
          new_authors.map((e) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { author_id: _, ...x } = e;
            return x;
          })
        )
        .returning("author_id");
    }
    console.log("Updating book authors....");
    await trx("book_authors").insert(
      authors
        .filter((e) => e.author_id > 0)
        .concat(mapped_authors)
        .map((author) => ({
          book_id,
          author_id: author.author_id,
        }))
    );

    return book_id;
  });
}

export async function setRecommended({ books = [] }: { books: number[] }) {
  return db.transaction(async (trx) => {
    if (books.length > 0) {
      await trx<Book>(Type<Table>("books"))
        .update({ recommended: true, updated_at: new Date() })
        .whereIn("book_id", books);
    }

    await trx<Book>(Type<Table>("books"))
      .update({ recommended: false, updated_at: new Date() })
      .whereNotIn("book_id", books)
      .where("recommended", true);
  });
}

export async function getRecommended() {
  return reshape(await selectBooks().where("recommended", true)).map(
    prefixBucket
  );
}

export async function getBookCount() {
  return (await db<Book>(Type<Table>("books")).count())[0].count as number;
}
