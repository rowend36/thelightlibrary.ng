import { Book } from "@/data/models/book";
import { db, JoinColumn, Selection, Table, Type } from "@/config/database";
import reshape from "@/utils/reshape";

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
        split_words.push(words[i + j]);
      }
      opts.push(split_words.join("+"));
    }
    const result = await cb(opts.join("|"));

    if (result.length >= limit) {
      return result;
    }
    if (laxLevel === words.length) return result;
    laxLevel = Math.min(words.length, Math.max(laxLevel * 2, words.length - 3));
  }
  return [];
}
export async function searchBooks(
  query: string,
  limit: number = 100,
  offset: number = 0,
  laxLevel = 1
) {
  return await search(query, limit, laxLevel, async (query) =>
    reshape<any, Book>(
      await db<Book>(Type<Table>("books"))
        .whereRaw(`books.tsv @@ to_tsquery(?)`, [query])
        .limit(limit)
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
            "title",
            "description",
            "books.created_at",
            "authors.name as authors[].name",
            "authors.author_id as authors[].id",
          ])
        )
        .offset(offset)
        .limit(limit)
    )
  );
}
