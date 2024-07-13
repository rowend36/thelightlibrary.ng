"use client";
import { ReactNode, use } from "react";
import { DashboardProps, DashboardProvider } from "./DashboardContext";

export default function Main({
  children,
  props,
}: {
  children: ReactNode;
  props: Promise<DashboardProps>;
}): JSX.Element {
  return (
    <>
      <DashboardProvider value={use(props)}>{children}</DashboardProvider>
    </>
  );
}
