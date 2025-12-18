import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../test/utils";

const useParamsMock = vi.fn((): { symbol?: string } => ({ symbol: "AAL" }));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useParams: () => useParamsMock(),
  };
});

vi.mock("highcharts/highstock", () => ({
  default: {},
}));

vi.mock("highcharts/modules/boost", () => ({
  default: () => undefined,
}));

vi.mock("highcharts-react-official", () => ({
  default: () => <div data-testid="highcharts" />,
}));

let lastStockChartData: unknown = null;

vi.mock("../../organisms/StockChart", () => ({
  default: ({ stockData }: { stockData: unknown }) => {
    lastStockChartData = stockData;
    return <div data-testid="chart" />;
  },
}));

const useStockQuoteMock = vi.fn();
const isNoDataErrorMock = vi.fn(() => false);
const historicalToastShowMock = vi.fn();

vi.mock("../../../hooks/queries/useStockQuote", () => ({
  useStockQuote: (...args: unknown[]) =>
    (useStockQuoteMock as (...a: unknown[]) => unknown)(...args),
}));

vi.mock("../../../hooks/detail/useHistoricalChartToast", () => ({
  useHistoricalChartToast: () => ({
    show: historicalToastShowMock,
  }),
}));

vi.mock("../StockPreferenceForm", () => ({
  default: ({
    onSubmit,
  }: {
    onSubmit: (next: {
      interval: string;
      startDate: Date;
      endDate: Date;
      realTime: boolean;
    }) => void;
  }) => {
    return (
      <div>
        <button
          type="button"
          onClick={() =>
            onSubmit({
              interval: "5min",
              startDate: new Date("2025-01-01T10:00:00.000Z"),
              endDate: new Date("2025-01-01T10:05:00.000Z"),
              realTime: false,
            })
          }
        >
          set-historical
        </button>

        <button
          type="button"
          onClick={() =>
            onSubmit({
              interval: "5min",
              startDate: new Date("2025-01-01T10:00:00.000Z"),
              endDate: new Date("2025-01-01T10:05:00.000Z"),
              realTime: true,
            })
          }
        >
          set-realtime
        </button>
      </div>
    );
  },
}));

vi.mock("../../../utils/toast", () => ({
  getPublicErrorMessage: () => "Public error",
  isNoDataError: (...args: unknown[]) =>
    (isNoDataErrorMock as (...a: unknown[]) => boolean)(...args),
}));

