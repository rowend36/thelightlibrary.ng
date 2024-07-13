import { getSession } from "@/utils/session";
import { getUserById } from "@/services/user_service";
import { cookies } from "next/headers";

export async function getUser() {
  const userInfo = (await getSession()).user;
  let user = userInfo ? await getUserById(userInfo.id) : null;
  if (user) user.password_hash = undefined;
  return user;
}
