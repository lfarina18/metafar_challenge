import { z } from "zod";

export const AccessSchema = z.object({
  global: z.string(),
  plan: z.string(),
});

export const StockSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  currency: z.string(),
  exchange: z.string(),
  mic_code: z.string(),
  country: z.string(),
  type: z.string(),
  figi_code: z.string(),
  cfi_code: z.string(),
  isin: z.string(),
  cusip: z.string(),
  access: AccessSchema,
});

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

export const SymbolSearchResultSchema = z.object({
  symbol: z.string(),
  instrument_name: z.string(),
  exchange: z.string(),
  mic_code: z.string(),
  exchange_timezone: z.string(),
  instrument_type: z.string(),
  country: z.string(),
  currency: z.string(),
});

export const SymbolSearchResponseSchema = z.object({
  data: z.array(SymbolSearchResultSchema),
  status: z.literal("ok"),
});

export type Stock = z.infer<typeof StockSchema>;
export type StockListResponse = z.infer<typeof StockListResponseSchema>;
export type MetaStockData = z.infer<typeof MetaStockDataSchema>;
export type ValuesStockData = z.infer<typeof ValuesStockDataSchema>;
export type TimeSeriesResponse = z.infer<typeof TimeSeriesResponseSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
export type SymbolSearchResult = z.infer<typeof SymbolSearchResultSchema>;
export type SymbolSearchResponse = z.infer<typeof SymbolSearchResponseSchema>;
