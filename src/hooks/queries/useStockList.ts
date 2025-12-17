import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import type { StockListQueryKey } from "../../lib/queryKeys";
import { CACHE_TIME } from "../../lib/cacheConfig";
import { getPublicErrorMessage, showErrorToast } from "../../utils/toast";
import { stockService } from "../../services/stockService";
import type { StockListResponse } from "../../api/types";

export const useStockList = (exchange: string = "NASDAQ") => {
  return useQuery<
    StockListResponse,
    unknown,
    StockListResponse,
    StockListQueryKey
  >({
    queryKey: queryKeys.stocks.list(exchange),
    queryFn: ({ signal }) => stockService.getStockList(exchange, { signal }),
    staleTime: CACHE_TIME.INFINITE,
    gcTime: CACHE_TIME.INFINITE,
    placeholderData: (previousData) => previousData,
    meta: {
      onError: (err: unknown) => {
        showErrorToast(getPublicErrorMessage(err));
      },
    },
  });
};
