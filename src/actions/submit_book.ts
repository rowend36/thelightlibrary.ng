"use server";
import { addBook } from "@/services/book_service";
import validateForm from "@/utils/validate_form";
import { ZodError } from "zod";
import { ActionResponse } from "./ActionResponse";
import { submitBookSchema } from "./schemas/submitBookSchema";

export async function submitBookAction(
  form: FormData
): Promise<ActionResponse> {
  try {
    const data = validateForm(form, submitBookSchema);
    console.log({ data });
    await addBook(data);
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      return { success: false, errors: error.errors };
    }
    return { success: false, message: "Server Error" };
  }
  return { success: true };
  // Call the service function to submit the book
}
