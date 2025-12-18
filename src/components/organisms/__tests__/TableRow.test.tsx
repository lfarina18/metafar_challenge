import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MouseEventHandler, ReactNode } from "react";
import { render, screen, userEvent } from "../../../test/utils";

const prefetchQueryMock = vi.fn().mockResolvedValue(undefined);
const getStockDataMock = vi.fn().mockResolvedValue({ status: "ok", data: [] });

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  );

  return {
    ...actual,
    useQueryClient: () => ({
      prefetchQuery: prefetchQueryMock,
    }),
  };
});

vi.mock("../../../services/stockService", () => ({
  stockService: {
    getStockData: (...args: unknown[]) => getStockDataMock(...args),
  },
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    Link: ({
      to,
      onMouseEnter,
      children,
    }: {
      to: string;
      onMouseEnter?: MouseEventHandler<HTMLAnchorElement>;
      children: ReactNode;
    }) => (
      <a href={to} onMouseEnter={onMouseEnter}>
        {children}
      </a>
    ),
  };
});

describe("TableRow (organism)", () => {
  beforeEach(() => {
    prefetchQueryMock.mockClear();
    getStockDataMock.mockClear();
  });

  it("renders stock data and prefetches on hover", async () => {
    const TableRow = (await import("../../organisms/TableRow")).default;

    render(
      <table>
        <tbody>
          <TableRow
            stock={{
              symbol: "AAL",
              name: "American Airlines",
              currency: "USD",
              type: "Common Stock",
              exchange: "NASDAQ",
            }}
          />
        </tbody>
      </table>,
    );

    expect(screen.getByText("AAL")).toBeInTheDocument();
    expect(screen.getByText("NASDAQ")).toBeInTheDocument();
    expect(screen.getByText("American Airlines")).toBeInTheDocument();

    await userEvent.hover(screen.getByText("AAL"));

    expect(prefetchQueryMock).toHaveBeenCalledTimes(1);

    const prefetchArgs = prefetchQueryMock.mock.calls[0]?.[0];
    expect(prefetchArgs.queryKey).toEqual(["stocks", "detail", "AAL"]);

    await prefetchArgs.queryFn({ signal: new AbortController().signal });
    expect(getStockDataMock).toHaveBeenCalledWith(
      "AAL",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("memo comparator returns true only when stock fields match", async () => {
    type StockRowProps = {
      stock: {
        symbol: string;
        name: string;
        currency: string;
        type: string;
        exchange?: string;
      };
    };

    const TableRow = (await import("../../organisms/TableRow"))
      .default as unknown as {
      compare: (prev: StockRowProps, next: StockRowProps) => boolean;
    };

    const prev = {
      stock: {
        symbol: "AAL",
        name: "American Airlines",
        currency: "USD",
        type: "Common Stock",
        exchange: "NASDAQ",
      },
    };

    const nextSame = {
      stock: {
        symbol: "AAL",
        name: "American Airlines",
        currency: "USD",
        type: "Common Stock",
        exchange: "NASDAQ",
      },
    };

    const nextDifferent = {
      stock: {
        symbol: "AAL",
        name: "Different",
        currency: "USD",
        type: "Common Stock",
        exchange: "NASDAQ",
      },
    };

    expect(TableRow.compare(prev, nextSame)).toBe(true);
    expect(TableRow.compare(prev, nextDifferent)).toBe(false);
  });

  it("does not throw when prefetchQuery rejects", async () => {
    prefetchQueryMock.mockRejectedValueOnce(new Error("prefetch failed"));

    const TableRow = (await import("../../organisms/TableRow")).default;

    render(
      <table>
        <tbody>
          <TableRow
            stock={{
              symbol: "AAL",
              name: "American Airlines",
              currency: "USD",
              type: "Common Stock",
              exchange: "NASDAQ",
            }}
          />
        </tbody>
      </table>,
    );

    await userEvent.hover(screen.getByText("AAL"));

    expect(prefetchQueryMock).toHaveBeenCalledTimes(1);
    await Promise.resolve();
  });

  it("renders exchange fallback when exchange is missing", async () => {
    const TableRow = (await import("../../organisms/TableRow")).default;

    render(
      <table>
        <tbody>
          <TableRow
            stock={{
              symbol: "AAL",
              name: "American Airlines",
              currency: "USD",
              type: "Common Stock",
            }}
          />
        </tbody>
      </table>,
    );

    expect(screen.getByText("AAL")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("swallows dynamic import preload failures on hover", async () => {
    vi.resetModules();
    vi.doMock("../../organisms/StockDetail", () => {
      throw new Error("preload detail failed");
    });
    vi.doMock("../../organisms/StockChart", () => {
      throw new Error("preload chart failed");
    });

    const TableRow = (await import("../../organisms/TableRow")).default;

    render(
      <table>
        <tbody>
          <TableRow
            stock={{
              symbol: "AAL",
              name: "American Airlines",
              currency: "USD",
              type: "Common Stock",
              exchange: "NASDAQ",
            }}
          />
        </tbody>
      </table>,
    );

    await userEvent.hover(screen.getByText("AAL"));

    expect(prefetchQueryMock).toHaveBeenCalledTimes(1);
    await Promise.resolve();
  });
});
