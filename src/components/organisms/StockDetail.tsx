import { Alert, Box, Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";
import type { IStockData } from "../../types";
import type { StockQuotePreferences } from "../../types";
import { Interval } from "../../api/types";
import { getNowClampedToMarketStart, getTodayMarketStart } from "../../helpers";
import { useStockQuote } from "../../hooks/queries/useStockQuote";
import { useHistoricalChartToast } from "../../hooks/detail/useHistoricalChartToast";
import StockPreferenceForm from "./StockPreferenceForm";
import { RealTimeStatusBar } from "../molecules";
import { getPublicErrorMessage, isNoDataError } from "../../utils/toast";
import {
  type FC,
  lazy,
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";

const Chart = lazy(() => import("./StockChart"));

const StockDetail: FC = () => {
  const { symbol } = useParams<{ symbol?: string }>();
  const resolvedSymbol = symbol ?? "MELI";

  const [realTimePaused, setRealTimePaused] = useState<boolean>(false);

  const [preferences, setPreferences] = useState<StockQuotePreferences>(() => {
    const start = getTodayMarketStart();
    const now = getNowClampedToMarketStart();
    return {
      interval: Interval.FIVE_MIN,
      startDate: start,
      endDate: now,
      realTime: true,
    };
  });

  useEffect(() => {
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

  const historicalToast = useHistoricalChartToast({
    enabled: !preferences.realTime,
    isError: quoteQuery.isError,
    isSuccess: quoteQuery.isSuccess,
  });

  const handlePreferencesSubmit = useCallback(
    (next: StockQuotePreferences) => {
      setPreferences(next);
      if (!next.realTime) {
        historicalToast.show();
      }
    },
    [historicalToast],
  );

  const chartData: IStockData | null = useMemo(() => {
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
        <RealTimeStatusBar
          paused={realTimePaused}
          hasNoData={
            !realTimePaused &&
            quoteQuery.isError &&
            isNoDataError(quoteQuery.error)
          }
          isUpdating={
            !realTimePaused &&
            quoteQuery.isFetching &&
            !quoteQuery.isLoading &&
            !quoteQuery.isError
          }
          onTogglePause={() => setRealTimePaused((prev) => !prev)}
        />
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
        <Suspense
          fallback={
            <Box px={{ xs: 1.5, sm: 2 }} py={2}>
              <Skeleton variant="rectangular" height={320} />
            </Box>
          }
        >
          <Chart stockData={chartData} />
        </Suspense>
      ) : null}
    </>
  );
};

export default StockDetail;
