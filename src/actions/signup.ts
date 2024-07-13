"use server";
import { getSession } from "@/utils/session";
import { getUserByEmail, createUser } from "@/services/user_service";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import validateForm from "@/utils/validate_form";
import { signUpSchema } from "./schemas/signupSchema";

export async function signupAction(_: void, form: FormData) {
  const data = validateForm(form, signUpSchema);
  const user = await getUserByEmail(data.email);

  if (user) {
    throw new Error("User already exists");
  }
  const password_hash = await bcrypt.hash(data.password, 10);
  const user_id = await createUser({
    email: data.email,
    password_hash,
    username: data.username,
  });

  const session = await getSession();
  session.user = {
    id: user_id,
    role: "admin",
  };
  await session.save();
  redirect(data.redirecturl ?? "/admin");
}
