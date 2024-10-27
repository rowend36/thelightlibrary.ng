import { NextFunction, Request, RequestHandler, Response } from "express";

export default function s<T extends RequestHandler>(func: T) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      return await func(req, res, next);
    } catch (e) {
      return next(e);
    }
  };
}
