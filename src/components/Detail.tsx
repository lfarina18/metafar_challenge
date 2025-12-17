import * as React from "react";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import type { IStockData } from "../types";
import type { StockQuotePreferences } from "../types";
import { Interval } from "../api/types";
import { getNowClampedToMarketStart, getTodayMarketStart } from "../helpers";
import { useStockQuote } from "../hooks/queries/useStockQuote";
import StockPreferenceForm from "./StockPreferenceForm";
import { getPublicErrorMessage, isNoDataError } from "../utils/toast";

const Chart = React.lazy(() => import("./StockChart"));

const Detail: React.FC = () => {
  const navigate = useNavigate();
  const { symbol } = useParams<{ symbol?: string }>();
  const resolvedSymbol = symbol ?? "MELI";

  const [realTimePaused, setRealTimePaused] = React.useState<boolean>(false);

  const [preferences, setPreferences] = React.useState<StockQuotePreferences>(
    () => {
      const start = getTodayMarketStart();
      const now = getNowClampedToMarketStart();
      return {
        interval: Interval.FIVE_MIN,
        startDate: start,
        endDate: now,
        realTime: true,
      };
    }
  );

  React.useEffect(() => {
    if (!preferences.realTime) {
      setRealTimePaused(false);
    }
  }, [preferences.realTime]);

  const quoteQuery = useStockQuote({
    symbol: resolvedSymbol,
    interval: preferences.interval,
    startDate: preferences.startDate,
    endDate: preferences.endDate,
    realTime: preferences.realTime,
    paused: preferences.realTime ? realTimePaused : false,
    enabled: true,
  });

  const chartData: IStockData | null = React.useMemo(() => {
    const stockData = quoteQuery.data;
    if (!stockData) return null;

    return {
      meta: {
        symbol: stockData.meta.symbol,
        interval: stockData.meta.interval,
        currency: stockData.meta.currency,
        exchange_timezone: stockData.meta.exchange_timezone,
        mic_code: stockData.meta.mic_code,
        exchange: stockData.meta.exchange,
        type: stockData.meta.type,
      },
      values: stockData.values.map((v) => ({
        datetime: v.datetime,
        open: v.open,
        high: v.high,
        low: v.low,
        close: v.close,
        volume: v.volume ?? "0",
      })),
      status: stockData.status,
    };
  }, [quoteQuery.data]);

  return (
    <>
      <Box px={2} pt={2}>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Volver
        </Button>
      </Box>
      <StockPreferenceForm symbol={resolvedSymbol} onSubmit={setPreferences} />

      {preferences.realTime ? (
        <Box
          px={2}
          py={1}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          role="status"
          aria-live="polite"
        >
          {(() => {
            const hasNoData =
              !realTimePaused &&
              quoteQuery.isError &&
              isNoDataError(quoteQuery.error);

            return (
              <Typography variant="body2" color="text.secondary">
                Tiempo real: {realTimePaused ? "Pausado" : "Activo"}
                {hasNoData ? " (sin datos)" : ""}
              </Typography>
            );
          })()}

          <Button
            size="small"
            variant={realTimePaused ? "contained" : "outlined"}
            onClick={() => setRealTimePaused((prev) => !prev)}
          >
            {realTimePaused ? "Reanudar" : "Pausar"}
          </Button>
        </Box>
      ) : null}

      {quoteQuery.isError &&
      preferences.realTime &&
      isNoDataError(quoteQuery.error) ? (
        <Box px={2} py={2} role="status" aria-live="polite">
          No hay datos disponibles para la fecha y hora actual.
        </Box>
      ) : quoteQuery.isError ? (
        <Box px={2} py={2} role="alert" aria-live="assertive">
          {getPublicErrorMessage(quoteQuery.error)}
        </Box>
      ) : quoteQuery.isLoading && !chartData ? (
        <Box px={2} py={2}>
          <Skeleton variant="rectangular" height={320} />
        </Box>
      ) : chartData ? (
        <React.Suspense
          fallback={
            <Box px={2} py={2}>
              <Skeleton variant="rectangular" height={320} />
            </Box>
          }
        >
          <Chart stockData={chartData} />
        </React.Suspense>
      ) : null}
    </>
  );
};

export default Detail;
