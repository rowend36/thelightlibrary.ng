import {
  Description,
  Field,
  Input,
  InputProps,
  Label,
  Textarea,
  TextareaProps,
} from "@headlessui/react";
import React, {
  ChangeEvent,
  Component,
  FunctionComponent,
  ReactNode,
} from "react";

export type InputBaseProps = Omit<InputProps & TextareaProps, "as"> & {
  startIcon?: ReactNode;
  as?: Component | FunctionComponent | "input" | "textarea" | "select";
  endIcon?: ReactNode;
  disabled?: boolean;
  floatingPlaceholder?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
  setValue?: (value: string) => void;
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
      className={`${props.className ?? ""} min-w-56 lg:min-w-72 xl:min-w-96`}
    >
      {props.label ? (
        <Label className="pb-2 block text-xs">{props.label}</Label>
      ) : null}
      <div className="relative w-full h-full">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 focus:text-primaryLight text-text group-[.search-dark]:text-gray-100">
            {startIcon}
          </div>
        )}
        <Component
          required={!optional}
          // @ts-expect-error The value of as causes issues
          as={as}
          onChange={
            setValue &&
            ((e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value))
          }
          {...props}
          className={`rounded-md outline-none border group-[.search-dark]:border-2 focus:border-2 px-4  w-full ${
            !props.label && floatingPlaceholder
              ? "peer focus:placeholder:opacity-0"
              : ""
          } ${as === "textarea" ? "h-full py-3 focus:py-[11px]" : "h-12"} ${
            error
              ? "input-error border-red-500"
              : !props.disabled
              ? "hover:border-primaryLight focus:border-primaryLight"
              : ""
          } ${startIcon ? "pl-12" : ""} ${endIcon ? "pr-12" : ""} ${
            props.disabled
              ? "bg-gray-200 text-gray-500"
              : "bg-gray-100 text-text"
          }`}
        >
          {props.children ??
            (options && as !== "input"
              ? options.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))
              : undefined)}
        </Component>
        {!props.label && props.placeholder && floatingPlaceholder ? (
          <Label
            className={`block text-xs peer-placeholder-shown:opacity-0 peer-focus:opacity-100 transition-opacity absolute -top-2 left-3 bg-[rgb(var(--background-rgb))] px-1 ${
              error
                ? "text-red-600"
                : "peer-hover:text-primaryLight peer-focus:text-primaryLight"
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
      {(props.description || (error && typeof error === "string")) && (
        <Description className={`text-sm mt-2 text-text`} as="div">
          {error ? (
            <p className={error ? "text-red-600" : ""}>{error}</p>
          ) : undefined}
          {props.description}
        </Description>
      )}
    </Field>
  );
};

export default InputBase;
