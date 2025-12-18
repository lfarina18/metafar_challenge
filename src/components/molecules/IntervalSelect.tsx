import SelectInput from "../atoms/SelectInput";
import { IntervalSelectProps } from "../../types";
import type { FC } from "react";

const IntervalSelect: FC<IntervalSelectProps> = ({
  value,
  onChange,
  style,
}) => {
  const id = "interval-select";
  const options = [
    { value: "1min", label: "1 minuto" },
    { value: "5min", label: "5 minutos" },
    { value: "15min", label: "15 minutos" },
  ];

  return (
    <div style={style}>
      <label htmlFor={id} style={styles.label}>
        Intervalo:
      </label>
      <SelectInput
        id={id}
        ariaLabel="Intervalo"
        value={value}
        onChange={onChange}
        options={options}
      />
    </div>
  );
};

const styles = {
  label: {
    marginRight: "5px",
  },
};

export default IntervalSelect;
