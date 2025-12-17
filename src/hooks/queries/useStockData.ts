import { useQuery } from "@tanstack/react-query";
import { stockService } from "../../services/stockService";
import { queryKeys } from "../../lib/queryKeys";
import { getPublicErrorMessage, showErrorToast } from "../../utils/toast";
import { CACHE_TIME } from "../../lib/cacheConfig";

export const useStockData = (symbol: string) => {
  return useQuery({
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
