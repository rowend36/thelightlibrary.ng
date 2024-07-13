"use server";

import { searchAuthors } from "@/services/book_service";
import { searchAuthorSchema } from "./schemas/searchAuthorSchema";

export async function searchAuthorsAction(query: string) {
  const data = searchAuthorSchema.parse({
    author_name: query,
  });
  return await searchAuthors(data.author_name);
}
