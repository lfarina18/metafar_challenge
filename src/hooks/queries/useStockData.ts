import { useQuery } from "@tanstack/react-query";
import { stockService } from "../../services/stockService";
import { queryKeys } from "../../lib/queryKeys";
import type { StockDetailQueryKey } from "../../lib/queryKeys";
import { getPublicErrorMessage, showErrorToast } from "../../utils/toast";
import { CACHE_TIME } from "../../lib/cacheConfig";
import type { StockListResponse } from "../../api/types";

export const useStockData = (symbol: string) => {
  return useQuery<
    StockListResponse,
    unknown,
    StockListResponse,
    StockDetailQueryKey
  >({
    queryKey: queryKeys.stocks.detail(symbol),
    queryFn: ({ signal }) => stockService.getStockData(symbol, { signal }),
    staleTime: CACHE_TIME.FIVE_MINUTES,
    enabled: !!symbol,
    meta: {
      onError: (err: unknown) => {
        showErrorToast(getPublicErrorMessage(err));
      },
    },
  });
};
