"use client";
import { ReactNode } from "react";
import { DashboardProps, DashboardProvider } from "./DashboardContext";

export default function Main({
  children,
  props,
}: {
  children: ReactNode;
  props: Promise<DashboardProps>;
}): JSX.Element {
  const propsLoaded = void props; //usePromise(props);
  return (
    <>
      {propsLoaded ? (
        <DashboardProvider value={propsLoaded}>{children}</DashboardProvider>
      ) : null}
    </>
  );
}
