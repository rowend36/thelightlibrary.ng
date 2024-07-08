"use server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { ironSessionOptions, AppSession } from "@/config/iron_session";

export const getSession = () => {
  return getIronSession<AppSession>(cookies(), ironSessionOptions);
};
