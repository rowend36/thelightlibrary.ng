import { Button, ButtonProps } from "@headlessui/react";
type ButtonBaseProps = ButtonProps<any> & {
  [key: string]: any;
} & {
  as?: any;
  variant?: "contained" | "outlined" | "transparent";
  blank?: boolean;
  children?: React.ReactNode;
};

export function ButtonBase({ blank, ...props }: ButtonBaseProps) {
  switch (props.variant) {
    case "transparent":
      return <Button {...props} />;
    case "outlined":
      return <Button {...props} />;
    default:
      return (
        <Button
          {...props}
          className={`py-3 px-6 font-bold ${
            blank ? "" : "text-white bg-primary hover:bg-primaryHover "
          }rounded-xl baseline  ${props.className ?? ""}`}
        />
      );
  }
}
