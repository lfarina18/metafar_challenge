import { beforeEach, describe, expect, it, vi } from "vitest";
import { createWrapper, renderHook, waitFor } from "../../test/utils";
import type { SymbolSearchResponse } from "../../api/types";

vi.mock("../../services/searchService", () => ({
  searchService: {
    searchSymbols: vi.fn(),
  },
}));

vi.mock("../../utils/toast", () => ({
  getPublicErrorMessage: vi.fn(),
  showErrorToast: vi.fn(),
}));

describe("useStockSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not call the service when query is empty", async () => {
    // Arrange
    const wrapper = createWrapper();
    const { searchService } = await import("../../services/searchService");
    const { useStockSearch } = await import("../queries/useStockSearch");

    // Act
    renderHook(() => useStockSearch("", { debounceMs: 0 }), { wrapper });

    // Assert
    expect(searchService.searchSymbols).not.toHaveBeenCalled();
  });

  it("calls the service and returns data when query is provided", async () => {
    // Arrange
    const wrapper = createWrapper();
    const { searchService } = await import("../../services/searchService");
    const { useStockSearch } = await import("../queries/useStockSearch");

    const mockResponse: SymbolSearchResponse = {
      status: "ok",
      data: [
        {
          symbol: "AAPL",
          instrument_name: "Apple Inc",
          exchange: "NASDAQ",
          mic_code: "XNAS",
          exchange_timezone: "America/New_York",
          instrument_type: "Common Stock",
          country: "United States",
          currency: "USD",
        },
      ],
    };

    vi.mocked(searchService.searchSymbols).mockResolvedValue(mockResponse);

    // Act
    const { result } = renderHook(
      () => useStockSearch("AAPL", { debounceMs: 0, outputsize: 10 }),
      { wrapper },
    );

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(searchService.searchSymbols).toHaveBeenCalledTimes(1);
    expect(searchService.searchSymbols).toHaveBeenCalledWith(
      "AAPL",
      { outputsize: 10 },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(result.current.data).toEqual(mockResponse);
  });

  it("shows a toast when the service fails", async () => {
    // Arrange
    const wrapper = createWrapper();
    const { searchService } = await import("../../services/searchService");
    const { getPublicErrorMessage, showErrorToast } =
      await import("../../utils/toast");
    const { useStockSearch } = await import("../queries/useStockSearch");

    const err = new Error("Request failed");

    vi.mocked(searchService.searchSymbols).mockRejectedValue(err);
    vi.mocked(getPublicErrorMessage).mockReturnValue("Public message");

    // Act
    const { result } = renderHook(
      () => useStockSearch("AAPL", { debounceMs: 0 }),
      { wrapper },
    );

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(getPublicErrorMessage).toHaveBeenCalledWith(err);
    expect(showErrorToast).toHaveBeenCalledTimes(1);
    expect(showErrorToast).toHaveBeenCalledWith("Public message");
  });
});
