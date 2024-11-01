import { Handler } from "express";
import { ZodError, ZodSchema } from "zod";

export function validateRequest<T extends ZodSchema>(schema: T): Handler {
  return function (req, res, next) {
    try {
      req.validated_data = schema.parse(req.body);
    } catch (e) {
      if (e instanceof ZodError)
        return res.status(400).send({
          code: "app/validation-failed",
          error: "Validation Error",
          errors: e.issues,
        });
      else throw e;
    }

    return next();
  };
}
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      validated_data?: unknown;
    }
  }
}
