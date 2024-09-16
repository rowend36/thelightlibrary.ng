"use client";
import { User } from "../../data/models/user";
import { createContext, useContext } from "react";
const DashboardContext = createContext({
  user: null as User | null,
  numBooks: 0 as number,
});
export const DashboardProvider = DashboardContext.Provider;
export const useDashboard = () => {
  return useContext(DashboardContext);
};
export type DashboardProps = ReturnType<typeof useDashboard>;
