import { getSession } from "../utils/session";
import { getUserById } from "../services/user_service";
import { Request, Response } from "express";

export async function getUser(req: Request, res: Response) {
  const userInfo = (await getSession(req, res)).user;
  const user = userInfo ? await getUserById(userInfo.user_id) : null;
  if (user) user.password_hash = undefined;
  return user;
}
