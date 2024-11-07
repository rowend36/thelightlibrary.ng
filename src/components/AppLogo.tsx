// import companyLogo "../assets/book.png";
import { Link } from "react-router-dom";
import gleamingImage from "../assets/gleaming_logo.png";
export function AppLogo(props: { className?: string }) {
  /* Logo */

  return (
    <Link
      to="/"
      {...props}
      className={"pb-1 flex items-center gap-1 " + props.className}
    >
      <img
        width={156}
        height={96}
        src={gleamingImage}
        className="max-w-full h-full object-contain"
      />
    </Link>
  );
}
