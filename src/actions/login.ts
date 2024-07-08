"use server";
import { getSession } from "@/utils/session";
import { getUserByEmail } from "@/services/user_service";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
export async function login(form: FormData) {
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  if (!(await bcrypt.compare(password, user.password_hash))) {
    throw new Error("Invalid password");
  }

  const session = await getSession();
  session.user = {
    id: user.user_id,
    role: "admin",
  };
  await session.save();
  redirect("/admin");
}
