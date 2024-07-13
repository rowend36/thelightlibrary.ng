import { Book } from "@/data/models/book";
import { db, JoinColumn, Selection, Table, Type } from "@/config/database";
import reshape from "@/utils/reshape";
import { Author } from "@/data/models/author";
import { uploadAndGetUrl } from "@/config/storage";

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
          "description",
          "books.created_at",
          "authors.name as authors[].name",
          "authors.author_id as authors[].id",
        ])
      )
      .limit(limit)
      .offset(offset)
  );
}
async function search<T>(
  query: string,
  limit: number,
  laxLevel = 1,
  cb: (query: string) => Promise<T[]>
) {
  const words = query
    .replace(/[^-_'\w ]/g, "")
    .split(" ")
    .filter(Boolean);

  while (laxLevel <= words.length) {
    const opts = [];
    for (let i = 0; i < laxLevel; i++) {
      const split_words = [];
      for (let j = 0; j < words.length - laxLevel + 1; j++) {
        split_words.push(words[i + j] + ":*");
      }
      opts.push(split_words.join("<->"));
    }

    const result = await cb("(" + opts.join(")|(") + ")");

    if (result.length >= limit) {
      return result;
    }
    if (laxLevel === words.length) return result;
    laxLevel = Math.min(words.length, Math.max(laxLevel * 2, words.length - 3));
  }
  return [];
}

async function search2<T>(
  query: string,
  tsvector: string,
  select: any,
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

    result = reshape<any, T>(await mainQuery);
    if (result.length >= limit) {
      return result;
    }
    searchSpace *= 2;
  }

  return result;
}

export async function searchBooks(
  query: string,
  limit: number = 100,
  offset: number = 0,
  laxLevel = 1
) {
  return await search2(
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
          "description",
          "books.created_at",
          "authors.name as authors[].name",
          "authors.author_id as authors[].id",
        ])
      ),
    offset,
    limit
  );
}

export async function searchAuthors(
  query: string,
  limit: number = 100,
  offset: number = 0,
  laxLevel = 1
) {
  return await search(query, limit, laxLevel, async (query) =>
    reshape<any, Author>(
      await db<Author>(Type<Table>("authors"))
        .whereRaw(`authors.tsv @@ to_tsquery(?)`, [query])
        .limit(limit)
        .select(Type<Selection<Author>[]>(["author_id", "name"]))
        .offset(offset)
        .limit(limit)
    )
  );
}

export async function addBook({
  authors,
  pdf,
  ...book
}: Partial<Book> & { authors: Author[]; pdf: File }) {
  return db.transaction(async (trx) => {
    const pdf_url = await uploadAndGetUrl(pdf);
    const book_id = (
      await trx<Book>(Type<Table>("books"))
        .insert({ ...book, pdf_url })
        .returning("book_id")
    )[0].book_id;
    const new_authors = authors.filter(
      (author) => (author.author_id ?? 0) <= 0
    );
    if (authors.length) {
      const mapped_authors = await trx<Author>(Type<Table>("authors"))
        .insert(
          new_authors.map((e) => {
            let { author_id, ...x } = e;
            return x;
          })
        )
        .returning("author_id");
      await trx("book_authors").insert(
        (authors.filter((e) => e.author_id > 0) as typeof mapped_authors)
          .concat(mapped_authors)
          .map((author) => ({
            book_id,
            author_id: author.author_id,
          }))
      );
    }
    return book_id;
  });
}
