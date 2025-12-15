import * as React from "react";
import { StockPreferenceForm, Chart } from "./index";

import { useParams } from "react-router-dom";
import { IStockData } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { stockService } from "../services/stockService";
import { CACHE_TIME } from "../lib/cacheConfig";

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
      {stockData && <Chart stockData={stockData} />}
    </>
  );
};

export default Detail;
