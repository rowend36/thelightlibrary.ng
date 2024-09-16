import { Book } from "../../data/models/book";
import { ButtonBase } from "../base/ButtonBase";

export default function BookItem({ book }: { book: Book }) {
  return (
    <div className="flex items-center bg-white rounded-lg shadow-sm border-gray-100 hover:border-primaryLight active:border-primary border pr-2 h-24">
      <img
        className="min-h-20 self-stretch w-auto aspect-[3/4] object-cover rounded-t-lg"
        src="https://th.bing.com/th?id=OIP.y0dUr_AsBWaFQF8FpNrqZgHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
        width={320}
        height={480}
        alt="book"
      />
      <div className="py-2 flex flex-grow flex-col items-start justify-center w-full p-2 basis-24">
        <h3 className="font-bold text-darkBlue h-12 overflow-hidden overflow-clip line-clamp-2">
          {book.title}
        </h3>
        <div className="flex justify-between w-full">
          <div>
            <p className="text-xs text-darkGray">
              <span className="text-darkGrayishBlue text-[10px] mr-1">By</span>{" "}
              {book.authors?.map((e) => e.name).join(",") || "N/A"}
            </p>
            <p className="text-xs text-darkGray">
              <span className="text-darkGrayishBlue text-[10px] mr-1">
                Published
              </span>{" "}
              {book.created_at?.getFullYear() || "N/A"}
            </p>
          </div>
          {book.pdf_url ? (
            /* @ts-expect-error Hello */
            <ButtonBase size="small" as="a" href={book.pdf_url} target="_blank">
              Download
            </ButtonBase>
          ) : (
            <i>No longer available</i>
          )}
        </div>
      </div>
    </div>
  );
}
