import { ZodIssue } from "zod";
import { httpUpload } from "./file_upload/http_upload";
import { s3Upload } from "./file_upload/s3_upload";

export const baseURL = import.meta.env.DEV
  ? "http://localhost:8088/api"
  : "https://api.thegleamingcatalog.com.ng/api";

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

// Storing the files on Vercel but optimizing them with cloudflare
export function uploadAndGetURL(file: File) {
  return s3Upload(baseURL + "/image/upload", file);
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

export async function queryFn({ queryKey }: { queryKey: string[] }) {
  return fetcher(queryKey.join(""), { credentials: "omit" });
}

export async function authQueryFn({ queryKey }: { queryKey: string[] }) {
  return fetcher(queryKey.join(""), { credentials: "include" });
}
