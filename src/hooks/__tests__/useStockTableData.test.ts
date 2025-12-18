import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "../../test/utils";
import type { StockListResponse, SymbolSearchResult } from "../../api/types";

vi.mock("../queries/useStockList", () => ({
  useStockList: vi.fn(),
}));

vi.mock("../queries/useStockData", () => ({
  useStockData: vi.fn(),
}));

describe("useStockTableData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses stock list query when selectedSymbol is null", async () => {
    const { useStockList } = await import("../queries/useStockList");
    const { useStockData } = await import("../queries/useStockData");
    const { useStockTableData } = await import("../table/useStockTableData");

    const listResponse: StockListResponse = {
      status: "ok",
      data: [
        {
          symbol: "AAPL",
          name: "Apple Inc",
          currency: "USD",
          exchange: "NASDAQ",
          mic_code: "XNAS",
          type: "Common Stock",
        },
      ],
    };

    vi.mocked(useStockList).mockReturnValue({
      data: listResponse,
      isLoading: false,
      isError: false,
      error: null,
    } as never);

    vi.mocked(useStockData).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as never);

    const { result } = renderHook(() =>
      useStockTableData({ exchange: "NASDAQ", selectedSymbol: null })
    );

    expect(useStockList).toHaveBeenCalledTimes(1);
    expect(useStockList).toHaveBeenCalledWith("NASDAQ");

    expect(useStockData).toHaveBeenCalledTimes(1);
    expect(useStockData).toHaveBeenCalledWith("");

    expect(result.current.data).toEqual(listResponse);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.stocks).toEqual([
      {
        symbol: "AAPL",
        name: "Apple Inc",
        currency: "USD",
        type: "Common Stock",
        exchange: "NASDAQ",
        mic_code: "XNAS",
      },
    ]);
  });

  it("uses stock data query and filters by exchange + mic_code when selectedSymbol exists", async () => {
    const { useStockList } = await import("../queries/useStockList");
    const { useStockData } = await import("../queries/useStockData");
    const { useStockTableData } = await import("../table/useStockTableData");

    const selectedSymbol: SymbolSearchResult = {
      symbol: "AAPL",
      instrument_name: "Apple Inc",
      exchange: "NASDAQ",
      mic_code: "XNAS",
      exchange_timezone: "America/New_York",
      instrument_type: "Common Stock",
      country: "United States",
      currency: "USD",
    };

    const dataResponse: StockListResponse = {
      status: "ok",
      data: [
        {
          symbol: "AAPL",
          name: "Apple Inc",
          currency: "USD",
          exchange: "NASDAQ",
          mic_code: "XNAS",
          type: "Common Stock",
        },
        {
          symbol: "AAPL",
          name: "Apple Inc",
          currency: "USD",
          exchange: "NASDAQ",
          mic_code: "OTHER",
          type: "Common Stock",
        },
        {
          symbol: "AAPL",
          name: "Apple Inc",
          currency: "USD",
          exchange: "NYSE",
          mic_code: "XNYS",
          type: "Common Stock",
        },
      ],
    };

    vi.mocked(useStockList).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as never);

    vi.mocked(useStockData).mockReturnValue({
      data: dataResponse,
      isLoading: false,
      isError: false,
      error: null,
    } as never);

    const { result } = renderHook(() =>
      useStockTableData({ exchange: "NASDAQ", selectedSymbol })
    );

    expect(useStockList).toHaveBeenCalledTimes(1);
    expect(useStockList).toHaveBeenCalledWith("NASDAQ");

    expect(useStockData).toHaveBeenCalledTimes(1);
    expect(useStockData).toHaveBeenCalledWith("AAPL");

    expect(result.current.data).toEqual(dataResponse);
    expect(result.current.stocks).toEqual([
      {
        symbol: "AAPL",
        name: "Apple Inc",
        currency: "USD",
        type: "Common Stock",
        exchange: "NASDAQ",
        mic_code: "XNAS",
      },
    ]);
  });

  it("exposes loading/error from the correct query based on selectedSymbol", async () => {
    const { useStockList } = await import("../queries/useStockList");
    const { useStockData } = await import("../queries/useStockData");
    const { useStockTableData } = await import("../table/useStockTableData");

    const err = new Error("boom");

    vi.mocked(useStockList).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as never);

    vi.mocked(useStockData).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: err,
    } as never);

    const { result: listResult } = renderHook(() =>
      useStockTableData({ exchange: "NASDAQ", selectedSymbol: null })
    );

    expect(listResult.current.isLoading).toBe(true);
    expect(listResult.current.isError).toBe(false);
    expect(listResult.current.error).toBe(null);

    const selectedSymbol: SymbolSearchResult = {
      symbol: "AAPL",
      instrument_name: "Apple Inc",
      exchange: "NASDAQ",
      mic_code: "XNAS",
      exchange_timezone: "America/New_York",
      instrument_type: "Common Stock",
      country: "United States",
      currency: "USD",
    };

    const { result: detailResult } = renderHook(() =>
      useStockTableData({ exchange: "NASDAQ", selectedSymbol })
    );

    expect(detailResult.current.isLoading).toBe(false);
    expect(detailResult.current.isError).toBe(true);
    expect(detailResult.current.error).toBe(err);
  });
});
