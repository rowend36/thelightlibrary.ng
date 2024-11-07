import { ModelRepository } from "../utils/model_repository";

export const bookRepository = new ModelRepository("books", "book_id", [
  "book_id",
  "price",
  "title",
  "book_cover_url",
  "description",
  "created_at",
  "updated_at",
  "enabled",
  "published_date",
]).hasMany({
  table: "authors",
  through: "book_authors",
  pk: "author_id",
  columns: ["author_id", "name"],
});
