import { ArrowLeft } from "iconsax-react";

import AvatarImage from "../AvatarImage";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

export default function Header({
  title,
  allowBack,
}: {
  allowBack?: boolean;
  title: string;
}) {
  return (
    <div className="container lg:px-8 xl:px-12 flex items-center">
      {allowBack ? (
        <Link className="mr-4" to={-1}>
          <ArrowLeft />
        </Link>
      ) : null}

      <h1 className="max-sm:pl-8 max-sm:text-xl text-2xl font-bold text-text sm:mt-4">
        {title}
      </h1>
      <div className="flex-grow" />
      <Avatar />
    </div>
  );
}
