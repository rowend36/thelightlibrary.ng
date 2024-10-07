import { ButtonBase } from "../../base/ButtonBase";
import InputBase from "../../base/InputBase";
import Modal from "../../Modal";
// import { uploadAndGetUrl } from "../../config/storage";
import { Author } from "../../../data/models/author";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { DocumentUpload, GalleryAdd, Minus } from "iconsax-react";
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import errorDescription from "../../../utils/error_description";
import { Form } from "react-router-dom";
import { ActionResponse } from "../../../data/actions/ActionResponse";
import { submitBookFn } from "../../../data/actions/submitBookFn";
import { APIError, ValidationError } from "../../../data/actions/queryFn";
import Loader from "../../Loader";

export default function UploadBooksForm({
  onSubmit,
}: {
  onSubmit: () => void;
}) {
  const [state, setState] = useState<ActionResponse>({});
  const [price, setPrice] = useState<string>();
  const [isPending, setPending] = useState(false);
  const [bookCover, setBookCover] = useState<File>();

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
      const tag = ++fetchController.current.tag;
      fetchController.current.active = query;
      if (fetchController.current.blockUntil > Date.now()) {
        return;
      }

      if (!query) return;
      fetchController.current.blockUntil = Date.now() + 5000;
      // searchAuthorsAction(query).then((authors) => {
      //   if (fetchController.current.lastTag <= tag) {
      //     setSuggestedAuthors(authors);
      //     fetchController.current.lastTag = tag;
      //   }
      //   if (fetchController.current.active !== query) resend();
      // });
    },
    [query]
  );
  const [title, setTitle] = useState("Harry Potter");
  const [description, setDescription] = useState("A boy discovers magic.");
  const [publishedDate, setPublishedDate] = useState(
    () =>
      new Date().getFullYear() +
      "-" +
      new Date().getMonth().toString().padStart(2, "0")
  );
  const [pdf, setPdf] = useState<File | null>(null);
  const [blobImage, setBlobImage] = useState<string>();
  useEffect(() => {
    if (bookCover) {
      const url = URL.createObjectURL(bookCover!);
      setBlobImage(url);
      return () => {
        setBlobImage(undefined);
        URL.revokeObjectURL(url);
      };
    }
  }, [bookCover]);
  const formRef = useRef<HTMLFormElement | null>(null);
  const resetForm = () => {
    startTransition(() => {
      formRef.current?.reset();
      // state.success = false;
      // state.errors = state.data = state.message = undefined;
      setTitle("");
      setAuthors([]);
      setDescription("");
      setPdf(null);
      setPublishedDate("");
    });
  };

  useEffect(() => {
    if (authors.length === 0) addAuthor();
  }, [authors, addAuthor]);
  // console.log(state);
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        try {
          await submitBookFn(new FormData(e.target as HTMLFormElement));
          setState({
            success: true,
            message: "Book added successfully",
          });
        } catch (e) {
          setState({
            success: false,
            errors: e instanceof ValidationError ? e.cause?.errors : undefined,
            message:
              e instanceof APIError ? e.message : (e as object).toString(),
          });
        }
        setPending(false);
      }}
      ref={formRef}
    >
      <Modal alert open={!!state.success} onClose={onSubmit}>
        <h3 className="text-center">Book Uploaded Successfully</h3>
        <div className="flex-grow" />
        <ButtonBase variant="transparent" className="my-4" onClick={resetForm}>
          Upload Another
        </ButtonBase>
        <ButtonBase variant="transparent" onClick={onSubmit}>
          Dismiss
        </ButtonBase>
      </Modal>

      <label
        htmlFor="book_cover"
        className=" relative text-center cursor-pointer overflow-hidden hover:border-primary h-32 w-56 max-w-full justify-end rounded-xl mx-auto text-gray-400 flex flex-col items-center border p-4 mt-4 appearance-none "
      >
        {blobImage ? (
          <img
            src={blobImage}
            className="absolute top-0 left-0 object-contain object-center w-full h-full"
          />
        ) : (
          <GalleryAdd
            className={`${
              bookCover ? "text-primary" : "text-gray-400"
            } h-20 w-20 m-1`}
          />
        )}
        {bookCover ? (
          <span className="text-xs text-ellipsis relative z-10">
            {bookCover.name}
          </span>
        ) : (
          <i className="text-xs">Drag here or Click to upload Book Cover</i>
        )}
        <input
          type="file"
          required
          id="book_cover"
          onChange={(e) => {
            setBookCover(e.target.files?.[0] ?? undefined);
          }}
          name="book_cover"
          accept="image/*"
          className="opacity-[0.02] bg-primary absolute inset-0 cursor-pointer"
        />
      </label>
      <p className="text-red-500 text-center pb-8">
        {errorDescription(state, "pdf") || isPending}
      </p>
      <InputBase
        error={errorDescription(state, "title")}
        type="text"
        name="title"
        value={title}
        setValue={setTitle}
        placeholder="Book Title"
        className="mb-4"
      />
      <InputBase
        error={errorDescription(state, "price")}
        type="number"
        name="price"
        value={price}
        setValue={setPrice}
        placeholder="Book Price"
        className="mb-4"
      />
      <InputBase
        error={errorDescription(state, "description")}
        as="textarea"
        type="text"
        name="description"
        value={description}
        setValue={setDescription}
        placeholder="Book Description"
        className="mb-4"
      />
      <InputBase
        type="month"
        error={errorDescription(state, "published_date")}
        name="published_date"
        value={publishedDate}
        pattern="[0-9]{4}-[0-9]{2}"
        setValue={(e) => {
          setPublishedDate(e);
          console.log(e);
        }}
        placeholder="Date of Publication"
        className="mb-4"
      />
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
                className="border empty:invisible w-56 bg-white shadow-md mt-1"
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
              placeholder="About Author"
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
        {errorDescription(state, "authors") || isPending}
      </p>
      <label
        htmlFor="pdf"
        className=" relative text-center cursor-pointer overflow-hidden hover:border-primary h-32 w-56 max-w-full justify-end rounded-xl mx-auto text-gray-400 flex flex-col items-center border p-4 mt-4 appearance-none "
      >
        <DocumentUpload
          className={`${pdf ? "text-primary" : "text-gray-400"} h-20 w-20 m-1`}
        />
        {pdf ? (
          <span className="text-xs text-ellipsis">{pdf.name}</span>
        ) : (
          <i className="text-xs">Drag here or Click to upload PDF</i>
        )}
        <input
          type="file"
          required
          id="pdf"
          onChange={(e) => {
            setPdf(e.target.files?.[0] ?? null);
          }}
          name="pdf"
          accept="application/pdf, application/epub+zip"
          className="opacity-5 bg-primary absolute inset-0 cursor-pointer"
        />
      </label>
      <p className="text-red-500 text-center">
        {errorDescription(state, "pdf_url") || isPending}
      </p>
      {state.success === false && state.message ? (
        <div className="text-red-500 mt-8 text-center">{state.message}</div>
      ) : null}
      <ButtonBase
        type="submit"
        className="mx-auto block mt-8"
        disabled={isPending}
      >
        {isPending ? <Loader /> : "Submit"}
      </ButtonBase>
    </Form>
  );
}
