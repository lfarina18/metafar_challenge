import * as React from "react";
import { IRadioButtonProps } from "../../types";

const RadioButton: React.FC<IRadioButtonProps> = ({
  name,
  value,
  checked,
  onChange,
  label,
  id,
}) => (
  <>
    <input
      type="radio"
      id={id ?? `${name}-${value}`}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
    />
    <label htmlFor={id ?? `${name}-${value}`}>{label}</label>
  </>
);

export default RadioButton;
