import { queryClient } from "./queryClient";
import { queryKeys } from "./queryKeys";
import type { IntervalType } from "../api/types";

export const invalidateStockList = async (exchange: string = "NASDAQ") => {
  await queryClient.invalidateQueries({
    queryKey: queryKeys.stocks.list(exchange),
  });
};

export const invalidateStockDetail = async (symbol: string) => {
  await queryClient.invalidateQueries({
    queryKey: queryKeys.stocks.detail(symbol),
  });
};

export const invalidateStockQuote = async (params: {
  symbol: string;
  interval?: IntervalType;
  startDate?: string;
  endDate?: string;
}) => {
  await queryClient.invalidateQueries({
    queryKey: queryKeys.quotes.detail(params),
  });
};

export const invalidateSymbolSearch = async (query: string) => {
  await queryClient.invalidateQueries({
    queryKey: queryKeys.search.symbols(query),
  });
};
