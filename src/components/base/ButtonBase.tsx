import { Button, ButtonProps } from "@headlessui/react";
interface ButtonBaseProps extends ButtonProps {
  variant?: "contained" | "outlined" | "transparent";
}

export function ButtonBase(props: ButtonBaseProps) {
  switch (props.variant) {
    case "transparent":
      return <Button {...props} />;
    case "outlined":
      return <Button {...props} />;
    default:
      return (
        <Button
          {...props}
          className={`py-3 px-6 text-white bg-primary rounded-full baseline hover:bg-primaryLight ${
            props.className ?? ""
          }`}
        />
      );
  }
}
