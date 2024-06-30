import React, { ReactNode } from "react";
import {
  Field,
  Input,
  InputProps,
  Description,
  Label,
} from "@headlessui/react";

interface InputBaseProps extends InputProps {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  disabled?: boolean;
  label?: string;
  description?: string;
}

const InputBase: React.FC<InputBaseProps> = (props: InputBaseProps) => {
  // Add your component logic here

  return (
    <Field disabled={props.disabled}>
      {props.label && <Label>{props.label}</Label>}
      <Input
        {...props}
        className={`h-12 rounded-full ${props.className ?? ""}`}
      />
      {props.description && <Description>{props.description}</Description>}
    </Field>
  );
};

export default InputBase;
