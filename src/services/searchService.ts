import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import type { SymbolSearchResponse } from "../api/types";
import { SymbolSearchResponseSchema } from "../api/schemas";
import { validateResponse } from "./shared/validateResponse";
import type { RequestOptions } from "./shared/requestOptions";

export const searchService = {
  searchSymbols: async (
    symbol: string,
    options?: {
      outputsize?: number;
    },
    requestOptions?: RequestOptions,
  ): Promise<SymbolSearchResponse> => {
    const { outputsize = 30 } = options ?? {};

    const { data } = await apiClient.get(ENDPOINTS.SYMBOL_SEARCH, {
      params: {
        symbol,
        outputsize,
      },
      signal: requestOptions?.signal,
    });

    return validateResponse(data, SymbolSearchResponseSchema);
  },
};
