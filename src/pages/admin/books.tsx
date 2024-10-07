import { Select } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { Edit, Trash } from "iconsax-react";
import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import UploadBooksForm from "../../components/admin/books/UploadBooksForm";
import { DashboardProvider } from "../../components/admin/DashboardContext";
import { ButtonBase } from "../../components/base/ButtonBase";
import InputBase from "../../components/base/InputBase";
import Link from "../../components/base/Link";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import { mapResponseToBooks } from "../../data/actions/mappers";
import { authQueryFn, fetcher } from "../../data/actions/queryFn";
import { Book } from "../../data/models/book";
import { formatNaira } from "../../utils/formatNumber";

export default function AdminBooksPage(): JSX.Element {
  const {
    data: books,
    // isLoading,
    refetch,
  } = useQuery({
    queryKey: ["books", "/admin"],
    queryFn: authQueryFn,
    select: mapResponseToBooks,
  });
  const {
    data: recommended,
    // isLoading: isLoadingRecommended,
    refetch: refetchRecommended,
  } = useQuery({
    queryKey: ["books", "/recommended"],
    queryFn: authQueryFn,
    select: mapResponseToBooks,
  });
  const {
    data: featured,
    // isLoading: isLoadingRecommended,
    refetch: refetchFeatured,
  } = useQuery({
    queryKey: ["books", "/featured", "/admin"],
    queryFn: authQueryFn,
    select: mapResponseToBooks,
  });

  const [showAddBookForm, setShowAddBookForm] = useState<boolean>(false);
  const [showFeaturedBookForm, setShowFeaturedBookForm] = // -> Prevent prettier from botching this formatting
    useState<boolean | number>(false);
  return (
    <>
      <DashboardProvider value={books}>
        <ButtonBase
          className="mb-8 block mx-auto"
          onClick={() => setShowAddBookForm(true)}
        >
          Upload New Book
        </ButtonBase>
        <Modal open={showAddBookForm} onClose={() => setShowAddBookForm(false)}>
          <UploadBooksForm
            onSubmit={() => {
              setShowAddBookForm(false);
              refetch();
            }}
            key={showAddBookForm ? 1 : 0}
          />
        </Modal>

        <div className="flex flex-wrap gap-x-4 mb-8 gap-y-4 ">
          <div className="shadow-sm bg-white p-4 rounded-md basis-56 flex-grow">
            <h2 className="font-bold text-gray-600 mb-2">All Books</h2>

            <BooksTable books={books} />
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 mb-8 gap-y-4 ">
          <div className="shadow-sm bg-white p-4 rounded-md basis-56 flex-grow">
            <h2 className="font-bold text-gray-600 mb-2">Recommended Books</h2>
            <ul className="flex flex-wrap">
              {recommended?.map((e) => (
                <li
                  key={e.book_id}
                  className="flex 2xl:w-1/4 xl:w-1/3 lg:w-1/2 w-fulg:even:ll gap-4"
                >
                  <img
                    src={e.book_cover_url}
                    className="rounded-lg h-36 w-24 object-contain bg-gray-200"
                  ></img>
                  <div>
                    <h5 className="mt-2">{e.title}</h5>
                    <p className="text-gray-600 text-sm">{e.description}</p>
                    <p className="text-gray-900 text-sm mt-4">
                      {e.price === undefined ? e.price : formatNaira(e.price)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <RecommendForm
              books={books}
              recommended={recommended}
              onSubmit={async (selected) => {
                await fetcher("books/recommend", {
                  data: {
                    books: recommended?.map((e) => e.book_id).concat(selected),
                  },
                });
                const x = books?.find((e) => e.book_id === selected);
                if (x) recommended?.push(x);
                await refetchRecommended();
              }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 mb-8 gap-y-4 ">
          <div className="shadow-sm bg-white p-4 rounded-md basis-56 flex-grow">
            <h2 className="font-bold text-gray-600 mb-2">Featured Books</h2>
            <ul className="flex flex-wrap gap-2">
              {!featured?.length ? (
                <div className="py-8 w-full text-center">
                  {featured ? <span>Nothing Here</span> : <Loader />}
                </div>
              ) : (
                featured?.map((book) => (
                  <li
                    key={book.book_id}
                    className="flex pr-4 pb-4 2xl:w-1/5 xl:w-1/4 lg:w-1/3 flex-grow w-full gap-4"
                  >
                    <img
                      src={book.book_cover_url}
                      className="rounded-lg h-36 w-24 object-contain bg-gray-200"
                    ></img>
                    <div className="flex-grow">
                      <h5 className="mt-2">{book.title}</h5>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {book.synopsis}
                      </p>
                      <p className="text-gray-900 text-sm mt-4">
                        {book.price === undefined
                          ? book.price
                          : formatNaira(book.price)}
                      </p>
                      <div className="flex justify-between">
                        <button
                          className=" text-primary hover:bg-primary/10 active:hover:bg-primary/20 mt-4 p-2 rounded-md text-sm"
                          onClick={() => setShowFeaturedBookForm(book.book_id)}
                        >
                          <Edit className="inline mr-2" size={20} />
                          Edit
                        </button>
                        <button
                          className=" text-red-700 hover:bg-red-100 active:bg-red-200  mt-4 p-2 rounded-md text-sm"
                          onClick={async () => {
                            await fetcher("books/featured/" + book.book_id, {
                              method: "DELETE",
                            });
                            await refetchFeatured();
                          }}
                        >
                          <Trash className="inline mr-2" size={20} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
              <li className="flex pr-4 pb-4 2xl:w-1/5 xl:w-1/4 lg:w-1/3 flex-grow w-full gap-4 invisible"></li>
              <li className="flex pr-4 pb-4 2xl:w-1/5 xl:w-1/4 lg:w-1/3 flex-grow w-full gap-4 invisible"></li>
              <li className="flex pr-4 pb-4 2xl:w-1/5 xl:w-1/4 lg:w-1/3 flex-grow w-full gap-4 invisible"></li>
            </ul>
            <ButtonBase
              className="mb-8 block mx-auto"
              onClick={() => setShowFeaturedBookForm(true)}
            >
              Feature a Book
            </ButtonBase>
            <Modal
              title="Feature a Book"
              open={showFeaturedBookForm !== false}
              onClose={() => setShowFeaturedBookForm(false)}
            >
              <FeatureBookForm
                books={books}
                book={
                  typeof showFeaturedBookForm === "boolean"
                    ? null
                    : showFeaturedBookForm
                }
                featured={featured}
                onSubmit={async (selected) => {
                  await fetcher("books/featured", {
                    data: selected,
                  });
                  setShowFeaturedBookForm(false);
                  await refetchFeatured();
                }}
              />
            </Modal>
          </div>
        </div>
      </DashboardProvider>
    </>
  );
}

function FeatureBookForm({
  books,
  book,
  featured,
  onSubmit,
}: {
  books?: Book[] | null;
  book: number | null;
  featured?: Book[] | null;
  onSubmit: (selected: {
    book_id: number;
    synopsis: string;
    images: (string | File)[];
  }) => void;
}) {
  const [selected, setSelected] = useState<Book>();
  const [synopsis, setSynopsis] = useState("");
  const [images, setImages] = useState<(string | File)[]>([]);
  useEffect(() => {
    if (book && featured) {
      const book_info = featured.find((e) => e.book_id === book);
      setSelected(book_info);
      setImages((images) => (images || book_info?.images) ?? []);
      setSynopsis((synopsis) => (synopsis || book_info?.synopsis) ?? "");
    }
  }, [book, featured]);
  const options = useMemo(() => {
    return (
      books &&
      featured &&
      (book
        ? [books.find((e) => book === e.book_id)]
        : books.filter((e) => !featured.some((f) => e.book_id === f.book_id)))
    );
  }, [books, featured, book]);
  useEffect(() => {
    setSelected(options?.[0]);
  }, [options]);

  return (
    <div>
      {!options ? (
        <Loader />
      ) : options.length ? (
        <>
          <label className="text-sm text-gray-700 mb-1">Pick Book</label>
          <Select
            disabled={!!book}
            className="block bg-gray-100 p-4 rounded-lg border border-gray-200  pr-4 mb-4"
            value={selected?.book_id}
            onChange={(e) =>
              setSelected(
                options.find(
                  (book) => book.book_id === parseInt(e.target.value)
                )
              )
            }
          >
            {options.map(
              (book) =>
                book && (
                  <option key={book.book_id} value={book.book_id}>
                    {book.title} by {book.authors?.map((e) => e.name).join(",")}
                  </option>
                )
            )}
          </Select>
          <label className="text-sm text-gray-700">Catchy Description</label>
          <InputBase
            as="textarea"
            name="synopsis"
            className="text-sm h-48"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
          />
          <ButtonBase
            className="block mx-auto mt-8"
            disabled={!selected}
            onClick={() => {
              if (selected)
                onSubmit({
                  book_id: selected.book_id,
                  synopsis,
                  images,
                });
            }}
          >
            Feature Book
          </ButtonBase>
        </>
      ) : (
        <ButtonBase className="block mx-auto mt-8" disabled={!selected}>
          No additional books to feature
        </ButtonBase>
      )}
    </div>
  );
}

function RecommendForm({
  books,
  recommended,
  onSubmit,
}: {
  books?: Book[] | null;
  recommended?: Book[] | null;
  onSubmit: (selected: number) => void;
}) {
  const [selected, setSelected] = useState<number>();
  const options = useMemo(() => {
    return (
      books &&
      recommended &&
      books.filter((e) => !recommended.some((f) => e.book_id === f.book_id))
    );
  }, [books, recommended]);
  useEffect(() => {
    setSelected(options?.[0]?.book_id);
  }, [options]);

  return (
    <div>
      {!options ? (
        <Loader />
      ) : options.length ? (
        <>
          <div className="text-center">
            <label className="text-sm text-gray-700">Pick Book</label>
          </div>
          <Select
            className="block bg-gray-100 p-4 rounded-lg border border-gray-200  pr-4 mx-auto"
            value={selected}
            onChange={(e) => setSelected(parseInt(e.target.value))}
          >
            {options.map((book) => (
              <option key={book.book_id} value={book.book_id}>
                {book.title} by {book.authors?.map((e) => e.name).join(",")}
              </option>
            ))}
          </Select>
          <ButtonBase
            className="block mx-auto mt-8"
            disabled={!selected}
            onClick={() => {
              if (selected) onSubmit(selected);
            }}
          >
            Recommend
          </ButtonBase>
        </>
      ) : (
        <ButtonBase className="block mx-auto mt-8" disabled>
          No additional books to recommend
        </ButtonBase>
      )}
    </div>
  );
}

function BooksTable({ books }: { books: Book[] | undefined }) {
  return (
    <DataTable
      className="w-full"
      data={books!}
      keyField="book_id"
      columns={[
        {
          name: "ID",
          selector(e: Book) {
            return e.book_id;
          },
          minWidth: "auto",
          grow: 0,
        },
        {
          name: "Title",
          selector(e: Book) {
            return e.title;
          },
        },
        {
          name: "Description",
          selector(e: Book) {
            return e.description;
          },
          maxWidth: "180px",
        },
        {
          name: "Price",
          selector(e: Book) {
            return (
              e.price?.toLocaleString(undefined, {
                currency: "NGN",
                style: "currency",
              }) ?? "--"
            );
          },
        },
        {
          name: "PDF",
          selector(e: Book) {
            return <Link href={e.pdf_url}>Download</Link>;
          },
        },
        {
          name: "Published Date",
          selector(e: Book) {
            return e.published_date?.toDateString() ?? "--";
          },
        },
        {
          name: "Created At",
          selector(e: Book) {
            return e.created_at?.toDateString() ?? "--";
          },
        },

        {
          name: "Updated At",
          selector(e: Book) {
            return e.updated_at?.toDateString() ?? "--";
          },
        },
      ]}
      progressPending={!books}
      progressComponent={<Loader className="pt-14" />}
    />
  );
}
