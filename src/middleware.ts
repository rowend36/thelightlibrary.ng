// server.js
import { NextRequest } from "next/server";
import { getSession } from "./utils/session";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const currentUser = session.user;
  const isLoggingIn = /^\/signup|^\/login/.test(request.nextUrl.pathname);

  if (!currentUser && !isLoggingIn) {
    return Response.redirect(
      new URL(
        "/login?returnURL=" + encodeURIComponent(request.url),
        request.url
      )
    );
  } else if (currentUser && isLoggingIn) {
    const redirectURL =
      request.nextUrl.searchParams.get("returnURL") ??
      (currentUser.role === "admin" ? "/admin" : "/");
    return Response.redirect(new URL(redirectURL, request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$)(?:admin|login|signup).*)",
  ],
};
