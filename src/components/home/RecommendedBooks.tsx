import { useQuery } from "@tanstack/react-query";
import { mapResponseToBooks } from "../../data/actions/mappers";
import { queryFn } from "../../data/actions/queryFn";
import BookList from "../books/BookList";

export default function RecommendedBooks() {
  const {
    data: books,
    // error,
    // isLoading,
  } = useQuery({
    queryKey: ["books", "/recommended"],
    select: mapResponseToBooks,
    queryFn,
  });

  return <BookList title="Recommended Books of Today" books={books} />;
}
