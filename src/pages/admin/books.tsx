import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Select,
} from "@headlessui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Minus, Trash } from "iconsax-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DataTable from "react-data-table-component";
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
import { DataForm } from "../../components/admin/DataView";
import { Author } from "../../data/models/author";
import errorDescription from "../../utils/error_description";
import { ActionResponse } from "../../data/actions/ActionResponse";
import { Primitive } from "react-data-table-component/dist/DataTable/types";

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

  const [showAddBookForm, setShowAddBookForm] = useState<Book | null | true>(
    null
  );
  const [showFeaturedBookForm, setShowFeaturedBookForm] = // -> Prevent prettier from botching this formatting
    useState<boolean | number>(false);

  return (
    <>
      <DashboardProvider>
        <ButtonBase
          className="mb-8 block mx-auto"
          onClick={() => setShowAddBookForm(true)}
        >
          Upload New Book
        </ButtonBase>
        <Modal
          open={!!showAddBookForm}
          onClose={() => setShowAddBookForm(null)}
          title={
            showAddBookForm && showAddBookForm !== true
              ? "Edit Book"
              : "Upload New Book"
          }
        >
          <DataForm<Book>
            // title="Upload New Book"
            key={showAddBookForm ? 1 : 0}
            initial={
              showAddBookForm && showAddBookForm !== true
                ? showAddBookForm
                : null
            }
            specs={{
              book_cover_url: {
                formType: "image",
                label: "Cover Image",
              },
              title: {
                formType: "text",
                label: "Book Title",
              },
              description: {
                formType: "text",
                label: "Book Description",
              },
              price: {
                formType: "number",
                label: "Price",
              },
              enabled: {
                formType: "boolean",
                label: "Enabled",
              },
              published_date: {
                formType: "month",
                label: "Publication Date",
              },
              authors: {
                formType(data: Author[], err, initial) {
                  return <AuthorForm state={err!} initial={initial} />;
                },
                tableType(e) {
                  return e.map((e) => e.name).join(", ");
                },
                label: "Authors",
              },
              pdf_url: {
                formType: "pdf",
                label: "File",
              },
            }}
            // state={state}
            onSubmit={async (data) => {
              if ("price" in data) data.price = data.price?.toString() as never;
              if (showAddBookForm && showAddBookForm !== true) {
                await fetcher("books/" + showAddBookForm.book_id, {
                  method: "PATCH",
                  data,
                });
              } else {
                await fetcher("books", {
                  method: "POST",
                  data,
                });
              }
              await refetch();
              setShowAddBookForm(null);
            }}
            onCancel={() => setShowAddBookForm(null)}
          />
        </Modal>

        <div className="flex flex-wrap gap-x-4 mb-8 gap-y-4 ">
          <div className="shadow-sm bg-white p-4 rounded-md basis-56 flex-grow">
            <h2 className="font-bold text-gray-600 mb-2">All Books</h2>

            <BooksTable
              books={books}
              editBook={(book) => setShowAddBookForm(book)}
            />
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
                    <ButtonBase
                      color="#ff0000"
                      onClick={async () => {
                        await fetcher("books/recommend", {
                          data: {
                            books: recommended
                              ?.map((e) => e.book_id)
                              .filter((f) => f !== e.book_id),
                          },
                        });
                        await refetchRecommended();
                      }}
                    >
                      <Trash size={20} color="#ffffff" />
                    </ButtonBase>
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
                      className="rounded-lg h-36 w-24 object-contain bg-gray-200 max-h-56"
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

function AuthorForm({
  state,
  initial,
}: {
  state?: ActionResponse;
  initial?: Author[];
}) {
  const [authors, setAuthors] = useState<Author[]>([]);

  const maxId = useRef(-1);
  const addAuthor = useCallback(() => {
    setAuthors([
      ...authors,
      { author_id: maxId.current--, name: "", biography: "" },
    ]);
  }, [authors]);

  const [query, setQuery] = useState("");
  const [suggestedAuthors, setSuggestedAuthors] = useState<Author[]>([]);
  const fetchController = useRef({
    blockUntil: 0, // block future requests
    active: query,
    tag: 0,
    lastTag: 0,
  });
  useEffect(
    function resend() {
      if (!query) return;
      if (query.length < 3) return;
      const tag = ++fetchController.current.tag;
      if (
        fetchController.current.blockUntil > Date.now() &&
        query.startsWith(fetchController.current.active)
      ) {
        fetchController.current.active = query;
        return;
      }
      fetchController.current.active = query;

      fetchController.current.blockUntil = Date.now() + 5000;
      fetcher("authors/search?name=" + encodeURIComponent(query)).then(
        (authors) => {
          if (fetchController.current.lastTag <= tag) {
            setSuggestedAuthors(authors);
            fetchController.current.lastTag = tag;
          }
        }
      );
    },
    [query]
  );
  // Add at least one author

  useEffect(() => {
    setAuthors((e) => [
      ...(initial?.length
        ? initial
        : [{ author_id: maxId.current--, name: "", biography: "" }]),
    ]);
  }, [initial]);

  return (
    <>
      <h3 className="font-bold mt-8">Authors</h3>

      {authors.length > 0 ? (
        authors.map((author, i) => (
          <div key={i}>
            <input
              type="hidden"
              name={"authors[" + i + "].author_id"}
              value={author.author_id}
            />
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-bold text-gray-400">Author #{i}</h4>
              {authors.length > 1 ? (
                <ButtonBase
                  variant="transparent"
                  onClick={() => {
                    setAuthors(
                      authors.filter((e) => e.author_id !== author.author_id)
                    );
                  }}
                  size="icon"
                  blank
                  className="hover:bg-red-50"
                >
                  <Minus className="text-red-500" />
                </ButtonBase>
              ) : null}
            </div>

            <Combobox
              name={"authors[" + i + "].name"}
              value={author.name}
              onChange={(value) => {
                if (!value || typeof value === "string") {
                  setAuthors(
                    authors.map((e) =>
                      e.author_id === author.author_id
                        ? { ...e, name: value ?? "" }
                        : e
                    )
                  );
                } else {
                  setAuthors(
                    authors.map((e) =>
                      e.author_id === author.author_id ? value : e
                    )
                  );
                }
              }}
              onClose={() => setQuery("")}
            >
              <InputBase
                as={ComboboxInput}
                value={author.name}
                error={errorDescription(state, "authors", i, "name")}
                type="text"
                autoComplete="off"
                placeholder="Author Name"
                className="mb-4"
                onChange={(event) => {
                  setAuthors(
                    authors.map((el) =>
                      el.author_id === author.author_id
                        ? {
                            ...el,
                            name: event.target.value,
                            author_id:
                              el.author_id < 0 || event.target.value === el.name
                                ? el.author_id
                                : maxId.current--,
                          }
                        : el
                    )
                  );
                  setQuery(event.target.value);
                }}
              />
              <ComboboxOptions
                anchor="bottom"
                className="border  w-56 bg-white shadow-md mt-1 z-50"
              >
                {suggestedAuthors.map((suggestedAuthor) => (
                  <ComboboxOption
                    key={suggestedAuthor.author_id}
                    value={suggestedAuthor}
                    className="data-[focus]:bg-blue-100 p-2"
                  >
                    {suggestedAuthor.name}
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </Combobox>
            <InputBase
              as="textarea"
              type="text"
              name={"authors[" + i + "].biography"}
              error={errorDescription(state, "authors", i, "biography")}
              disabled={author.author_id > 0}
              value={author.biography}
              setValue={(value) =>
                setAuthors(
                  authors.map((e) =>
                    e.author_id === author.author_id
                      ? {
                          ...e,
                          biography: value,
                          author_id:
                            e.author_id < 0 || value === e.name
                              ? e.author_id
                              : maxId.current--,
                        }
                      : e
                  )
                )
              }
              placeholder={author.author_id > 0 ? "-" : "About Author"}
              className="mb-4 min-h-16 max-h-32"
            />
          </div>
        ))
      ) : (
        <div className="text-center mb-4">
          <i className="text-lg italic text-gray-400">No authors added</i>
        </div>
      )}
      <ButtonBase
        onClick={addAuthor}
        className="mt-4 mx-auto block"
        size="small"
      >
        Add Author
      </ButtonBase>
      <p className="text-red-500 text-center">
        {errorDescription(state, "authors") || null}
      </p>
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
                  (book) => book?.book_id === parseInt(e.target.value)
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

function BooksTable({
  books,
  editBook,
}: {
  books: Book[] | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editBook: (book: Book) => void;
}) {
  const queryClient = useQueryClient();
  return (
    <DataTable
      className="w-full"
      data={books!}
      keyField="book_id"
      columns={[
        {
          name: "ID",
          selector(e: Book) {
            return e.enabled
              ? e.book_id
              : ((
                  <span className="text-red-500">{e.book_id}</span>
                ) as unknown as Primitive);
          },
          minWidth: "auto",
          grow: 0,
        },
        {
          name: "Title",

          selector(e: Book) {
            return e.enabled
              ? e.title
              : ((
                  <span className="text-red-500">{e.title}</span>
                ) as unknown as Primitive);
          },
        },
        {
          name: "Description",
          selector(e: Book) {
            return e.enabled
              ? e.description
              : ((
                  <span className="text-red-500">{e.description}</span>
                ) as unknown as Primitive);
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
        {
          name: "",
          minWidth: "200px",
          grow: 0,
          selector(e: Book) {
            return (
              <div className="flex justify-between">
                <button
                  className=" text-primary hover:bg-primary/10 active:hover:bg-primary/20 mt-4 p-2 rounded-md text-sm"
                  onClick={() => editBook(e)}
                >
                  <Edit className="inline mr-2" size={20} />
                  Edit
                </button>

                <button
                  className=" text-red-700 hover:bg-red-100 active:bg-red-200  mt-4 p-2 rounded-md text-sm"
                  onClick={async () => {
                    try {
                      await fetcher("books/" + e.book_id, {
                        method: "DELETE",
                      });
                      await queryClient.refetchQueries({
                        queryKey: ["books"],
                      });
                    } catch (e) {
                      alert(e?.cause?.detail);
                    }
                  }}
                >
                  <Trash className="inline mr-2" size={20} />
                  Delete
                </button>
              </div>
            );
          },
        },
      ]}
      progressPending={!books}
      progressComponent={<Loader className="pt-14" />}
    />
  );
}
