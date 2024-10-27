import { type SessionOptions } from "iron-session";
import { User } from "../data/models/user";

export const ironSessionOptions: SessionOptions = {
  password: process.env.COOKIE_SECRET!,
  cookieName: process.env.COOKIE_NAME!,
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : false,
  },
};
export interface AppSession {
  user: Omit<User, "password_hash"> & {
    role: string;
  };
}
