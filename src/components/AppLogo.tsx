import Image from "next/image";
import companyLogo from "@/assets/book.png";
import Link from "next/link";
export function AppLogo(props: any) {
  /* Logo */

  return (
    <Link
      href="/"
      {...props}
      className={"pt-2 flex items-center gap-1 " + props.className}
    >
      <Image
        src={companyLogo}
        className="object-contain h-[4em] w-auto "
        alt=""
      />{" "}
      <span
        className="font-[400] lowercase leading-tight text-primary pt-[0.5em]"
        style={{ letterSpacing: 0.5, fontFamily: "Varela Round" }}
      >
        NYSC
        <br />
        E-LIBRARY
      </span>
    </Link>
  );
}
