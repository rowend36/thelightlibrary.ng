import { Book } from "@/data/models/book";
import { getBooks } from "@/services/book_service";
import BookItem from "./BookItem";

export default function BookList({
  books,
  category,
  title,
}: {
  books: Book[];
  category: string;
  title: string;
}) {
  return (
    <div className="container py-8">
      <h3 className="text-2xl font-bold text-darkBlue pb-4">{title}</h3>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {!books ? (
          <div className="text-lg">Loading...</div>
        ) : books.length === 0 ? (
          <div className="text-lg">No results found</div>
        ) : (
          books.map((book) => <BookItem key={book.book_id} book={book} />)
        )}{" "}
      </div>
    </div>
  );
}
