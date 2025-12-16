import * as React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { IStockData } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { stockService } from "../services/stockService";
import { CACHE_TIME } from "../lib/cacheConfig";
import StockPreferenceForm from "./StockPreferenceForm";

const Chart = React.lazy(() => import("./StockChart"));

const Detail: React.FC = () => {
  const { symbol } = useParams<{ symbol?: string }>();
  const [stockData, setStockData] = React.useState<IStockData | null>(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!symbol) return;

    void queryClient
      .prefetchQuery({
        queryKey: queryKeys.stocks.detail(symbol),
        queryFn: ({ signal }) => stockService.getStockData(symbol, { signal }),
        staleTime: CACHE_TIME.FIVE_MINUTES,
      })
      .catch(() => undefined);
  }, [queryClient, symbol]);

  return (
    <>
      <StockPreferenceForm
        symbol={symbol || "MELI"} // if symbol is undefined, use "MELI" as default value
        handleSetStockData={setStockData}
      />
      {stockData ? (
        <React.Suspense
          fallback={
            <Box display="flex" justifyContent="center" py={2}>
              <CircularProgress size={24} />
            </Box>
          }
        >
          <Chart stockData={stockData} />
        </React.Suspense>
      ) : null}
    </>
  );
};

export default Detail;
