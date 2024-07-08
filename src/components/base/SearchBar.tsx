import { SearchNormal } from "iconsax-react";
import { ButtonBase } from "./ButtonBase";
import InputBase from "./InputBase";
import { InputBaseProps } from "./InputBase";

export function SearchBar({
  className,
  ...props
}: {
  className: string;
  props?: InputBaseProps;
}) {
  return (
    <form className={className} action="/search">
      <InputBase
        {...props}
        name="query"
        type="search"
        className="flex-grow"
        startIcon={<SearchNormal />}
      />
      <ButtonBase type="submit">Search</ButtonBase>{" "}
    </form>
  );
}
