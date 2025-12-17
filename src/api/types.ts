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

export interface FiftyTwoWeekRange {
  low: string;
  high: string;
  low_change: string;
  high_change: string;
  low_change_percent: string;
  high_change_percent: string;
  range: string;
}

export interface QuoteResponse {
  symbol: string;
  name: string;
  exchange: string;
  mic_code: string;
  currency: string;
  datetime: string;
  timestamp: number;
  last_quote_at: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  previous_close?: string;
  change?: string;
  percent_change?: string;
  average_volume?: string;
  rolling_1d_change?: string;
  rolling_7d_change?: string;
  rolling_change?: string;
  is_market_open?: boolean;
  fifty_two_week?: FiftyTwoWeekRange;
  extended_change?: string;
  extended_percent_change?: string;
  extended_price?: string;
  extended_timestamp?: string;
}

export interface QuoteParams {
  symbol: string;
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
  access?: Access;
}

export interface SymbolSearchResponse {
  data: SymbolSearchResult[];
  status: ApiStatus;
}

export interface ApiErrorResponse {
  code?: number;
  message: string;
  status: "error";
}

export type ApiResponse<T> = T | ApiErrorResponse;
