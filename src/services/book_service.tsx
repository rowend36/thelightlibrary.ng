import { Book } from "@/data/models/book";
import { db, JoinColumn, Selection, Table, Type } from "@/config/database";
import reshape from "@/utils/reshape";
import { Author } from "@/data/models/author";
import { uploadAndGetUrl } from "@/config/storage";
import { Knex } from "knex";

export async function getBooks(limit: number = 100, offset: number = 0) {
  return reshape(
    await db<Book>(Type<Table>("books"))
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
          "title",
          "pdf_url",
          "description",
          "books.created_at",
          "authors.name as authors[].name",
          "authors.author_id as authors[].id",
        ])
      )
      .limit(limit)
      .offset(offset)
  ).map(prefixBucket);
}

async function search<T>(
  query: string,
  tsvector: string,
  select: ReturnType<Knex<T>["select"]>,
  offset: number,
  limit: number,
  searchSpace = 100
) {
  const preprocessed =
    "(" +
    query
      .replace(/[^-_'\w ]/g, "")
      .split(" ")
      .filter(Boolean)
      .map((e) => e + ":*")
      .join(")|(") +
    ")";
  let result: T[] = [];
  // const tables = (tsvector.match(/\b\w+(?=\.)/g) ?? [])
  //   .sort()
  //   .filter((e, i, a) => e !== a[i - 1])
  //   .reduce((acc, e) => ((acc[e] = e), acc), {} as Record<string, string>);
  let subquery = select
    .select(
      db.raw(
        `ts_rank(${tsvector}, to_tsquery(?)) AS rank`,

        [preprocessed]
      )
    )
    .whereRaw(`${tsvector} @@ to_tsquery(?)`, [preprocessed]);
  while (searchSpace <= 400) {
    let mainQuery: any;
    if (searchSpace < 400) {
      subquery = subquery.limit(searchSpace);
      mainQuery = db
        .select("*")
        .from(subquery)
        .orderBy("rank", "desc")
        .offset(offset)
        .limit(limit);
    } else {
      // From tests, the query planner is actually smart enough to figure this out.
      mainQuery = subquery.orderBy("rank", "desc").offset(offset).limit(limit);
    }

    result = await mainQuery;
    if (result.length >= limit) {
      return reshape<any, T>(result);
    }
    searchSpace *= 2;
  }

  return result;
}

export async function deleteBook(book_id: number) {
  return db<Book>(Type<Table>("books")).where("book_id", book_id).delete();
}

export async function searchBooks(
  query: string,
  limit: number = 100,
  offset: number = 0,
  laxLevel = 1
) {
  return (
    await search<Book>(
      query,
      "books.tsv",
      db<Book>(Type<Table>("books"))
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
          Type<Selection<Book>[]>([
            "books.book_id",
            "title",
            "pdf_url",
            "description",
            "books.created_at",
            "authors.name as authors[].name",
            "authors.author_id as authors[].id",
          ])
        ),
      offset,
      limit
    )
  ).map(prefixBucket);
}

const prefixBucket = (e: Book) => {
  if (e.pdf_url)
    e.pdf_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${e.pdf_url}`;
  return e;
};

export async function searchAuthors(
  query: string,
  limit: number = 100,
  offset: number = 0,
  laxLevel = 1
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
  pdf,
  ...book
}: Partial<Book> & { authors: Author[]; pdf: File }) {
  return db.transaction(async (trx) => {
    console.log("Uploading pdf....");
    const pdf_url = await uploadAndGetUrl(pdf);
    console.log("Uploading book....");
    const book_id = (
      await trx<Book>(Type<Table>("books"))
        .insert({ ...book, pdf_url })
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
            let { author_id, ...x } = e;
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

export async function getBookCount() {
  return (await db<Book>(Type<Table>("books")).count())[0].count as number;
}
