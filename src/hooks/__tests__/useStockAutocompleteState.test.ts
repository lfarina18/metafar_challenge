import { describe, expect, it } from "vitest";
import { act, renderHook } from "../../test/utils";
import type { SymbolSearchResult } from "../../api/types";

describe("useStockAutocompleteState", () => {
  it("initializes with default exchange and empty input", async () => {
    const { useStockAutocompleteState } = await import(
      "../table/useStockAutocompleteState"
    );

    const { result } = renderHook(() => useStockAutocompleteState());

    expect(result.current.exchange).toBe("NASDAQ");
    expect(result.current.autocompleteInput).toBe("");
    expect(result.current.selectedSymbol).toBe(null);
  });

  it("initializes with custom initialExchange", async () => {
    const { useStockAutocompleteState } = await import(
      "../table/useStockAutocompleteState"
    );

    const { result } = renderHook(() =>
      useStockAutocompleteState({ initialExchange: "NYSE" })
    );

    expect(result.current.exchange).toBe("NYSE");
  });

  it("handleAutocompleteChange sets selectedSymbol, exchange and input", async () => {
    const { useStockAutocompleteState } = await import(
      "../table/useStockAutocompleteState"
    );

    const option: SymbolSearchResult = {
      symbol: "AAPL",
      instrument_name: "Apple Inc",
      exchange: "NASDAQ",
      mic_code: "XNAS",
      exchange_timezone: "America/New_York",
      instrument_type: "Common Stock",
      country: "United States",
      currency: "USD",
    };

    const { result } = renderHook(() => useStockAutocompleteState());

    act(() => {
      result.current.handleAutocompleteChange(
        {} as unknown as React.SyntheticEvent,
        option
      );
    });

    expect(result.current.selectedSymbol).toEqual(option);
    expect(result.current.exchange).toBe("NASDAQ");
    expect(result.current.autocompleteInput).toBe("AAPL");
  });

  it("handleAutocompleteChange clears input when value is null", async () => {
    const { useStockAutocompleteState } = await import(
      "../table/useStockAutocompleteState"
    );

    const option: SymbolSearchResult = {
      symbol: "AAPL",
      instrument_name: "Apple Inc",
      exchange: "NASDAQ",
      mic_code: "XNAS",
      exchange_timezone: "America/New_York",
      instrument_type: "Common Stock",
      country: "United States",
      currency: "USD",
    };

    const { result } = renderHook(() => useStockAutocompleteState());

    act(() => {
      result.current.handleAutocompleteChange(
        {} as unknown as React.SyntheticEvent,
        option
      );
    });

    expect(result.current.autocompleteInput).toBe("AAPL");

    act(() => {
      result.current.handleAutocompleteChange(
        {} as unknown as React.SyntheticEvent,
        null
      );
    });

    expect(result.current.selectedSymbol).toBe(null);
    expect(result.current.autocompleteInput).toBe("");
  });

  it("handleAutocompleteInputChange clears selectedSymbol when user types a different value", async () => {
    const { useStockAutocompleteState } = await import(
      "../table/useStockAutocompleteState"
    );

    const option: SymbolSearchResult = {
      symbol: "AAPL",
      instrument_name: "Apple Inc",
      exchange: "NASDAQ",
      mic_code: "XNAS",
      exchange_timezone: "America/New_York",
      instrument_type: "Common Stock",
      country: "United States",
      currency: "USD",
    };

    const { result } = renderHook(() => useStockAutocompleteState());

    act(() => {
      result.current.handleAutocompleteChange(
        {} as unknown as React.SyntheticEvent,
        option
      );
    });

    expect(result.current.selectedSymbol).toEqual(option);

    act(() => {
      result.current.handleAutocompleteInputChange(
        {} as unknown as React.SyntheticEvent,
        "MSFT",
        "input"
      );
    });

    expect(result.current.autocompleteInput).toBe("MSFT");
    expect(result.current.selectedSymbol).toBe(null);
  });

  it("handleAutocompleteInputChange does not clear selectedSymbol for non-input reasons", async () => {
    const { useStockAutocompleteState } = await import(
      "../table/useStockAutocompleteState"
    );

    const option: SymbolSearchResult = {
      symbol: "AAPL",
      instrument_name: "Apple Inc",
      exchange: "NASDAQ",
      mic_code: "XNAS",
      exchange_timezone: "America/New_York",
      instrument_type: "Common Stock",
      country: "United States",
      currency: "USD",
    };

    const { result } = renderHook(() => useStockAutocompleteState());

    act(() => {
      result.current.handleAutocompleteChange(
        {} as unknown as React.SyntheticEvent,
        option
      );
    });

    act(() => {
      result.current.handleAutocompleteInputChange(
        {} as unknown as React.SyntheticEvent,
        "MSFT",
        "reset"
      );
    });

    expect(result.current.autocompleteInput).toBe("MSFT");
    expect(result.current.selectedSymbol).toEqual(option);
  });
});
