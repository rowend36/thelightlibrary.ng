import { ActionResponse } from "@/actions/ActionResponse";
import { searchAuthorsAction } from "@/actions/search_authors";
import { submitBookAction } from "@/actions/submit_book";
import { ButtonBase } from "@/components/base/ButtonBase";
import InputBase from "@/components/base/InputBase";
import Modal from "@/components/Modal";
import { uploadAndGetUrl } from "@/config/storage";
import { Author } from "@/data/models/author";
import { MONTHS } from "@/utils/constants";
import errorDescription from "@/utils/error_description";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { DocumentUpload, Minus } from "iconsax-react";
import { startTransition, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

export default function UploadBooksForm({
  onSubmit,
}: {
  onSubmit: () => void;
}) {
  const [state, action, isPending] = useFormState(
    async (_: any, form: FormData) => {
      console.log("Uploading pdf....");
      const pdf_url = await uploadAndGetUrl(form.get("pdf") as File);
      form.delete("pdf");
      form.append("pdf_url", pdf_url);
      return await submitBookAction(form);
    },
    {
      success: false,
    }
  );
  const [authors, setAuthors] = useState<Author[]>([]);
  const maxId = useRef(-1);
  const addAuthor = () => {
    setAuthors([
      ...authors,
      { author_id: maxId.current--, name: "", biography: "" },
    ]);
  };
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
      searchAuthorsAction(query).then((authors) => {
        if (fetchController.current.lastTag <= tag) {
          setSuggestedAuthors(authors);
          fetchController.current.lastTag = tag;
        }
        if (fetchController.current.active !== query) resend();
      });
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
  const formRef = useRef<HTMLFormElement | null>(null);
  const resetForm = () => {
    startTransition(() => {
      formRef.current?.reset();
      state.success = false;
      state.errors = state.data = state.message = undefined;
      setTitle("");
      setAuthors([]);
      setDescription("");
      setPdf(null);
      setPublishedDate("");
    });
  };
  console.log(state);
  return (
    <form action={action} ref={formRef}>
      <Modal alert open={state.success} onClose={onSubmit}>
        <h3 className="text-center">Book Uploaded Successfully</h3>
        <div className="flex-grow" />
        <ButtonBase variant="transparent" className="my-4" onClick={resetForm}>
          Upload Another
        </ButtonBase>
        <ButtonBase variant="transparent" onClick={onSubmit}>
          Dismiss
        </ButtonBase>
      </Modal>
      {state.success === false && state.message ? (
        <div className="text-red-500 mb-8">{state.message}</div>
      ) : null}
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
              name="authors[].author_id"
              value={author.author_id}
            />
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-bold text-darkGrayishBlue">
                Author #{i}
              </h4>
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
            </div>

            <Combobox
              name="authors[].name"
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
              name="authors[].biography"
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
          <i className="text-lg italic text-darkGrayishBlue">
            No authors added
          </i>
        </div>
      )}
      <ButtonBase
        onClick={addAuthor}
        className="mt-4 mx-auto block"
        size="small"
      >
        Add Author
      </ButtonBase>
      <label
        htmlFor="pdf"
        className=" relative text-center cursor-pointer overflow-hidden hover:border-primary h-32 w-56 max-w-full justify-end rounded-xl mx-auto text-darkGrayishBlue flex flex-col items-center border p-4 mt-4 appearance-none "
      >
        <DocumentUpload
          className={`${
            pdf ? "text-primary" : "text-darkGrayishBlue"
          } h-20 w-20 m-1`}
        />
        {pdf ? (
          <span className="text-xs text-ellipsis">{pdf.name}</span>
        ) : (
          <i>Drag here or Click to upload PDF</i>
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
        {errorDescription(state, "pdf") || isPending}
      </p>
      {state.success === false && state.message ? (
        <div className="text-red-500 mt-8 text-center">{state.message}</div>
      ) : null}
      <ButtonBase
        type="submit"
        className="mx-auto block mt-8"
        disabled={isPending}
      >
        Submit
      </ButtonBase>
    </form>
  );
}
