import * as React from "react";
import { IDateInputProps } from "../../types";

const DateInput: React.FC<IDateInputProps> = ({
  disabled,
  value,
  onChange,
  id,
  ariaLabel,
  style,
}) => (
  <input
    id={id}
    aria-label={ariaLabel}
    type="datetime-local"
    disabled={disabled}
    value={value}
    onChange={onChange}
    style={{ ...styles.dateInput, ...style }}
  />
);

const styles = {
  datePickers: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  dateInput: {
    padding: "5px",
    fontSize: "14px",
    width: "12rem",
    maxWidth: "100%",
  },
};

export default DateInput;
