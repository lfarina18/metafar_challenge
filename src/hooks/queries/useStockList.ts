import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { CACHE_TIME } from "../../lib/cacheConfig";
import { showErrorToast } from "../../utils/toast";
import { stockService } from "../../services/stockService";

export const useStockList = (exchange: string = "NASDAQ") => {
  return useQuery({
    queryKey: queryKeys.stocks.list(exchange),
    queryFn: () => stockService.getStockList(exchange),
    staleTime: CACHE_TIME.INFINITE,
    gcTime: CACHE_TIME.INFINITE,
    placeholderData: (previousData) => previousData,
    meta: {
      onError: () => {
        showErrorToast(
          "Error al cargar la lista de acciones. Por favor, recarga la página."
        );
      },
    },
  });
};
