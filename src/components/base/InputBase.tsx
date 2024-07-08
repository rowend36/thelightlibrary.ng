import React, { ReactNode } from "react";
import {
  Field,
  Input,
  Description,
  Label,
  InputProps,
} from "@headlessui/react";

export interface InputBaseProps extends InputProps {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

const InputBase: React.FC<InputBaseProps> = ({
  startIcon,
  endIcon,
  ...props
}: InputBaseProps) => {
  // Add your component logic here

  return (
    <Field
      disabled={props.disabled}
      className={`${props.className ?? ""} min-w-36`}
    >
      {props.label && (
        <Label className="pb-2 block text-xs">{props.label}</Label>
      )}
      <div className="relative h-12 w-full">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-primaryLight">
            {startIcon}
          </div>
        )}
        <Input
          {...props}
          className={`h-full rounded-2xl outline-none border hover:border-2 px-4 text-darkBlue hover:border-primary w-full ${
            startIcon ? "pl-12" : ""
          } ${endIcon ? "pr-12" : ""} ${props.disabled ? "bg-gray-200" : ""}`}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-primaryLight">
            {endIcon}
          </div>
        )}
      </div>
      {props.description && <Description>{props.description}</Description>}
    </Field>
  );
};

export default InputBase;