describe("StockDetail", () => {
  beforeEach(() => {
    useParamsMock.mockReset();
    useParamsMock.mockReturnValue({ symbol: "AAL" });
    useStockQuoteMock.mockReset();
    isNoDataErrorMock.mockReset();
    isNoDataErrorMock.mockReturnValue(false);
    historicalToastShowMock.mockReset();
    lastStockChartData = null;
  });

  it("renders loading skeleton when loading and no data", async () => {
    useStockQuoteMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isSuccess: false,
      isFetching: false,
      error: null,
    });

    const StockDetail = (await import("../../organisms/StockDetail")).default;

    const { container } = render(<StockDetail />);

    expect(container.querySelector(".MuiSkeleton-root")).toBeTruthy();
  });

  it("renders chart when data is available", async () => {
    useStockQuoteMock.mockReturnValue({
      data: {
        status: "ok",
        meta: {
          symbol: "AAL",
          interval: "5min",
          currency: "USD",
          exchange_timezone: "America/New_York",
          mic_code: "XNAS",
          exchange: "NASDAQ",
          type: "Common Stock",
        },
        values: [
          {
            datetime: "2025-01-01 10:00:00",
            open: "1",
            high: "1",
            low: "1",
            close: "1",
            volume: "1",
          },
        ],
      },
      isLoading: false,
      isError: false,
      isSuccess: true,
      isFetching: false,
      error: null,
    });

    const StockDetail = (await import("../../organisms/StockDetail")).default;

    render(<StockDetail />);

    await waitFor(() => {
      expect(screen.getByTestId("chart")).toBeInTheDocument();
    });
  });

  it("renders error alert when query fails", async () => {
    useStockQuoteMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isSuccess: false,
      isFetching: false,
      error: new Error("Boom"),
    });

    const StockDetail = (await import("../../organisms/StockDetail")).default;

    render(<StockDetail />);

    expect(screen.getByText("Public error")).toBeInTheDocument();
  });

  it("renders no-data info alert when realtime query returns no data error", async () => {
    isNoDataErrorMock.mockReturnValue(true);

    useStockQuoteMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isSuccess: false,
      isFetching: false,
      error: new Error("No data"),
    });

    const StockDetail = (await import("../../organisms/StockDetail")).default;

    render(<StockDetail />);

    expect(
      screen.getByText("No hay datos disponibles para la fecha y hora actual."),
    ).toBeInTheDocument();
  });

  it("resets pause when switching to historical and calls historical toast show", async () => {
    useStockQuoteMock.mockReturnValue({
      data: {
        status: "ok",
        meta: {
          symbol: "AAL",
          interval: "5min",
          currency: "USD",
          exchange_timezone: "America/New_York",
          mic_code: "XNAS",
          exchange: "NASDAQ",
          type: "Common Stock",
        },
        values: [],
      },
      isLoading: false,
      isError: false,
      isSuccess: true,
      isFetching: false,
      error: null,
    });

    const { userEvent } = await import("../../../test/utils");
    const StockDetail = (await import("../../organisms/StockDetail")).default;

    render(<StockDetail />);

    expect(screen.getByText("Tiempo real: Activo")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Pausar" }));
    expect(screen.getByText("Tiempo real: Pausado")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "set-historical" }),
    );
    expect(historicalToastShowMock).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole("button", { name: "set-realtime" }));
    expect(screen.getByText("Tiempo real: Activo")).toBeInTheDocument();
  });

  it("uses default symbol MELI when route param is missing", async () => {
    useParamsMock.mockReturnValue({});

    useStockQuoteMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isSuccess: false,
      isFetching: false,
      error: null,
    });

    const StockDetail = (await import("../../organisms/StockDetail")).default;

    render(<StockDetail />);

    const firstCall = useStockQuoteMock.mock.calls[0]?.[0] as {
      symbol: string;
    };
    expect(firstCall.symbol).toBe("MELI");
  });

  it("maps missing volume to '0' in chart data", async () => {
    useStockQuoteMock.mockReturnValue({
      data: {
        status: "ok",
        meta: {
          symbol: "AAL",
          interval: "5min",
          currency: "USD",
          exchange_timezone: "America/New_York",
          mic_code: "XNAS",
          exchange: "NASDAQ",
          type: "Common Stock",
        },
        values: [
          {
            datetime: "2025-01-01 10:00:00",
            open: "1",
            high: "1",
            low: "1",
            close: "1",
          },
        ],
      },
      isLoading: false,
      isError: false,
      isSuccess: true,
      isFetching: false,
      error: null,
    });

    const StockDetail = (await import("../../organisms/StockDetail")).default;

    render(<StockDetail />);

    await waitFor(() => {
      expect(screen.getByTestId("chart")).toBeInTheDocument();
    });

    const typed = lastStockChartData as {
      values: Array<{ volume: string }>;
    };
    expect(typed.values[0]?.volume).toBe("0");
  });

  it("shows updating status when realtime query is fetching", async () => {
    useStockQuoteMock.mockReturnValue({
      data: {
        status: "ok",
        meta: {
          symbol: "AAL",
          interval: "5min",
          currency: "USD",
          exchange_timezone: "America/New_York",
          mic_code: "XNAS",
          exchange: "NASDAQ",
          type: "Common Stock",
        },
        values: [],
      },
      isLoading: false,
      isError: false,
      isSuccess: true,
      isFetching: true,
      error: null,
    });

    const StockDetail = (await import("../../organisms/StockDetail")).default;

    render(<StockDetail />);

    expect(
      screen.getByText("Tiempo real: Activo (actualizando...)"),
    ).toBeInTheDocument();
  });
});
