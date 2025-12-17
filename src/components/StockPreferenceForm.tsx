import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { RadioButton, DateInput, Button } from "./atoms";
import { IntervalSelect, StockPreferenceHeader } from "./molecules";
import type { Stock } from "../api/types";
import { Interval, type IntervalType } from "../api/types";
import { useStockData } from "../hooks/queries/useStockData";
import type { IStockPreferenceFormProps } from "../types";
import { getNowClampedToMarketStart, getTodayMarketStart } from "../helpers";
import { useNavigate } from "react-router-dom";

const StockPreferenceForm: React.FC<IStockPreferenceFormProps> = ({
  onSubmit,
  symbol,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [interval, setInterval] = React.useState<IntervalType>(
    Interval.FIVE_MIN
  );
  const [startDate, setStartDate] = React.useState<string>(
    getTodayMarketStart()
  );
  const [endDate, setEndDate] = React.useState<string>(
    getNowClampedToMarketStart()
  );
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
        setStartDate(getTodayMarketStart());
        setEndDate(getNowClampedToMarketStart());
      }
      setRealTime(event.target.value === "realtime");
    },
    []
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid #ccc",
        pb: 2,
        mb: 2,
        gap: 2,
      }}
    >
      <StockPreferenceHeader
        symbol={symbol}
        name={detailStock?.name}
        currency={detailStock?.currency}
        onBack={() => navigate("/")}
      />

      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <RadioButton
              name="dataOption"
              value="realtime"
              checked={realTime}
              onChange={handleCheckboxChange}
              label="Tiempo Real"
            />
            <Box component="span" sx={styles.description}>
              (utiliza la fecha actual, al graficar esta opción, se debe
              actualizar el gráfico en forma automática según el intervalo
              seleccionado)
            </Box>
          </Box>

          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            gap={1}
            flexWrap="wrap"
          >
            <RadioButton
              name="dataOption"
              value="history"
              checked={!realTime}
              onChange={handleCheckboxChange}
              label="Histórico"
            />
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={1}
              flexWrap="wrap"
              alignItems={{ sm: "center" }}
              sx={{ width: "100%" }}
            >
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                gap={1}
                alignItems={{ sm: "center" }}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                <label htmlFor="start-date" style={styles.dateInputLabel}>
                  Desde
                </label>
                <DateInput
                  id="start-date"
                  ariaLabel="Desde"
                  disabled={realTime}
                  value={startDate}
                  onChange={handleStartDateChange}
                  style={
                    isMobile
                      ? { width: "100%" }
                      : { width: "12rem", maxWidth: "12rem" }
                  }
                />
              </Box>

              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                gap={1}
                alignItems={{ sm: "center" }}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                <label htmlFor="end-date" style={styles.dateInputLabel}>
                  Hasta
                </label>
                <DateInput
                  id="end-date"
                  ariaLabel="Hasta"
                  disabled={realTime}
                  value={endDate}
                  onChange={handleEndDateChange}
                  style={
                    isMobile
                      ? { width: "100%" }
                      : { width: "12rem", maxWidth: "12rem" }
                  }
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          <IntervalSelect
            value={interval}
            onChange={handleIntervalChange}
            style={{ marginBottom: 0 }}
          />
          <Box
            display="flex"
            justifyContent={{ xs: "stretch", sm: "flex-start" }}
            sx={{ width: "100%" }}
          >
            <Button
              variant="contained"
              type="submit"
              style={
                isMobile
                  ? { width: "100%" }
                  : { width: "14rem", maxWidth: "14rem" }
              }
            >
              Graficar
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
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
  dateInputLabel: {
    fontSize: "12px",
    color: "#666",
    marginRight: "6px",
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
