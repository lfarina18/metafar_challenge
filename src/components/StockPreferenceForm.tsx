import React from "react";
import {
  RadioButton,
  DateInput,
  IntervalSelect,
  Button,
} from "./atomics/index";
import type { Stock } from "../api/types";
import { Interval, type IntervalType } from "../api/types";
import { useStockData } from "../hooks/queries/useStockData";
import type { IStockPreferenceFormProps } from "../types";
import { getCurrentDay } from "../helpers";

const StockPreferenceForm: React.FC<IStockPreferenceFormProps> = ({
  onSubmit,
  symbol,
}) => {
  const [interval, setInterval] = React.useState<IntervalType>(
    Interval.FIVE_MIN
  );
  const [startDate, setStartDate] = React.useState<string>(getCurrentDay());
  const [endDate, setEndDate] = React.useState<string>(getCurrentDay());
  const [realTime, setRealTime] = React.useState<boolean>(true);

  const detailStockQuery = useStockData(symbol);
  const detailStock: Stock | undefined = detailStockQuery.data?.data?.[0];

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit({ interval, startDate, endDate, realTime });
    },
    [endDate, interval, onSubmit, realTime, startDate]
  );

  const handleIntervalChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setInterval(event.target.value as IntervalType);
    },
    []
  );

  const handleStartDateChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStartDate(event.target.value);
    },
    []
  );

  const handleEndDateChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEndDate(event.target.value);
    },
    []
  );

  const handleCheckboxChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // If the user selects "realtime", set the start and end date to the current day
      if (event.target.value === "realtime") {
        const date = getCurrentDay();
        setStartDate(date);
        setEndDate(date);
      }
      setRealTime(event.target.value === "realtime");
    },
    []
  );

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid #ccc",
        padding: "10px",
        marginBottom: "20px",
      }}
    >
      <div style={styles.headerContainer}>
        <div style={styles.headerTitle}>
          {symbol} - {detailStock?.name} - {detailStock?.currency}
        </div>
        <div
          style={{
            marginTop: "10px",
            fontSize: "18px",
            textAlign: "right",
          }}
        >
          Usuario: Juan
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={styles.radioContainer}>
          <RadioButton
            name="dataOption"
            value="realtime"
            checked={realTime}
            onChange={handleCheckboxChange}
            label="Tiempo Real"
          />
          <span style={styles.description}>
            (utiliza la fecha actual, al graficar esta opción, se debe
            actualizar el gráfico en forma automática según el intervalo
            seleccionado)
          </span>
        </div>
        <div style={styles.radioContainer}>
          <RadioButton
            name="dataOption"
            value="history"
            checked={!realTime}
            onChange={handleCheckboxChange}
            label="Histórico"
          />
          <div style={styles.dateInputContainer}>
            <DateInput
              disabled={realTime}
              value={startDate}
              onChange={handleStartDateChange}
              style={styles.dateInput}
            />
            <DateInput
              disabled={realTime}
              value={endDate}
              onChange={handleEndDateChange}
              style={styles.dateInput}
            />
          </div>
        </div>
        <IntervalSelect
          value={interval}
          onChange={handleIntervalChange}
          style={styles.intervalSelect}
        />
        <Button variant="contained" type="submit" style={styles.button}>
          Graficar
        </Button>
      </div>
    </form>
  );
};

const styles = {
  form: {},
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: "24px",
    marginBottom: "10px",
  },
  headerOptions: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginRight: "20px",
    marginBottom: "10px",
  },
  description: {
    fontSize: "12px",
    color: "#666",
    marginLeft: "5px",
  },
  radioContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  dateInputContainer: {
    margin: "0px 5px",
  },
  dateInput: {
    padding: "5px",
    fontSize: "14px",
    margin: "10px 0px",
  },
  intervalSelect: {
    padding: "5px",
    fontSize: "17px",
    marginBottom: "10px",
  },
  button: {
    padding: "5px 10px",
    fontSize: "14px",
    cursor: "pointer",
  },
  headerUser: {
    marginTop: "10px",
    fontSize: "18px",
    textAlign: "right",
  },
};

export default StockPreferenceForm;
