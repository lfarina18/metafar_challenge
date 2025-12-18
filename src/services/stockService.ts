import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import type { StockListResponse } from "../api/types";
import { StockListResponseSchema } from "../api/schemas";
import { validateResponse } from "./shared/validateResponse";
import type { RequestOptions } from "./shared/requestOptions";

export const stockService = {
  getStockList: async (
    exchange: string = "NASDAQ",
    options?: RequestOptions,
  ): Promise<StockListResponse> => {
    const { data } = await apiClient.get(ENDPOINTS.STOCKS, {
      params: {
        source: "docs",
        exchange,
      },
      signal: options?.signal,
    });

    return validateResponse(data, StockListResponseSchema);
  },

  getStockData: async (
    symbol: string,
    options?: RequestOptions,
  ): Promise<StockListResponse> => {
    const { data } = await apiClient.get(ENDPOINTS.STOCKS, {
      params: {
        source: "docs",
        symbol,
      },
      signal: options?.signal,
    });

    return validateResponse(data, StockListResponseSchema);
  },
};
