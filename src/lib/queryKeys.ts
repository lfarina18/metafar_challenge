import type { IntervalType } from "../api/types";

export const queryKeys = {
  stocks: {
    all: ["stocks"] as const,
    lists: () => [...queryKeys.stocks.all, "list"] as const,
    list: (exchange: string) =>
      [...queryKeys.stocks.lists(), exchange] as const,
    details: () => [...queryKeys.stocks.all, "detail"] as const,
    detail: (symbol: string) =>
      [...queryKeys.stocks.details(), symbol] as const,
  },
  quotes: {
    all: ["quotes"] as const,
    detail: (params: {
      symbol: string;
      interval?: IntervalType;
      startDate?: string;
      endDate?: string;
    }) => [...queryKeys.quotes.all, params] as const,
    realtime: (params: {
      symbol: string;
      interval: IntervalType;
      day: string;
    }) => [...queryKeys.quotes.all, "realtime", params] as const,
  },
  search: {
    all: ["search"] as const,
    symbols: (query: string) =>
      [...queryKeys.search.all, "symbols", query] as const,
  },
} as const;

export type StockListQueryKey = ReturnType<typeof queryKeys.stocks.list>;
export type StockDetailQueryKey = ReturnType<typeof queryKeys.stocks.detail>;
export type QuoteDetailQueryKey = ReturnType<typeof queryKeys.quotes.detail>;
export type QuoteRealtimeQueryKey = ReturnType<
  typeof queryKeys.quotes.realtime
>;
export type QuoteQueryKey = QuoteDetailQueryKey | QuoteRealtimeQueryKey;
export type SearchSymbolsQueryKey = ReturnType<typeof queryKeys.search.symbols>;
