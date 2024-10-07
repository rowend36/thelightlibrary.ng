import { Archive, DocumentDownload, Save2, SaveAdd } from "iconsax-react";
import { Book } from "../../data/models/book";
import { formatNaira } from "../../utils/formatNumber";
import { ButtonBase } from "../base/ButtonBase";
import Link from "../base/Link";
import { baseURL } from "../../data/actions/queryFn";

export default function CartItem({
  book,
  showDownloadLink = false,
}: {
  book: Book;
  showDownloadLink?: boolean;
}) {
  return (
    <>
      <div className="flex items-center">
        <img
          className="h-32 sm:h-48 w-auto aspect-[3/4] object-cover rounded-lg shadow-lg block bg-gradient-radial from-gray-300 to-gray-200"
          src={book.book_cover_url}
          width={320}
          height={480}
          alt="book"
        />

        <div className="pb-8 px-2 pt-4 py-2 flex flex-col flex-grow items-start justify-end w-full p-2 md:pl-4 basis-24">
          <h3 className="font-bold text-gray-800  text-xl h-12 overflow-hidden overflow-clip line-clamp-2">
            {book.title}
          </h3>
          <div className="">
            <p className="text-sm text-darkGray">
              <span className="text-darkGrayishBlue text-[10px] mr-1">By</span>{" "}
              {book.authors?.map((e) => e.name).join(",") || "N/A"}
            </p>
            <p className="text-sm text-darkGray">
              <span className="text-darkGrayishBlue text-[10px] mr-1">
                Published
              </span>{" "}
              {book.created_at?.getFullYear() || "N/A"}
            </p>
            <p className="sm:hidden mt-2 flex flex-col justify-center text-lg ">
              {formatNaira(book.price ?? 0)}
            </p>
          </div>
        </div>
        <p className="max-sm:hidden mt-2 flex flex-col justify-center text-lg ">
          {formatNaira(book.price ?? 0)}
        </p>
        {showDownloadLink ? (
          <ButtonBase className="max-sm:hidden">
            <DocumentDownload />
          </ButtonBase>
        ) : null}
      </div>
      {showDownloadLink ? (
        <ButtonBase
          className="sm:hidden w-full text-center block"
          as="a"
          href={baseURL + "/books/" + book.book_id + "/download/"}
          target="_blank"
        >
          Download
          <i className="inline-block align-middle ml-2 bx bx-download bx-sm -mt-0.5" />
        </ButtonBase>
      ) : null}
    </>
  );
}
