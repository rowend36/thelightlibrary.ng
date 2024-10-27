import { getIronSession } from "iron-session";
import { ironSessionOptions, AppSession } from "../config/iron_session";
import { Request, Response } from "express";

export const getSession = (req: Request, res: Response) => {
  return getIronSession<AppSession>(req, res, ironSessionOptions);
};
