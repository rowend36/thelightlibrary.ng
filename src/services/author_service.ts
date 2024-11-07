import { ModelRepository } from "../utils/model_repository";
import { search } from "../utils/search";

export const authorRepository = new ModelRepository("authors", "author_id", [
  "author_id",
  "name",
]);

export async function searchAuthors(
  query: string,
  limit: number = 100,
  offset: number = 0
) {
  return await search(
    query,
    "authors.tsv",
    authorRepository.select(),
    offset,
    limit
  );
}
