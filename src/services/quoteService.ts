import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import {
  Interval,
  type StockQuoteParams,
  type TimeSeriesResponse,
} from "../api/types";
import { TimeSeriesResponseSchema } from "../api/schemas";
import { validateResponse } from "./shared/validateResponse";

export const quoteService = {
  getStockQuote: async (
    params: StockQuoteParams
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
      if (start_date === end_date) {
        const dateOnly = start_date.split("T")[0];
        apiParams.date = dateOnly;
      } else {
        const startDateOnly = start_date.split("T")[0];
        const endDateOnly = end_date.split("T")[0];
        apiParams.start_date = startDateOnly;
        apiParams.end_date = endDateOnly;
      }
    }

    const { data } = await apiClient.get(ENDPOINTS.TIME_SERIES, {
      params: apiParams,
    });

    return validateResponse(data, TimeSeriesResponseSchema);
  },
};
