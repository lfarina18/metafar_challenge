import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { CACHE_TIME } from "../../lib/cacheConfig";
import { getPublicErrorMessage, showErrorToast } from "../../utils/toast";
import { stockService } from "../../services/stockService";

export const useStockList = (exchange: string = "NASDAQ") => {
  return useQuery({
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
