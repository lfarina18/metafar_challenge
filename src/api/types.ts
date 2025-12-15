export type ApiStatus = "ok" | "error";

export type InstrumentType =
  | "Common Stock"
  | "ETF"
  | "Index"
  | "Mutual Fund"
  | "Bond"
  | "Currency"
  | "Cryptocurrency"
  | string;

export enum Interval {
  ONE_MIN = "1min",
  FIVE_MIN = "5min",
  FIFTEEN_MIN = "15min",
  THIRTY_MIN = "30min",
  ONE_HOUR = "1h",
  ONE_DAY = "1day",
  ONE_WEEK = "1week",
  ONE_MONTH = "1month",
}

export type IntervalType = `${Interval}`;

export interface Stock {
  symbol: string;
  name: string;
  currency: string;
  type: string;
  exchange?: string;
  mic_code?: string;
  country?: string;
  figi_code?: string;
  cfi_code?: string;
  isin?: string;
  cusip?: string;
  access?: Access;
}

export interface Access {
  global: string;
  plan: string;
}

export interface StockListResponse {
  data: Stock[];
  status: ApiStatus;
}

export interface TimeSeriesMeta {
  symbol: string;
  interval: IntervalType;
  currency: string;
  exchange_timezone: string;
  exchange: string;
  mic_code: string;
  type: InstrumentType;
}

export interface TimeSeriesValue {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume?: string;
}

export interface TimeSeriesResponse {
  meta: TimeSeriesMeta;
  values: TimeSeriesValue[];
  status: ApiStatus;
}

export interface StockQuoteParams {
  symbol: string;
  interval?: IntervalType;
  start_date?: string;
  end_date?: string;
  outputsize?: number;
}

export interface SymbolSearchResult {
  symbol: string;
  instrument_name: string;
  exchange: string;
  mic_code: string;
  exchange_timezone: string;
  instrument_type: InstrumentType;
  country: string;
  currency: string;
}

export interface SymbolSearchResponse {
  data: SymbolSearchResult[];
  status: ApiStatus;
}

export interface ApiErrorResponse {
  code: number;
  message: string;
  status: "error";
}

export type ApiResponse<T> = T | ApiErrorResponse;
