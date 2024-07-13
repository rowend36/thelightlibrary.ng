"use server";
import { getSession } from "@/utils/session";
import { getUserByEmail } from "@/services/user_service";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { loginSchema } from "./schemas/loginSchema";
import validateForm from "@/utils/validate_form";
export async function loginAction(_: void, form: FormData) {
  const data = validateForm(form, loginSchema);
  const user = await getUserByEmail(data.email);

  if (!user) {
    throw new Error("User not found");
  }

  if (!(await bcrypt.compare(data.password, user.password_hash!))) {
    throw new Error("Invalid password");
  }

  const session = await getSession();
  session.user = {
    id: user.user_id,
    role: "admin",
  };
  await session.save();
  redirect(data.redirecturl ?? "/admin");
}
