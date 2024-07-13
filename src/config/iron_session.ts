import "server-only";
import { type SessionOptions, getIronSession } from "iron-session";

export const ironSessionOptions: SessionOptions = {
  password: process.env.COOKIE_SECRET!,
  cookieName: "nysc_library",
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
export interface AppSession {
  user: {
    id: number;
    role: string;
  };
}
