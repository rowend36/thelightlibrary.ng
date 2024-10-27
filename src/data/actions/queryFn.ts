import { upload } from "@vercel/blob/client";
import { ZodIssue } from "zod";
import { nanoid } from "nanoid";

export const baseURL = import.meta.env.DEV
  ? "http://localhost:8088/api"
  : "https://thelightlibrary-backend.vercel.app/api";

export class APIError extends Error {
  cause: unknown;
}

export class ValidationError extends APIError {
  cause:
    | {
        errors: ZodIssue[];
      }
    | undefined = undefined;
}

export async function fetcher(
  ...[url, init, ...args]:
    | Parameters<typeof fetch>
    | [string, { data: object; method?: "POST" | "DELETE" | "PATCH" }]
) {
  if (init && "data" in init) {
    init = {
      method: init.method ?? "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(init.data),
    };
  } else if (!init?.credentials) {
    init = {
      ...(init ?? null),
      credentials: "include",
    };
  }
  const response = await fetch(baseURL + "/" + url, init, ...args);
  const data = await response.json();

  if (!response.ok) {
    console.log(data);
    const error = new (data.errors ? ValidationError : APIError)();
    error.cause = data;
    error.message = data.message;
    throw error;
  } else {
    return data;
  }
}

const map = new WeakMap();
export async function uploadAndGetURL(image: File) {
  if (map.has(image)) {
    return map.get(image);
  }
  const x = await upload(nanoid(), image, {
    multipart: true,
    access: "public",
    contentType: image.type,
    handleUploadUrl: baseURL + "/image/upload",
  });
  map.set(image, x.downloadUrl);
  return x.downloadUrl;
}

export async function queryFn({ queryKey }: { queryKey: string[] }) {
  return fetcher(queryKey.join(""), { credentials: "omit" });
}

export async function authQueryFn({ queryKey }: { queryKey: string[] }) {
  return fetcher(queryKey.join(""), { credentials: "include" });
}
