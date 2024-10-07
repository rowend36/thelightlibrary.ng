import { ReactNode } from "react";
import { Link as NextLink, LinkProps } from "react-router-dom";

export default function Link(
  props: Omit<LinkProps, "to"> & {
    href: string;
    children: ReactNode;
    className?: string;
    disabled?: boolean;
  }
) {
  return (
    <NextLink
      to={props.href}
      {...props}
      className={` text-primary py-2 -my-1 px-2 rounded-lg ${props.className} ${
        props.disabled
          ? "cursor-default opacity-75"
          : "hover:text-primaryLight font-bold"
      }`}
    />
  );
}
