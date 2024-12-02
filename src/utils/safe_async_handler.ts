import { NextFunction, Request, RequestHandler, Response } from "express";
import { destroyDatabase } from "../config/database";

let connections = 0;
export default function s<T extends RequestHandler>(func: T) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      connections++;
      return await func(req, res, next);
    } catch (e) {
      return next(e);
    } finally {
      if (--connections === 0) await destroyDatabase();
    }
  };
}
