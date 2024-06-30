import { Book } from "@/data/models/book";
import { db } from "@/config/database";

export async function getBooks(limit: number = 100, offset: number = 0) {
  return await db<Book>("books")
    .select(["title", "description", "created_at"])
    .limit(limit)
    .offset(offset);
}
