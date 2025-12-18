import { beforeEach, describe, expect, it, vi } from "vitest";
import { createWrapper, renderHook, waitFor } from "../../test/utils";
import type { StockListResponse } from "../../api/types";

vi.mock("../../services/stockService", () => ({
  stockService: {
    getStockData: vi.fn(),
  },
}));

vi.mock("../../utils/toast", () => ({
  getPublicErrorMessage: vi.fn(),
  showErrorToast: vi.fn(),
}));

describe("useStockData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not call the service when symbol is empty", async () => {
    // Arrange
    const wrapper = createWrapper();
    const { stockService } = await import("../../services/stockService");
    const { useStockData } = await import("../queries/useStockData");

    // Act
    renderHook(() => useStockData(""), { wrapper });

    // Assert
    expect(stockService.getStockData).not.toHaveBeenCalled();
  });

  it("calls the service and returns data when symbol is provided", async () => {
    // Arrange
    const wrapper = createWrapper();
    const { stockService } = await import("../../services/stockService");
    const { useStockData } = await import("../queries/useStockData");

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

    vi.mocked(stockService.getStockData).mockResolvedValue(mockResponse);

    // Act
    const { result } = renderHook(() => useStockData("AAPL"), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(stockService.getStockData).toHaveBeenCalledTimes(1);
    expect(stockService.getStockData).toHaveBeenCalledWith(
      "AAPL",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(result.current.data).toEqual(mockResponse);
  });

  it("shows a toast when the service fails", async () => {
    // Arrange
    const wrapper = createWrapper();
    const { stockService } = await import("../../services/stockService");
    const { getPublicErrorMessage, showErrorToast } =
      await import("../../utils/toast");
    const { useStockData } = await import("../queries/useStockData");

    const err = new Error("Request failed");

    vi.mocked(stockService.getStockData).mockRejectedValue(err);
    vi.mocked(getPublicErrorMessage).mockReturnValue("Public message");

    // Act
    const { result } = renderHook(() => useStockData("AAPL"), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(getPublicErrorMessage).toHaveBeenCalledWith(err);
    expect(showErrorToast).toHaveBeenCalledTimes(1);
    expect(showErrorToast).toHaveBeenCalledWith("Public message");
  });
});
