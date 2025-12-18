import { beforeEach, describe, expect, it, vi } from "vitest";
import { createWrapper, renderHook, waitFor } from "../../test/utils";
import type { TimeSeriesResponse } from "../../api/types";
import { Interval } from "../../api/types";

vi.mock("../../services/quoteService", () => ({
  quoteService: {
    getStockQuote: vi.fn(),
  },
}));

vi.mock("../../utils/toast", () => ({
  getPublicErrorMessage: vi.fn(),
  showErrorToast: vi.fn(),
}));

vi.mock("../../helpers", () => ({
  getTodayMarketStart: vi.fn(() => "2025-01-01T10:00"),
  getNowClampedToMarketStart: vi.fn(() => "2025-01-01T10:05"),
}));

describe("useStockQuote", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not call the service when required params are missing", async () => {
    // Arrange
    const wrapper = createWrapper();
    const { quoteService } = await import("../../services/quoteService");
    const { useStockQuote } = await import("../queries/useStockQuote");

    // Act
    renderHook(() => useStockQuote({ symbol: "" }), { wrapper });

    // Assert
    expect(quoteService.getStockQuote).not.toHaveBeenCalled();
  });

  it("calls the service and returns sorted values for non-realtime detail", async () => {
    // Arrange
    const wrapper = createWrapper();
    const { quoteService } = await import("../../services/quoteService");
    const { useStockQuote } = await import("../queries/useStockQuote");

    const mockResponse: TimeSeriesResponse = {
      status: "ok",
      meta: {
        symbol: "AAPL",
        interval: Interval.FIVE_MIN,
        currency: "USD",
        exchange_timezone: "America/New_York",
        exchange: "NASDAQ",
        mic_code: "XNAS",
        type: "Common Stock",
      },
      values: [
        {
          datetime: "2025-01-01 10:10:00",
          open: "1",
          high: "1",
          low: "1",
          close: "1",
          volume: "1",
        },
        {
          datetime: "2025-01-01 10:05:00",
          open: "1",
          high: "1",
          low: "1",
          close: "1",
          volume: "1",
        },
      ],
    };

    vi.mocked(quoteService.getStockQuote).mockResolvedValue(mockResponse);

    // Act
    const { result } = renderHook(
      () =>
        useStockQuote({
          symbol: "AAPL",
          interval: Interval.FIVE_MIN,
          startDate: "2025-01-01T10:00",
          endDate: "2025-01-01T10:00",
        }),
      { wrapper },
    );

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(quoteService.getStockQuote).toHaveBeenCalledTimes(1);
    expect(quoteService.getStockQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: "AAPL",
        interval: Interval.FIVE_MIN,
        start_date: "2025-01-01T10:00",
        end_date: "2025-01-01T10:00",
        outputsize: 30,
      }),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );

    expect(result.current.data?.values.map((v) => v.datetime)).toEqual([
      "2025-01-01 10:05:00",
      "2025-01-01 10:10:00",
    ]);
  });

  it("uses realtime effective dates and does not show toast on realtime errors", async () => {
    // Arrange
    const wrapper = createWrapper();
    const { quoteService } = await import("../../services/quoteService");
    const { showErrorToast } = await import("../../utils/toast");
    const { useStockQuote } = await import("../queries/useStockQuote");

    const err = new Error("Request failed");
    vi.mocked(quoteService.getStockQuote).mockRejectedValue(err);

    // Act
    const { result } = renderHook(
      () =>
        useStockQuote({
          symbol: "AAPL",
          interval: Interval.FIVE_MIN,
          realTime: true,
        }),
      { wrapper },
    );

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(quoteService.getStockQuote).toHaveBeenCalledTimes(1);
    expect(quoteService.getStockQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: "AAPL",
        interval: Interval.FIVE_MIN,
        start_date: "2025-01-01T10:00",
        end_date: "2025-01-01T10:05",
        outputsize: 78,
      }),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );

    expect(showErrorToast).not.toHaveBeenCalled();
  });

  it("shows toast on non-realtime errors", async () => {
    // Arrange
    const wrapper = createWrapper();
    const { quoteService } = await import("../../services/quoteService");
    const { getPublicErrorMessage, showErrorToast } =
      await import("../../utils/toast");
    const { useStockQuote } = await import("../queries/useStockQuote");

    const err = new Error("Request failed");
    vi.mocked(quoteService.getStockQuote).mockRejectedValue(err);
    vi.mocked(getPublicErrorMessage).mockReturnValue("Public message");

    // Act
    const { result } = renderHook(
      () =>
        useStockQuote({
          symbol: "AAPL",
          interval: Interval.FIVE_MIN,
          startDate: "2025-01-01T10:00",
          endDate: "2025-01-01T10:00",
        }),
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
