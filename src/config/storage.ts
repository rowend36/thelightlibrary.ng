import { nanoid } from "nanoid";
import { supabase } from "./supabase";

export const uploadAndGetUrl = async function (e: File) {
  const { data, error } = await supabase.storage
    .from("e-library")
    .upload(nanoid() + "-" + e.name, e);

  console.log({ data, error });
  if (error) {
    throw error;
  } else {
    return data!.fullPath;
  }
};
