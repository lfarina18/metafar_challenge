import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test/utils";

type StockChartSeries = {
  data: unknown[];
  dataGrouping: {
    enabled: boolean;
    groupPixelWidth: number;
  };
};

type HighchartsReactMockProps = {
  constructorType?: string;
  options: {
    title: { text: string };
    series: StockChartSeries[];
  };
};

let lastProps: HighchartsReactMockProps | null = null;
let isMobile = false;

const buildSeriesDataMock = vi.fn();

vi.mock("@mui/material", async () => {
  const actual =
    await vi.importActual<typeof import("@mui/material")>("@mui/material");

  return {
    ...actual,
    useMediaQuery: () => isMobile,
  };
});

vi.mock("highcharts/highstock", () => ({
  default: {},
}));

vi.mock("highcharts/modules/boost", () => ({
  default: () => undefined,
}));

vi.mock("highcharts-react-official", () => ({
  default: (props: unknown) => {
    lastProps = props as HighchartsReactMockProps;
    return <div data-testid="highcharts" />;
  },
}));

vi.mock("../../../lib/stockChart", () => ({
  buildSeriesData: (...args: unknown[]) => buildSeriesDataMock(...args),
}));

describe("StockChart", () => {
  beforeEach(() => {
    lastProps = null;
    isMobile = false;
    buildSeriesDataMock.mockReset();
  });

  it("renders HighchartsReact with expected options (desktop, no grouping)", async () => {
    buildSeriesDataMock.mockReturnValue(
      Array.from({ length: 100 }).map((_, i) => [i, i]),
    );

    const StockChart = (await import("../../organisms/StockChart")).default;

    render(
      <StockChart
        stockData={{
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
          status: "ok",
        }}
      />,
    );

    expect(screen.getByTestId("highcharts")).toBeInTheDocument();
    expect(lastProps).toBeTruthy();
    expect(lastProps?.constructorType).toBe("stockChart");
    expect(lastProps?.options.title.text).toBe("AAL");
    expect(lastProps?.options.series[0].data).toHaveLength(100);
    expect(lastProps?.options.series[0].dataGrouping.enabled).toBe(false);
    expect(lastProps?.options.series[0].dataGrouping.groupPixelWidth).toBe(20);

    expect(buildSeriesDataMock).toHaveBeenCalledWith(expect.any(Array), 5000);
  });

  it("enables data grouping and uses mobile config", async () => {
    isMobile = true;
    buildSeriesDataMock.mockReturnValue(
      Array.from({ length: 500 }).map((_, i) => [i, i]),
    );

    const StockChart = (await import("../../organisms/StockChart")).default;

    render(
      <StockChart
        stockData={{
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
          status: "ok",
        }}
      />,
    );

    expect(screen.getByTestId("highcharts")).toBeInTheDocument();
    expect(lastProps?.options.series[0].dataGrouping.enabled).toBe(true);
    expect(lastProps?.options.series[0].dataGrouping.groupPixelWidth).toBe(35);

    expect(buildSeriesDataMock).toHaveBeenCalledWith(expect.any(Array), 2000);
  });
});
