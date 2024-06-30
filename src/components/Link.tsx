import { default as NextLink, LinkProps } from "next/link";

export default function Link(props: LinkProps) {
  return <NextLink {...props} href="#" className="hover:text-darkGrayishBlue" />;
}
