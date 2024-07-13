import { Button, ButtonProps } from "@headlessui/react";
type ButtonBaseProps = ButtonProps<"button"> & {
  [key: string]: any;
} & {
  as?: any;
  variant?: "contained" | "outlined" | "transparent";
  blank?: boolean;
  size?: "small" | "medium" | "large" | "custom" | "icon";
  children?: React.ReactNode;
};

export function ButtonBase({
  blank,
  variant = "contained",
  size = "medium",
  ...props
}: ButtonBaseProps) {
  return (
    <Button
      {...props}
      className={`
        disabled:opacity-50
        ${
          size === "icon"
            ? "p-2"
            : size === "medium"
            ? "py-3 px-6"
            : size === "small"
            ? "py-1.5 px-4 text-sm"
            : size === "large"
            ? "py-4 px-8 text-lg"
            : ""
        } font-bold ${
        blank
          ? ""
          : variant === "contained"
          ? "text-white bg-primary hover:bg-primaryHover"
          : variant === "outlined"
          ? ""
          : "hover:bg-primaryLight text-primary"
      } ${size == "icon" ? "rounded-full" : "rounded-xl"} baseline  ${
        props.className ?? ""
      }`}
    />
  );
}
