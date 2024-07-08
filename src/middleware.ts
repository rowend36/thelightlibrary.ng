// server.js
import { NextRequest } from "next/server";
import { getSession } from "./utils/session";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const currentUser = session.user;

  if (!currentUser) {
    return Response.redirect(
      new URL(
        "/login?returnURL=" + encodeURIComponent(request.url),
        request.url
      )
    );
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$)(?:admin).*)"],
};
