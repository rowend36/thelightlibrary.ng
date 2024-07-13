import React, {
  Component,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from "react";
import {
  Field,
  Input,
  Description,
  Label,
  InputProps,
  Textarea,
  TextareaProps,
} from "@headlessui/react";

export type InputBaseProps = Omit<InputProps & TextareaProps, "as"> & {
  startIcon?: ReactNode;
  as?: Component | FunctionComponent | "input" | "textarea" | "select";
  endIcon?: ReactNode;
  disabled?: boolean;
  floatingPlaceholder?: boolean;
  label?: string;
  description?: string;
  className?: string;
  setValue?: (value: any) => void;
  options?: string[];
  error?: boolean | string;
  optional?: boolean;
};

const InputBase: React.FC<InputBaseProps> = ({
  startIcon,
  endIcon,
  as = "input",
  error = false,
  options,
  floatingPlaceholder = true,
  optional = false,
  setValue,
  ...props
}: InputBaseProps) => {
  // Add your component logic here
  const Component = (as as string) === "textarea" ? Textarea : Input;
  return (
    <Field
      disabled={props.disabled}
      className={`${props.className ?? ""} min-w-36`}
    >
      {props.label ? (
        <Label className="pb-2 block text-xs">{props.label}</Label>
      ) : null}
      <div className="relative w-full h-full">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-primaryLight">
            {startIcon}
          </div>
        )}
        <Component
          required={!optional}
          // @ts-ignore The value of as causes issues
          as={as}
          onChange={setValue && ((e: any) => setValue(e.target.value))}
          {...props}
          className={`${
            !props.label && floatingPlaceholder
              ? "peer focus:placeholder:opacity-0"
              : ""
          } rounded-2xl ${
            as === "textarea" ? "h-full py-3 focus:py-[11px]" : "h-11"
          } outline-none border focus:border-2 px-4 text-darkBlue ${
            error
              ? "input-error border-red-500"
              : "hover:border-primary focus:border-primary"
          } w-full ${startIcon ? "pl-12" : ""} ${endIcon ? "pr-12" : ""} ${
            props.disabled ? "bg-gray-200" : ""
          }`}
        >
          {options && as !== "input"
            ? options.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))
            : undefined}
        </Component>
        {!props.label && props.placeholder && floatingPlaceholder ? (
          <Label
            className={`block text-xs peer-placeholder-shown:opacity-0 peer-focus:opacity-100 transition-opacity absolute -top-2 left-3 bg-white px-1 text-darkGrayishBlue/75 ${
              error
                ? "text-red-600"
                : "peer-hover:text-primaryHover peer-focus:text-primaryHover"
            } peer-hover:font-normal peer-focus:font-normal z-20 font-semibold`}
          >
            {props.placeholder}
          </Label>
        ) : null}
        {endIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-primaryLight">
            {endIcon}
          </div>
        )}
      </div>
      {props.description ||
        (error && typeof error === "string" && (
          <Description className={`text-sm `}>
            {error ? (
              <p className={error ? "text-red-600" : ""}>{error}</p>
            ) : undefined}
            {props.description}
          </Description>
        ))}
    </Field>
  );
};

export default InputBase;
