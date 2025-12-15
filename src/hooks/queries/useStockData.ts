import { useQuery } from "@tanstack/react-query";
import { stockService } from "../../services/stockService";
import { queryKeys } from "../../lib/queryKeys";
import { showErrorToast } from "../../utils/toast";
import { CACHE_TIME } from "../../lib/cacheConfig";

export const useStockData = (symbol: string) => {
  return useQuery({
    queryKey: queryKeys.stocks.detail(symbol),
    queryFn: () => stockService.getStockData(symbol),
    staleTime: CACHE_TIME.FIVE_MINUTES,
    enabled: !!symbol,
    meta: {
      onError: () => {
        showErrorToast(
          "Error al cargar la información. Por favor, intenta nuevamente."
        );
      },
    },
  });
};
