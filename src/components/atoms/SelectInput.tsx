import { ISelectInputProps } from "../../types";
import type { FC } from "react";

const SelectInput: FC<ISelectInputProps> = ({
  value,
  onChange,
  options,
  id,
  ariaLabel,
}) => (
  <select
    id={id}
    aria-label={ariaLabel}
    value={value}
    onChange={onChange}
    style={styles.select}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const styles = {
  select: {
    width: "100%",
    maxWidth: "12rem",
    height: "2.25rem",
  },
};

export default SelectInput;
