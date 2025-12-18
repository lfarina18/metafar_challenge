import { IRadioButtonProps } from "../../types";
import type { FC } from "react";

const RadioButton: FC<IRadioButtonProps> = ({
  name,
  value,
  checked,
  onChange,
  label,
  id,
}) => (
  <label
    htmlFor={id ?? `${name}-${value}`}
    style={{ display: "flex", alignItems: "center", gap: "8px" }}
  >
    <input
      type="radio"
      id={id ?? `${name}-${value}`}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
    />
    {label}
  </label>
);

export default RadioButton;
