import { ReactNode } from "react";
import { default as NextLink, LinkProps } from "next/link";

export default function Link(props: LinkProps & { children: ReactNode }) {
  return (
    <NextLink
      {...props}
      className="hover:text-primary hover:bg-green-50 py-2 -my-1 px-2 rounded-lg"
    />
  );
}
