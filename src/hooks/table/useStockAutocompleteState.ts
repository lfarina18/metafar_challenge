import * as React from "react";
import type { SymbolSearchResult } from "../../api/types";

interface UseStockAutocompleteStateParams {
  initialExchange?: string;
}

interface UseStockAutocompleteStateResult {
  exchange: string;
  setExchange: React.Dispatch<React.SetStateAction<string>>;
  autocompleteInput: string;
  selectedSymbol: SymbolSearchResult | null;
  handleAutocompleteInputChange: (
    _: React.SyntheticEvent,
    value: string,
    reason: "input" | "reset" | "clear"
  ) => void;
  handleAutocompleteChange: (
    _: React.SyntheticEvent,
    value: SymbolSearchResult | null
  ) => void;
}

export const useStockAutocompleteState = ({
  initialExchange = "NASDAQ",
}: UseStockAutocompleteStateParams = {}): UseStockAutocompleteStateResult => {
  const [exchange, setExchange] = React.useState<string>(initialExchange);
  const [autocompleteInput, setAutocompleteInput] = React.useState<string>("");
  const [selectedSymbol, setSelectedSymbol] =
    React.useState<SymbolSearchResult | null>(null);

  const handleAutocompleteInputChange = React.useCallback(
    (
      _: React.SyntheticEvent,
      value: string,
      reason: "input" | "reset" | "clear"
    ) => {
      setAutocompleteInput(value);

      if (
        reason === "input" &&
        selectedSymbol &&
        value !== selectedSymbol.symbol
      ) {
        setSelectedSymbol(null);
      }
    },
    [selectedSymbol]
  );

  const handleAutocompleteChange = React.useCallback(
    (_: React.SyntheticEvent, value: SymbolSearchResult | null) => {
      setSelectedSymbol(value);

      if (!value) {
        setAutocompleteInput("");
        return;
      }

      setExchange(value.exchange);
      setAutocompleteInput(value.symbol);
    },
    []
  );

  return {
    exchange,
    setExchange,
    autocompleteInput,
    selectedSymbol,
    handleAutocompleteInputChange,
    handleAutocompleteChange,
  };
};
