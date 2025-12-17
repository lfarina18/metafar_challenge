import { z } from "zod";

export const AccessSchema = z.object({
  global: z.string(),
  plan: z.string(),
});

export const StockSchema = z
  .object({
    symbol: z.string(),
    name: z.string(),
    currency: z.string(),
    type: z.string(),
    exchange: z.string().optional(),
    mic_code: z.string().optional(),
    country: z.string().optional(),
    figi_code: z.string().optional(),
    cfi_code: z.string().optional(),
    isin: z.string().optional(),
    cusip: z.string().optional(),
    access: AccessSchema.optional(),
  })
  .passthrough();

export const StockListResponseSchema = z.object({
  data: z.array(StockSchema),
  status: z.literal("ok"),
});

export const MetaStockDataSchema = z.object({
  symbol: z.string(),
  interval: z.enum([
    "1min",
    "5min",
    "15min",
    "30min",
    "1h",
    "1day",
    "1week",
    "1month",
  ]),
  currency: z.string(),
  exchange_timezone: z.string(),
  exchange: z.string(),
  mic_code: z.string(),
  type: z.string(),
});

export const ValuesStockDataSchema = z.object({
  datetime: z.string(),
  open: z.string(),
  high: z.string(),
  low: z.string(),
  close: z.string(),
  volume: z.string().optional(),
});

export const TimeSeriesResponseSchema = z.object({
  meta: MetaStockDataSchema,
  values: z.array(ValuesStockDataSchema),
  status: z.literal("ok"),
});

export const ApiErrorResponseSchema = z.object({
  status: z.literal("error"),
  message: z.string(),
  code: z.number().optional(),
});

export const SymbolSearchResultSchema = z
  .object({
    symbol: z.string(),
    instrument_name: z.string(),
    exchange: z.string(),
    mic_code: z.string(),
    exchange_timezone: z.string(),
    instrument_type: z.string(),
    country: z.string(),
    currency: z.string(),
    access: AccessSchema.optional(),
  })
  .passthrough();

export const SymbolSearchResponseSchema = z.object({
  data: z.array(SymbolSearchResultSchema),
  status: z.literal("ok"),
});

export const FiftyTwoWeekRangeSchema = z.object({
  low: z.string(),
  high: z.string(),
  low_change: z.string(),
  high_change: z.string(),
  low_change_percent: z.string(),
  high_change_percent: z.string(),
  range: z.string(),
});

export const QuoteResponseSchema = z
  .object({
    symbol: z.string(),
    name: z.string(),
    exchange: z.string(),
    mic_code: z.string(),
    currency: z.string(),
    datetime: z.string(),
    timestamp: z.number(),
    last_quote_at: z.number(),
    open: z.string(),
    high: z.string(),
    low: z.string(),
    close: z.string(),
    volume: z.string(),
    previous_close: z.string().optional(),
    change: z.string().optional(),
    percent_change: z.string().optional(),
    average_volume: z.string().optional(),
    rolling_1d_change: z.string().optional(),
    rolling_7d_change: z.string().optional(),
    rolling_change: z.string().optional(),
    is_market_open: z.boolean().optional(),
    fifty_two_week: FiftyTwoWeekRangeSchema.optional(),
    extended_change: z.string().optional(),
    extended_percent_change: z.string().optional(),
    extended_price: z.string().optional(),
    extended_timestamp: z.string().optional(),
  })
  .passthrough();

export type Stock = z.infer<typeof StockSchema>;
export type StockListResponse = z.infer<typeof StockListResponseSchema>;
export type MetaStockData = z.infer<typeof MetaStockDataSchema>;
export type ValuesStockData = z.infer<typeof ValuesStockDataSchema>;
export type TimeSeriesResponse = z.infer<typeof TimeSeriesResponseSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
export type SymbolSearchResult = z.infer<typeof SymbolSearchResultSchema>;
export type SymbolSearchResponse = z.infer<typeof SymbolSearchResponseSchema>;
export type FiftyTwoWeekRange = z.infer<typeof FiftyTwoWeekRangeSchema>;
export type QuoteResponse = z.infer<typeof QuoteResponseSchema>;
