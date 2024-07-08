import { Book } from "@/data/models/book";
import Image from "next/image";

export default function BookItem({ book }: { book: Book }) {
  return (
    <div className="flex sm:flex-col items-center bg-white rounded-lg shadow-lg p-4">
      <Image
        className="sm:w-full aspect-[3/4] w-1/2 object-cover rounded-t-lg"
        src="https://th.bing.com/th?id=OIP.y0dUr_AsBWaFQF8FpNrqZgHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
        width={320}
        height={480}
        alt="book"
      />
      <div className="flex flex-grow flex-col items-center justify-center w-full p-2 basis-24">
        <h3 className="font-bold text-darkBlue h-12 overflow-hidden overflow-clip line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-center text-darkGray">{book.author?.name}</p>
        <p className="text-sm text-center text-darkGray">
          {book.created_at.getFullYear()}
        </p>
      </div>
    </div>
  );
}
