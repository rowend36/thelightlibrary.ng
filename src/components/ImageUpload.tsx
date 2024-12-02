import { CloseCircle, DocumentUpload, GalleryAdd } from "iconsax-react";
import { useState, useEffect } from "react";

export default function ImageUpload({
  label,
  name,
  value: bgImage,
  required = false,
  onChange: setBgImage,
  error,
  previewURL,
  allowClear = !required,
}: {
  label: string;
  name: string;
  required?: boolean;
  value: File | null;
  allowClear?: boolean;
  onChange: (e: File | null) => void;
  error?: string;
  previewURL?: string | undefined;
}) {
  const [bgImageURL, setBgImageURL] = useState<string | undefined>(previewURL);
  useEffect(() => {
    if (!bgImage) return setBgImageURL(previewURL);
    const x = URL.createObjectURL(bgImage);
    setBgImageURL(x);
    return () => {
      URL.revokeObjectURL(x);
      setBgImageURL(undefined);
    };
  }, [bgImage, previewURL]);
  const [key, setKey] = useState(0);

  return (
    <>
      <div className="text-center">
        <label htmlFor={name} className="text-sm text-text">
          {label}
        </label>
      </div>
      <label
        htmlFor={name}
        className="relative text-center cursor-pointer overflow-hidden hover:border-primary \
             h-32 w-56 max-w-full justify-end rounded-xl mx-auto text-gray-400 flex flex-col \
              items-center border p-4 appearance-none"
      >
        {bgImageURL ? (
          <img src={bgImageURL} className="h-20 w-auto mb-1" />
        ) : (
          <GalleryAdd
            className={`${
              bgImage ? "text-primary" : "text-gray-400"
            } h-20 w-20 m-1`}
          />
        )}
        {bgImage ? (
          <span className="text-xs text-ellipsis">{bgImage.name}</span>
        ) : (
          <i className="text-xs">Drag here or Click to upload image</i>
        )}
        <input
          type="file"
          key={key}
          maxLength={10_000_000}
          required={required}
          id={name}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 10_000_000) {
              alert(
                "File size should be less than 10MB to reduce costs and keep website fast"
              );
              setKey((k) => k + 1);
              setBgImage(null);
              return;
            }
            setBgImage(file);
          }}
          name={name}
          accept="image/*"
          className="opacity-[0.025] bg-primary absolute inset-0 cursor-pointer"
        />
        {!allowClear || !bgImage ? null : (
          <button className="absolute top-0 right-0 text-red-500 hover:bg-slate-400">
            <CloseCircle
              onClick={(e) => {
                e.preventDefault();
                setKey((k) => k + 1);
                setBgImage(null);
              }}
            />
          </button>
        )}
      </label>
      <p className="text-red-500 text-center mb-4">{error}</p>
    </>
  );
}

export function PdfUpload({
  label,
  name,
  value,
  required = false,
  onChange,
  previewURL,
  error,
}: {
  label: string;
  name: string;
  required?: boolean;
  value: File | null;
  previewURL?: string;
  onChange: (e: File | null) => void;
  error?: string;
}) {
  return (
    <>
      <div className="text-center mt-4 ">
        <label htmlFor={name} className="text-sm text-text">
          {label}
        </label>
      </div>
      <label
        htmlFor={name}
        className=" relative text-center cursor-pointer overflow-hidden hover:border-primary h-32 w-56 max-w-full justify-end rounded-xl mx-auto text-gray-400 flex flex-col items-center border p-4 appearance-none "
      >
        <DocumentUpload
          className={`${
            value || previewURL ? "text-primary" : "text-gray-400"
          } h-20 w-20 m-1`}
        />
        {value ? (
          <span className="text-xs text-ellipsis">{value.name}</span>
        ) : (
          <i className="text-xs">Drag here or Click to upload PDF</i>
        )}
        <input
          type="file"
          required={required}
          id={name}
          onChange={(e) => {
            onChange(e.target.files?.[0] ?? null);
          }}
          name={name}
          accept="application/pdf, application/epub+zip"
          className="opacity-5 bg-primary absolute inset-0 cursor-pointer"
        />
      </label>
      <p className="text-red-500 text-center">{error}</p>
    </>
  );
}
