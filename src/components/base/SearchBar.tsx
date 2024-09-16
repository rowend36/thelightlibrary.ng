import { SearchNormal } from "iconsax-react";
import { ButtonBase } from "./ButtonBase";
import InputBase from "./InputBase";
import { InputBaseProps } from "./InputBase";

export function SearchBar({
  className,
  ...props
}: {
  className: string;
} & InputBaseProps) {
  // TODO: Use Next.js Form Actions where possible
  return (
    <form className={className} action="/search">
      <InputBase
        {...props}
        name="query"
        type="search"
        className="flex-grow"
        placeholder="Search for anything..."
        startIcon={<SearchNormal />}
      />
      <ButtonBase type="submit">Search</ButtonBase>{" "}
    </form>
  );
}
