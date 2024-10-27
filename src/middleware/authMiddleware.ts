import { NextFunction, Request, Response } from "express";
import { getSession } from "../utils/session";

export async function authMiddleware(
  request: Request,
  res: Response,
  next: NextFunction,
) {
  const session = await getSession(request, res);
  const currentUser = session.user;
  const url = new URL(
    `http://${process.env.HOST ?? "localhost"}${request.url}`,
  );

  if (!currentUser) {
    return res.status(401).json({
      code: "auth/unauthenticated",
      message: "Unauthenticated",
      detail: "You need to login to access this route.",
    });
  }
  return next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$)(?:admin|login|signup).*)",
  ],
};
