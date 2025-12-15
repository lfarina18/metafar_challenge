import { useQuery } from "@tanstack/react-query";
import { CACHE_TIME } from "../../lib/cacheConfig";
import { queryKeys } from "../../lib/queryKeys";
import useDebounce from "../useDebounce";
import { showErrorToast } from "../../utils/toast";
import { searchService } from "../../services/searchService";

export const useStockSearch = (
  query: string,
  options?: {
    enabled?: boolean;
    debounceMs?: number;
    outputsize?: number;
  }
) => {
  const { enabled = true, debounceMs = 400, outputsize = 30 } = options ?? {};

  const debouncedQuery = useDebounce(query, debounceMs).trim();
  const shouldFetch = enabled && debouncedQuery.length > 0;

  return useQuery({
    queryKey: queryKeys.search.symbols(debouncedQuery),
    queryFn: () => searchService.searchSymbols(debouncedQuery, { outputsize }),
    enabled: shouldFetch,
    staleTime: CACHE_TIME.ONE_MINUTE,
    gcTime: CACHE_TIME.FIVE_MINUTES,
    placeholderData: (previousData) => previousData,
    meta: {
      onError: () => {
        showErrorToast(
          "Error al buscar símbolos. Por favor, intenta nuevamente."
        );
      },
    },
  });
};
