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
      interval?: string;
      startDate?: string;
      endDate?: string;
    }) => [...queryKeys.quotes.all, params] as const,
  },
  search: {
    all: ["search"] as const,
    symbols: (query: string) =>
      [...queryKeys.search.all, "symbols", query] as const,
  },
} as const;
