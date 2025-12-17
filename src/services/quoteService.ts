import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import {
  Interval,
  type QuoteParams,
  type QuoteResponse,
  type StockQuoteParams,
  type TimeSeriesResponse,
} from "../api/types";
import { QuoteResponseSchema, TimeSeriesResponseSchema } from "../api/schemas";
import { validateResponse } from "./shared/validateResponse";
import type { RequestOptions } from "./shared/requestOptions";

export const quoteService = {
  getQuote: async (
    params: QuoteParams,
    options?: RequestOptions
  ): Promise<QuoteResponse> => {
    const { data } = await apiClient.get(ENDPOINTS.QUOTE, {
      params,
      signal: options?.signal,
    });

    return validateResponse(data, QuoteResponseSchema);
  },

  getStockQuote: async (
    params: StockQuoteParams,
    options?: RequestOptions
  ): Promise<TimeSeriesResponse> => {
    const {
      symbol,
      interval = Interval.FIVE_MIN,
      start_date,
      end_date,
      outputsize = 30,
    } = params;

    const apiParams: Record<string, string | number> = {
      symbol,
      interval,
      outputsize,
    };

    if (start_date && end_date) {
      const startDateOnly = start_date.split("T")[0];
      const endDateOnly = end_date.split("T")[0];

      if (startDateOnly === endDateOnly) {
        apiParams.date = startDateOnly;
      } else {
        apiParams.start_date = startDateOnly;
        apiParams.end_date = endDateOnly;
      }
    }

    const { data } = await apiClient.get(ENDPOINTS.TIME_SERIES, {
      params: apiParams,
      signal: options?.signal,
    });

    return validateResponse(data, TimeSeriesResponseSchema);
  },
};
