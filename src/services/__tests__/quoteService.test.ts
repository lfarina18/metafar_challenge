import { describe, expect, it, vi } from "vitest";
import { ENDPOINTS } from "../../api/endpoints";
import { Interval } from "../../api/types";
import {
  QuoteResponseSchema,
  TimeSeriesResponseSchema,
} from "../../api/schemas";

const apiClientGetMock = vi.fn();
const validateResponseMock = vi.fn();

vi.mock("../../api/client", () => ({
  apiClient: {
    get: (...args: unknown[]) => apiClientGetMock(...args),
  },
}));

vi.mock("../shared/validateResponse", async () => {
  const actual = await vi.importActual<
    typeof import("../shared/validateResponse")
  >("../shared/validateResponse");

  return {
    ...actual,
    validateResponse: (...args: unknown[]) => validateResponseMock(...args),
  };
});

describe("quoteService", () => {
  it("getQuote calls apiClient.get with QUOTE endpoint and validates response", async () => {
    apiClientGetMock.mockResolvedValueOnce({ data: { status: "ok" } });
    validateResponseMock.mockReturnValueOnce({ ok: true });

    const { quoteService } = await import("../quoteService");

    const controller = new AbortController();
    const result = await quoteService.getQuote(
      { symbol: "AAL" },
      { signal: controller.signal },
    );

    expect(apiClientGetMock).toHaveBeenCalledWith(ENDPOINTS.QUOTE, {
      params: { symbol: "AAL" },
      signal: controller.signal,
    });

    expect(validateResponseMock).toHaveBeenCalledWith(
      { status: "ok" },
      QuoteResponseSchema,
    );

    expect(result).toEqual({ ok: true });
  });

  it("getStockQuote uses defaults and omits date params when no dates are provided", async () => {
    apiClientGetMock.mockResolvedValueOnce({ data: { status: "ok" } });
    validateResponseMock.mockReturnValueOnce({ ok: true });

    const { quoteService } = await import("../quoteService");

    await quoteService.getStockQuote({ symbol: "AAL" });

    expect(apiClientGetMock).toHaveBeenCalledWith(ENDPOINTS.TIME_SERIES, {
      params: {
        symbol: "AAL",
        interval: Interval.FIVE_MIN,
        outputsize: 30,
      },
      signal: undefined,
    });

    expect(validateResponseMock).toHaveBeenCalledWith(
      { status: "ok" },
      TimeSeriesResponseSchema,
    );
  });

  it("getStockQuote sets date when start_date and end_date are on the same day", async () => {
    apiClientGetMock.mockResolvedValueOnce({ data: { status: "ok" } });
    validateResponseMock.mockReturnValueOnce({ ok: true });

    const { quoteService } = await import("../quoteService");

    await quoteService.getStockQuote({
      symbol: "AAL",
      start_date: "2025-01-01T10:00:00.000Z",
      end_date: "2025-01-01T15:00:00.000Z",
      interval: Interval.ONE_MIN,
      outputsize: 10,
    });

    expect(apiClientGetMock).toHaveBeenCalledWith(ENDPOINTS.TIME_SERIES, {
      params: {
        symbol: "AAL",
        interval: Interval.ONE_MIN,
        outputsize: 10,
        date: "2025-01-01",
      },
      signal: undefined,
    });
  });

  it("getStockQuote sets start_date/end_date when dates are different days", async () => {
    apiClientGetMock.mockResolvedValueOnce({ data: { status: "ok" } });
    validateResponseMock.mockReturnValueOnce({ ok: true });

    const { quoteService } = await import("../quoteService");

    await quoteService.getStockQuote({
      symbol: "AAL",
      start_date: "2025-01-01T10:00:00.000Z",
      end_date: "2025-01-02T15:00:00.000Z",
    });

    expect(apiClientGetMock).toHaveBeenCalledWith(ENDPOINTS.TIME_SERIES, {
      params: {
        symbol: "AAL",
        interval: Interval.FIVE_MIN,
        outputsize: 30,
        start_date: "2025-01-01",
        end_date: "2025-01-02",
      },
      signal: undefined,
    });
  });
});
