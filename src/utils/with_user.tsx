import { getSession } from "@/utils/session";
import { getUserById } from "@/services/user_service";
import { cookies } from "next/headers";

export async function withUser(wrapped?: () => object) {
  const userInfo = (await getSession()).user;
  let user = userInfo ? await getUserById(userInfo.id) : null;
  return { user, ...wrapped?.() };
}
