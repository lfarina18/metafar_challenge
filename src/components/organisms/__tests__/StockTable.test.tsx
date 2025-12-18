import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test/utils";
import type { ReactNode } from "react";

type SymbolOption = {
  symbol: string;
  instrument_name?: string;
  exchange?: string;
  mic_code?: string;
};

type CapturedAutocompleteProps = {
  isOptionEqualToValue: (option: SymbolOption, value: SymbolOption) => boolean;
  getOptionLabel: (option: SymbolOption) => string;
  renderInput: (params: unknown) => ReactNode;
};

type VirtualizedRowsArgs = {
  estimateSize: () => number;
};

type VirtualRow = { index: number };
type VirtualizedRowsResult = {
  virtualRows: VirtualRow[];
  paddingTop: number;
  paddingBottom: number;
};

let lastAutocompleteProps: CapturedAutocompleteProps | null = null;

const useStockAutocompleteStateMock = vi.fn();
const useStockTableDataMock = vi.fn();
const useStockSearchMock = vi.fn();
const useVirtualizedRowsMock = vi.fn();

vi.mock("@mui/material", async () => {
  const actual =
    await vi.importActual<typeof import("@mui/material")>("@mui/material");

  return {
    ...actual,
    Autocomplete: (props: unknown) => {
      lastAutocompleteProps = props as CapturedAutocompleteProps;

      const typedProps = props as unknown as {
        options?: SymbolOption[];
        getOptionLabel?: (option: SymbolOption) => string;
        renderInput?: (params: {
          id: string;
          InputLabelProps: Record<string, unknown>;
          InputProps: Record<string, unknown>;
          inputProps: Record<string, unknown>;
        }) => ReactNode;
      };

      if (typedProps.options?.length && typedProps.getOptionLabel) {
        typedProps.getOptionLabel(typedProps.options[0]);
      }

      const renderedInput = typedProps.renderInput
        ? typedProps.renderInput({
            id: "stock-search",
            InputLabelProps: {},
            InputProps: {},
            inputProps: {},
          })
        : null;

      return <div data-testid="autocomplete">{renderedInput}</div>;
    },
  };
});

vi.mock("../../../hooks/table/useStockAutocompleteState", () => ({
  useStockAutocompleteState: (...args: unknown[]) =>
    useStockAutocompleteStateMock(...args),
}));

vi.mock("../../../hooks/table/useStockTableData", () => ({
  useStockTableData: (...args: unknown[]) => useStockTableDataMock(...args),
}));

vi.mock("../../../hooks/queries/useStockSearch", () => ({
  useStockSearch: (...args: unknown[]) => useStockSearchMock(...args),
}));

vi.mock("../../../hooks/table/useVirtualizedRows", () => ({
  useVirtualizedRows: (args: unknown) => useVirtualizedRowsMock(args),
}));

vi.mock("../../organisms/TableRow", () => ({
  default: ({ stock }: { stock: { symbol: string } }) => (
    <tr data-testid={`row-${stock.symbol}`}>
      <td>{stock.symbol}</td>
    </tr>
  ),
}));

vi.mock("../../../utils/toast", () => ({
  getPublicErrorMessage: () => "Public error",
}));

