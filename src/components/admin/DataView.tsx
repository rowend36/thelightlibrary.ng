import { ReactNode, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Primitive } from "react-data-table-component/dist/DataTable/types";
import Loader from "../Loader";
import ImageUpload, { PdfUpload } from "../ImageUpload";
import InputBase from "../base/InputBase";
import errorDescription from "../../utils/error_description";
import { uploadAndGetURL, ValidationError } from "../../data/actions/queryFn";
import { ButtonBase } from "../base/ButtonBase";
import { ActionResponse } from "../../data/actions/ActionResponse";
import reshape from "../../utils/reshape";
import useStable from "../../utils/useStable";
import { Select } from "@headlessui/react";

type Spec = {
  label: string;
  createOnly?: boolean;
  readOnly?: boolean;
  formType?:
    | "text"
    | "longtext"
    | "boolean"
    | "number"
    | "date"
    | "image"
    | "pdf"
    | "month"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((e: any, err: ActionResponse | null, initial: any) => ReactNode);
  options?: Record<string, string>;
  required?: boolean;
  wide?: boolean;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableType?: "text" | "date" | "image" | "pdf" | ((e: any) => ReactNode);
};

export function DataView<T extends object>({
  data,
  specs,
  actions,
  actionsWidth = 200,
}: {
  data: T[] | undefined;
  specs: Record<keyof T, Spec>;
  actions?: (e: T) => ReactNode;
  actionsWidth?: number;
}) {
  const keys = Object.keys(specs) as (keyof T & string)[];
  return (
    <DataTable
      className="w-full"
      data={data!}
      keyField={keys[0]}
      columns={[
        ...keys.map((key) => {
          const type =
            specs[key].tableType ??
            (typeof specs[key].formType === "function"
              ? "text"
              : specs[key].formType) ??
            "text";
          return {
            grow: specs[key].wide ? 2 : 0,
            name: specs[key].label,
            selector(e: T) {
              switch (type) {
                case "number":
                case "text":
                case "longtext":
                  return e[key] as Primitive;
                case "month":
                case "date":
                  return (e[key] as Date).toDateString();
                case "image":
                  return (
                    <img src={e[key] as string} alt="" />
                  ) as unknown as Primitive;
                case "pdf":
                  return (
                    <a href={e[key] as string}>Download</a>
                  ) as unknown as Primitive;
                default:
                  return type(e[key]) as Primitive;
              }
            },
          };
        }),
        {
          name: "",
          grow: 0,
          minWidth: actions ? actionsWidth + "px" : "0",
          selector(e: T) {
            return actions?.(e) as Primitive;
          },
        },
      ]}
      progressPending={!data}
      progressComponent={<Loader className="pt-14" />}
    />
  );
}

