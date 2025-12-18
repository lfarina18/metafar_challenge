import { describe, it, vi } from "vitest";
import { render } from "../../../test/utils";

vi.mock("highcharts/highstock", () => ({ default: {} }));
vi.mock("highcharts/modules/boost", () => ({ default: () => undefined }));
vi.mock("highcharts-react-official", () => ({
  default: () => <div data-testid="highcharts" />,
}));

vi.mock("../../../hooks/queries/useStockQuote", () => ({
  useStockQuote: () => ({
    data: undefined,
    isLoading: true,
    isError: false,
    isSuccess: false,
    isFetching: false,
    error: null,
  }),
}));

vi.mock("../../../hooks/queries/useStockData", () => ({
  useStockData: () => ({ data: undefined, isLoading: false }),
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useParams: () => ({ symbol: "AAL" }),
    useNavigate: () => vi.fn(),
  };
});

describe("organisms smoke", () => {
  it("renders StockDetail", async () => {
    const StockDetail = (await import("../../organisms/StockDetail")).default;
    render(<StockDetail />);
  });
});
