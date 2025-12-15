import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import type { StockListResponse } from "../api/types";
import { StockListResponseSchema } from "../api/schemas";
import { validateResponse } from "./shared/validateResponse";

export const stockService = {
  getStockList: async (
    exchange: string = "NASDAQ"
  ): Promise<StockListResponse> => {
    const { data } = await apiClient.get(ENDPOINTS.STOCKS, {
      params: {
        source: "docs",
        exchange,
      },
    });

    return validateResponse(data, StockListResponseSchema);
  },

  getStockData: async (symbol: string): Promise<StockListResponse> => {
    const { data } = await apiClient.get(ENDPOINTS.STOCKS, {
      params: {
        source: "docs",
        symbol,
      },
    });

    return validateResponse(data, StockListResponseSchema);
  },
};
