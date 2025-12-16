import * as React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import type { IStockData } from "../types";
import type { StockQuotePreferences } from "../types";
import { Interval } from "../api/types";
import { getCurrentDay } from "../helpers";
import { useStockQuote } from "../hooks/queries/useStockQuote";
import StockPreferenceForm from "./StockPreferenceForm";

const Chart = React.lazy(() => import("./StockChart"));

const Detail: React.FC = () => {
  const navigate = useNavigate();
  const { symbol } = useParams<{ symbol?: string }>();
  const resolvedSymbol = symbol ?? "MELI";

  const [preferences, setPreferences] = React.useState<StockQuotePreferences>(
    () => {
      const today = getCurrentDay();
      return {
        interval: Interval.FIVE_MIN,
        startDate: today,
        endDate: today,
        realTime: true,
      };
    }
  );

  const quoteQuery = useStockQuote({
    symbol: resolvedSymbol,
    interval: preferences.interval,
    startDate: preferences.startDate,
    endDate: preferences.endDate,
    realTime: preferences.realTime,
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
      {chartData ? (
        <React.Suspense
          fallback={
            <Box display="flex" justifyContent="center" py={2}>
              <CircularProgress size={24} />
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
