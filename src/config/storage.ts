import { randomUUID } from "crypto";
import { storage } from "./supabase";

export const uploadAndGetUrl = async function (e: File) {
  const { data, error } = await storage
    .from(process.env.SUPABASE_PDF_BUCKET!)
    .upload(randomUUID() + e.name, e);
  console.log({ data, error });
  if (error) {
    throw error;
  } else {
    return data.fullPath;
  }
};
