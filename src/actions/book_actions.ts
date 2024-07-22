"use server";

import { deleteBook, getBooks } from "@/services/book_service";

export const fetchBooks = async (page: number) => {
  return await getBooks(50, page * 50);
};

export const deleteBookAction = async (book_id: number) => {
  return await deleteBook(book_id);
};
