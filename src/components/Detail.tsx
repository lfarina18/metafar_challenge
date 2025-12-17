import * as React from "react";
import { Alert, Box, Button, Skeleton, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import type { IStockData } from "../types";
import type { StockQuotePreferences } from "../types";
import { Interval } from "../api/types";
import { getNowClampedToMarketStart, getTodayMarketStart } from "../helpers";
import { useStockQuote } from "../hooks/queries/useStockQuote";
import StockPreferenceForm from "./StockPreferenceForm";
import {
  dismissToast,
  getPublicErrorMessage,
  isNoDataError,
  showLoadingToast,
  showSuccessToast,
} from "../utils/toast";

const Chart = React.lazy(() => import("./StockChart"));

const Detail: React.FC = () => {
  const { symbol } = useParams<{ symbol?: string }>();
  const resolvedSymbol = symbol ?? "MELI";

  const [realTimePaused, setRealTimePaused] = React.useState<boolean>(false);
  const [historicalToastId, setHistoricalToastId] = React.useState<
    string | null
  >(null);

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

  React.useEffect(() => {
    if (!historicalToastId) return;

    if (quoteQuery.isError) {
      dismissToast(historicalToastId);
      setHistoricalToastId(null);
      return;
    }

    if (quoteQuery.isSuccess) {
      dismissToast(historicalToastId);
      setHistoricalToastId(null);
      showSuccessToast("Gráfico actualizado");
    }
  }, [historicalToastId, quoteQuery.isError, quoteQuery.isSuccess]);

  const handlePreferencesSubmit = React.useCallback(
    (next: StockQuotePreferences) => {
      setPreferences(next);
      if (!next.realTime) {
        const toastId = showLoadingToast("Cargando gráfico...");
        setHistoricalToastId(toastId);
      }
    },
    []
  );

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
      <Box px={{ xs: 1.5, sm: 2 }}>
        <StockPreferenceForm
          symbol={resolvedSymbol}
          onSubmit={handlePreferencesSubmit}
        />
      </Box>

      {preferences.realTime ? (
        <Box
          px={{ xs: 1.5, sm: 2 }}
          py={1}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
          role="status"
          aria-live="polite"
        >
          {(() => {
            const hasNoData =
              !realTimePaused &&
              quoteQuery.isError &&
              isNoDataError(quoteQuery.error);

            const isUpdating =
              !realTimePaused &&
              quoteQuery.isFetching &&
              !quoteQuery.isLoading &&
              !quoteQuery.isError;

            return (
              <Typography variant="body2" color="text.secondary">
                Tiempo real: {realTimePaused ? "Pausado" : "Activo"}
                {hasNoData
                  ? " (sin datos)"
                  : isUpdating
                  ? " (actualizando...)"
                  : ""}
              </Typography>
            );
          })()}

          <Button
            size="small"
            variant={realTimePaused ? "contained" : "outlined"}
            onClick={() => setRealTimePaused((prev) => !prev)}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {realTimePaused ? "Reanudar" : "Pausar"}
          </Button>
        </Box>
      ) : null}

      {quoteQuery.isError &&
      preferences.realTime &&
      isNoDataError(quoteQuery.error) ? (
        <Box px={{ xs: 1.5, sm: 2 }} py={2} role="status" aria-live="polite">
          <Alert severity="info">
            No hay datos disponibles para la fecha y hora actual.
          </Alert>
        </Box>
      ) : quoteQuery.isError ? (
        <Box px={{ xs: 1.5, sm: 2 }} py={2} role="alert" aria-live="assertive">
          <Alert severity="error">
            {getPublicErrorMessage(quoteQuery.error)}
          </Alert>
        </Box>
      ) : quoteQuery.isLoading && !chartData ? (
        <Box px={{ xs: 1.5, sm: 2 }} py={2}>
          <Skeleton variant="rectangular" height={320} />
        </Box>
      ) : chartData ? (
        <React.Suspense
          fallback={
            <Box px={{ xs: 1.5, sm: 2 }} py={2}>
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
