import { ReactNode } from "react";
import { default as NextLink, LinkProps } from "next/link";

export default function Link(
  props: LinkProps & {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
  }
) {
  return (
    <NextLink
      {...props}
      className={` text-darkBlue   py-2 -my-1 px-2 rounded-lg ${
        props.className
      } ${
        props.disabled
          ? "cursor-default opacity-75"
          : "hover:text-primary hover:bg-green-50"
      }`}
    />
  );
}
