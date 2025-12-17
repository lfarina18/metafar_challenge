import { beforeEach, describe, expect, it, vi } from "vitest";
import { createWrapper, renderHook, waitFor } from "../../test/utils";
import type { StockListResponse } from "../../api/types";

vi.mock("../../services/stockService", () => ({
  stockService: {
    getStockList: vi.fn(),
  },
}));

vi.mock("../../utils/toast", () => ({
  getPublicErrorMessage: vi.fn(),
  showErrorToast: vi.fn(),
}));

describe("useStockList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls the service and returns data using the default exchange", async () => {
    // Arrange
    const wrapper = createWrapper();
    const { stockService } = await import("../../services/stockService");
    const { useStockList } = await import("../queries/useStockList");

    const mockResponse: StockListResponse = {
      status: "ok",
      data: [
        {
          symbol: "AAPL",
          name: "Apple Inc",
          currency: "USD",
          type: "Common Stock",
          exchange: "NASDAQ",
          mic_code: "XNAS",
        },
      ],
    };

    vi.mocked(stockService.getStockList).mockResolvedValue(mockResponse);

    // Act
    const { result } = renderHook(() => useStockList(), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(stockService.getStockList).toHaveBeenCalledTimes(1);
    expect(stockService.getStockList).toHaveBeenCalledWith(
      "NASDAQ",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
    expect(result.current.data).toEqual(mockResponse);
  });

  it("shows a toast when the service fails", async () => {
    // Arrange
    const wrapper = createWrapper();
    const { stockService } = await import("../../services/stockService");
    const { getPublicErrorMessage, showErrorToast } = await import(
      "../../utils/toast"
    );
    const { useStockList } = await import("../queries/useStockList");

    const err = new Error("Request failed");

    vi.mocked(stockService.getStockList).mockRejectedValue(err);
    vi.mocked(getPublicErrorMessage).mockReturnValue("Public message");

    // Act
    const { result } = renderHook(() => useStockList(), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(getPublicErrorMessage).toHaveBeenCalledWith(err);
    expect(showErrorToast).toHaveBeenCalledTimes(1);
    expect(showErrorToast).toHaveBeenCalledWith("Public message");
  });
});
