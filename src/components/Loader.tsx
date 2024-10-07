import { HTMLProps } from "react";

export default function Loader(props: HTMLProps<HTMLDivElement>) {
  return (
    <div {...props}>
      <div className="mx-auto mb-4 border-4 border-b-transparent border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
    </div>
  );
}
