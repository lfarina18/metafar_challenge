import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../../../test/utils";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../../hooks/queries/useStockData", () => ({
  useStockData: () => ({
    data: {
      status: "ok",
      data: [
        {
          symbol: "AAL",
          name: "American Airlines",
          currency: "USD",
          type: "Common Stock",
          exchange: "NASDAQ",
          mic_code: "XNAS",
        },
      ],
    },
    isLoading: false,
    isError: false,
    isSuccess: true,
  }),
}));

vi.mock("../../../helpers", () => ({
  getTodayMarketStart: vi.fn(() => "2025-01-01T10:00"),
  getNowClampedToMarketStart: vi.fn(() => "2025-01-01T10:05"),
}));

describe("StockPreferenceForm", () => {
  it("submits preferences and allows navigating back", async () => {
    const onSubmit = vi.fn();
    const StockPreferenceForm = (
      await import("../../organisms/StockPreferenceForm")
    ).default;

    render(<StockPreferenceForm symbol="AAL" onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole("button", { name: "Volver" }));
    expect(navigateMock).toHaveBeenCalledWith("/");

    await userEvent.click(screen.getByRole("button", { name: "Graficar" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        interval: "5min",
        startDate: "2025-01-01T10:00",
        endDate: "2025-01-01T10:05",
        realTime: true,
      }),
    );
  });

  it("switches to history mode", async () => {
    const onSubmit = vi.fn();
    const StockPreferenceForm = (
      await import("../../organisms/StockPreferenceForm")
    ).default;

    render(<StockPreferenceForm symbol="AAL" onSubmit={onSubmit} />);

    await userEvent.click(screen.getByText("Histórico"));

    expect(screen.getByLabelText("Desde")).not.toBeDisabled();
    expect(screen.getByLabelText("Hasta")).not.toBeDisabled();

    await userEvent.click(screen.getByRole("button", { name: "Graficar" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        realTime: false,
      }),
    );
  });

  it("changes interval and dates in history mode, then resets dates when switching back to realtime", async () => {
    const onSubmit = vi.fn();
    const StockPreferenceForm = (
      await import("../../organisms/StockPreferenceForm")
    ).default;

    render(<StockPreferenceForm symbol="AAL" onSubmit={onSubmit} />);

    await userEvent.click(screen.getByText("Histórico"));

    const start = screen.getByLabelText("Desde");
    const end = screen.getByLabelText("Hasta");

    await userEvent.clear(start);
    await userEvent.type(start, "2025-01-01T11:00");

    await userEvent.clear(end);
    await userEvent.type(end, "2025-01-01T12:00");

    await userEvent.selectOptions(screen.getByLabelText("Intervalo"), "15min");

    await userEvent.click(screen.getByRole("button", { name: "Graficar" }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        interval: "15min",
        startDate: "2025-01-01T11:00",
        endDate: "2025-01-01T12:00",
        realTime: false,
      }),
    );

    await userEvent.click(screen.getByText("Tiempo Real"));
    expect(screen.getByLabelText("Desde")).toHaveValue("2025-01-01T10:00");
    expect(screen.getByLabelText("Hasta")).toHaveValue("2025-01-01T10:05");
  });
});
