import { ReactNode } from "react";
import { Book } from "../../data/models/book";

import BookItem from "./BookItem";

export default function BookList({
  books,
  title,
}: {
  books: Book[] | undefined;
  title: ReactNode;
}) {
  return (
    <div className="container pt-12 pb-8 bg-gray-50">
      <h3 className="text-2xl font-bold text-darkBlue pb-4">{title}</h3>
      {!books ? (
        <div className="text-lg text-center my-16">
          <div className="mx-auto mb-4 border-4 border-b-transparent border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
          <span className="text-sm text-gray-700">
            Loading. Please wait ...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 ">
          {books.length === 0 ? (
            <div className="text-lg">No results found</div>
          ) : (
            books.map((book) => <BookItem key={book.book_id} book={book} />)
          )}
        </div>
      )}
    </div>
  );
}