describe("StockTable", () => {
  beforeEach(() => {
    lastAutocompleteProps = null;
    useStockAutocompleteStateMock.mockReset();
    useStockTableDataMock.mockReset();
    useStockSearchMock.mockReset();
    useVirtualizedRowsMock.mockReset();

    useStockAutocompleteStateMock.mockReturnValue({
      exchange: "NASDAQ",
      autocompleteInput: "",
      selectedSymbol: { symbol: "FFSC", instrument_name: "FFSC" },
      handleAutocompleteInputChange: vi.fn(),
      handleAutocompleteChange: vi.fn(),
    });

    useStockTableDataMock.mockReturnValue({
      stocks: [],
      data: { status: "ok", data: [] },
      isLoading: false,
      isError: false,
      error: null,
    });

    useStockSearchMock.mockReturnValue({
      data: { status: "ok", data: [] },
      isFetching: false,
    });

    useVirtualizedRowsMock.mockImplementation(
      (args: unknown): VirtualizedRowsResult => {
        const typedArgs = args as VirtualizedRowsArgs;
        // Ensure estimateSize is exercised for coverage
        typedArgs.estimateSize();
        return {
          virtualRows: [],
          paddingTop: 0,
          paddingBottom: 0,
        };
      },
    );
  });

  it("renders empty state when there are no stocks", async () => {
    const StockTable = (await import("../../organisms/StockTable")).default;

    render(<StockTable />);

    expect(screen.getByText('No hay datos para "FFSC".')).toBeInTheDocument();
  });

  it("does not show empty-state message when selectedSymbol is null", async () => {
    useStockAutocompleteStateMock.mockReturnValue({
      exchange: "NASDAQ",
      autocompleteInput: "",
      selectedSymbol: null,
      handleAutocompleteInputChange: vi.fn(),
      handleAutocompleteChange: vi.fn(),
    });

    const StockTable = (await import("../../organisms/StockTable")).default;

    render(<StockTable />);

    expect(screen.queryByText(/No hay datos para/)).not.toBeInTheDocument();
  });

  it("renders skeleton while loading", async () => {
    useStockTableDataMock.mockReturnValue({
      stocks: [],
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    const StockTable = (await import("../../organisms/StockTable")).default;
    const { container } = render(<StockTable />);

    expect(container.querySelector(".MuiSkeleton-root")).toBeTruthy();
  });

  it("renders error state", async () => {
    useStockTableDataMock.mockReturnValue({
      stocks: [],
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Boom"),
    });

    const StockTable = (await import("../../organisms/StockTable")).default;
    render(<StockTable />);

    expect(screen.getByText("Public error")).toBeInTheDocument();
  });

  it("renders virtualized rows and padding rows", async () => {
    useStockTableDataMock.mockReturnValue({
      stocks: [
        {
          symbol: "AAL",
          name: "American Airlines",
          currency: "USD",
          type: "Common Stock",
          exchange: "NASDAQ",
        },
      ],
      data: { status: "ok", data: [] },
      isLoading: false,
      isError: false,
      error: null,
    });

    useVirtualizedRowsMock.mockImplementation(
      (args: unknown): VirtualizedRowsResult => {
        const typedArgs = args as VirtualizedRowsArgs;
        typedArgs.estimateSize();
        return {
          virtualRows: [{ index: 0 }, { index: 1 }],
          paddingTop: 10,
          paddingBottom: 12,
        };
      },
    );

    const StockTable = (await import("../../organisms/StockTable")).default;
    render(<StockTable />);

    expect(screen.getByTestId("row-AAL")).toBeInTheDocument();
  });

  it("exposes isOptionEqualToValue that compares symbol/exchange/mic_code", async () => {
    useStockSearchMock.mockReturnValue({
      data: {
        status: "ok",
        data: [
          {
            symbol: "AAL",
            instrument_name: "American Airlines",
            exchange: "NASDAQ",
            mic_code: "XNAS",
          },
        ],
      },
      isFetching: false,
    });

    useStockAutocompleteStateMock.mockReturnValue({
      exchange: "NASDAQ",
      autocompleteInput: "AA",
      selectedSymbol: {
        symbol: "AAL",
        instrument_name: "American Airlines",
        exchange: "NASDAQ",
        mic_code: "XNAS",
      },
      handleAutocompleteInputChange: vi.fn(),
      handleAutocompleteChange: vi.fn(),
    });

    const StockTable = (await import("../../organisms/StockTable")).default;
    render(<StockTable />);

    expect(lastAutocompleteProps).toBeTruthy();

    expect(
      (lastAutocompleteProps as CapturedAutocompleteProps).isOptionEqualToValue(
        { symbol: "AAL", exchange: "NASDAQ", mic_code: "XNAS" },
        { symbol: "AAL", exchange: "NASDAQ", mic_code: "XNAS" },
      ),
    ).toBe(true);

    expect(
      (lastAutocompleteProps as CapturedAutocompleteProps).isOptionEqualToValue(
        { symbol: "AAL", exchange: "NASDAQ", mic_code: "XNAS" },
        { symbol: "AAL", exchange: "NYSE", mic_code: "XNYS" },
      ),
    ).toBe(false);
  });

  it("handles undefined search data by using empty options", async () => {
    useStockSearchMock.mockReturnValue({
      data: undefined,
      isFetching: false,
    });

    useStockAutocompleteStateMock.mockReturnValue({
      exchange: "NASDAQ",
      autocompleteInput: "AA",
      selectedSymbol: null,
      handleAutocompleteInputChange: vi.fn(),
      handleAutocompleteChange: vi.fn(),
    });

    const StockTable = (await import("../../organisms/StockTable")).default;
    render(<StockTable />);

    expect(screen.getByTestId("autocomplete")).toBeInTheDocument();
  });

  it("renders rows when a stock has no exchange", async () => {
    useStockTableDataMock.mockReturnValue({
      stocks: [
        {
          symbol: "AAL",
          name: "American Airlines",
          currency: "USD",
          type: "Common Stock",
        },
      ],
      data: { status: "ok", data: [] },
      isLoading: false,
      isError: false,
      error: null,
    });

    useVirtualizedRowsMock.mockReturnValue({
      virtualRows: [{ index: 0 }],
      paddingTop: 0,
      paddingBottom: 0,
    });

    const StockTable = (await import("../../organisms/StockTable")).default;
    render(<StockTable />);

    expect(screen.getByTestId("row-AAL")).toBeInTheDocument();
  });
});