export function DataForm<T extends object>({
  nested,
  initial,
  title,
  specs,
  onChange: _onChange,
  onSubmit,
}: {
  nested?: boolean;
  initial: T | null;
  title?: string;
  onSubmit: (e: T) => void;
  specs: Partial<Record<keyof T, Spec>>;
  onChange?: (e: T) => void;
}) {
  const keys = Object.keys(specs) as (keyof T & string)[];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ActionResponse | null>(null);
  const state =
    error instanceof ValidationError ? (error.cause as ActionResponse) : null;

  const [data, onChange] = useState<T>({} as T);
  useEffect(() => {
    // transform month values and remove files
    const transformed = {} as T;
    if (initial)
      for (const key of keys) {
        if (!initial[key]) continue;
        const spec = specs[key]!;
        if (spec.formType === "month" || spec.formType === "date") {
          const x = new Date(initial[key] as string);

          transformed[key as keyof T] = (x.getFullYear() +
            "-" +
            (x.getMonth() + 1).toString().padStart(2, "0") +
            (spec.formType === "date"
              ? "-" + x.getDate().toString().padStart(2, "0")
              : "")) as T[keyof T];
          console.log({ transformed });
        } else if (spec.formType !== "image" && spec.formType !== "pdf") {
          transformed[key] = initial[key];
        }
      }
    onChange(transformed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);
  const __onChange = useStable(_onChange!);
  useEffect(() => {
    __onChange?.(data);
  }, [data, __onChange]);
  const Component = nested ? "div" : "form";
  return (
    <Component
      onSubmit={
        Component === "form"
          ? async (e) => {
              setLoading(true);
              try {
                e.preventDefault();
                const parsed = {} as T;
                for (const [key, rawValue] of new FormData(
                  e.target as HTMLFormElement
                )) {
                  console.log(key, rawValue);
                  let value = rawValue as string | number | File | boolean;
                  switch (specs[key as keyof T]?.formType) {
                    case "image":
                    case "pdf":
                      if (
                        value === "" ||
                        (value instanceof File && value.size === 0)
                      ) {
                        continue;
                      }
                      value = await uploadAndGetURL(value as File);
                      break;
                    case "date":
                      value = new Date(value as string).toISOString();
                      break;
                    case "number":
                      value = Number(value);
                      break;
                    case "boolean":
                      value = value === "on";
                      break;
                  }
                  parsed[key as keyof T] = value as T[keyof T];
                }
                console.log(parsed);
                await onSubmit(reshape([parsed])[0]);
              } catch (e) {
                setError(e as ActionResponse);
              } finally {
                setLoading(false);
              }
            }
          : undefined
      }
    >
      {loading ? (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-10 z-10 flex justify-center items-center rounded-xl">
          <Loader />
        </div>
      ) : null}
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {keys.map((key) => {
        const spec = specs[key]!;

        switch (spec.formType ?? "text") {
          case "image":
            return (
              <ImageUpload
                label={spec.label}
                name={key}
                onChange={(e) => onChange({ ...data, [key]: e } as T)}
                value={
                  typeof data[key] === "string"
                    ? null
                    : (data[key] as File) ?? null
                }
                previewURL={initial?.[key] as string}
                error={errorDescription(state, key) || ""}
                required={spec.required || !initial?.[key]}
              />
            );
          case "pdf":
            return (
              <PdfUpload
                label={spec.label}
                name={key}
                error={errorDescription(state, key) || ""}
                onChange={(e) => onChange({ ...data, [key]: e } as T)}
                value={
                  typeof data[key] === "string"
                    ? null
                    : (data[key] as File) ?? null
                }
                previewURL={initial?.[key] as string}
                required={spec.required || !initial?.[key]}
              />
            );
          case "boolean":
            return (
              <>
                <label className="block mb-4" htmlFor={key}>
                  <input type="hidden" name={key} value="off" />
                  <input
                    type="checkbox"
                    name={key}
                    id={key}
                    className="mr-2"
                    checked={!!data[key]}
                    onChange={(e) => {
                      onChange({ ...data, [key]: e.target.checked } as T);
                    }}
                    required={spec.required}
                    disabled={
                      (spec.createOnly && !!initial?.[key]) || spec.readOnly
                    }
                  />
                  {spec.label}
                </label>
                <span>{errorDescription(state, key)}</span>
              </>
            );

          case "date":
          case "number":
          case "text":
          case "longtext":
          case "month":
            return (
              <InputBase
                type={spec.formType}
                as={
                  spec.options
                    ? Select
                    : spec.formType === "longtext"
                    ? "textarea"
                    : "input"
                }
                error={errorDescription(state, key)}
                name={key}
                label={spec.label}
                value={(data[key] as string) ?? ""}
                pattern={
                  spec.formType === "month" ? "[0-9]{4}-[0-9]{2}" : undefined
                }
                setValue={(e) => {
                  onChange({ ...data, [key]: e } as T);
                }}
                placeholder={spec.placeholder}
                className="mb-4"
                required={spec.required}
                disabled={
                  (spec.createOnly && !!initial?.[key]) || spec.readOnly
                }
              >
                {spec.options
                  ? Object.keys(spec.options).map((e) => {
                      return <option value={e}>{spec.options?.[e]}</option>;
                    })
                  : undefined}
              </InputBase>
            );

          default:
            return spec.formType(data[key], state, initial?.[key]);
        }
      })}
      {error ? (
        <div className="text-red-500 text-sm mb-4">
          {error.message ?? error?.cause?.error}
        </div>
      ) : null}
      <ButtonBase type="submit" className="mt-4">
        Submit
      </ButtonBase>
    </Component>
  );
}
