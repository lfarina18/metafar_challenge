import type { IStock } from "../../types";
import type { SymbolSearchResult, StockListResponse } from "../../api/types";
import { useStockData } from "../queries/useStockData";
import { useStockList } from "../queries/useStockList";
import { useMemo } from "react";

interface UseStockTableDataParams {
  exchange: string;
  selectedSymbol: SymbolSearchResult | null;
}

interface UseStockTableDataResult {
  stocks: IStock[];
  data: StockListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export const useStockTableData = ({
  exchange,
  selectedSymbol,
}: UseStockTableDataParams): UseStockTableDataResult => {
  const stockListQuery = useStockList(exchange);
  const stockDataQuery = useStockData(selectedSymbol?.symbol ?? "");

  const data = selectedSymbol ? stockDataQuery.data : stockListQuery.data;
  const isLoading = selectedSymbol
    ? stockDataQuery.isLoading
    : stockListQuery.isLoading;
  const isError = selectedSymbol
    ? stockDataQuery.isError
    : stockListQuery.isError;
  const error = selectedSymbol ? stockDataQuery.error : stockListQuery.error;

  const stocks: IStock[] = useMemo(() => {
    const rows =
      selectedSymbol && data?.data
        ? data.data.filter(
            (s) =>
              s.exchange === selectedSymbol.exchange &&
              s.mic_code === selectedSymbol.mic_code,
          )
        : data?.data;

    return (
      rows?.map((s) => ({
        symbol: s.symbol,
        name: s.name,
        currency: s.currency,
        type: s.type,
        exchange: s.exchange,
        mic_code: s.mic_code,
      })) ?? []
    );
  }, [data, selectedSymbol]);

  return {
    stocks,
    data,
    isLoading,
    isError,
    error,
  };
};
