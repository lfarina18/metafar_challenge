import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "../../test/utils";

vi.mock("../../utils/toast", () => ({
  dismissToast: vi.fn(),
  showLoadingToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

describe("useHistoricalChartToast", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("show() sets toastId using showLoadingToast", async () => {
    const { showLoadingToast } = await import("../../utils/toast");
    const { useHistoricalChartToast } =
      await import("../detail/useHistoricalChartToast");

    vi.mocked(showLoadingToast).mockReturnValue("toast-1");

    const { result } = renderHook(() =>
      useHistoricalChartToast({
        enabled: true,
        isError: false,
        isSuccess: false,
      }),
    );

    act(() => {
      result.current.show();
    });

    expect(showLoadingToast).toHaveBeenCalledTimes(1);
    expect(showLoadingToast).toHaveBeenCalledWith("Cargando gráfico...");
    expect(result.current.toastId).toBe("toast-1");
  });

  it("dismisses and clears toastId when enabled and isError becomes true", async () => {
    const { dismissToast, showLoadingToast } =
      await import("../../utils/toast");
    const { useHistoricalChartToast } =
      await import("../detail/useHistoricalChartToast");

    vi.mocked(showLoadingToast).mockReturnValue("toast-1");

    const { result, rerender } = renderHook(
      ({ enabled, isError, isSuccess }) =>
        useHistoricalChartToast({ enabled, isError, isSuccess }),
      {
        initialProps: { enabled: true, isError: false, isSuccess: false },
      },
    );

    act(() => {
      result.current.show();
    });

    rerender({ enabled: true, isError: true, isSuccess: false });

    expect(dismissToast).toHaveBeenCalledTimes(1);
    expect(dismissToast).toHaveBeenCalledWith("toast-1");
    expect(result.current.toastId).toBe(null);
  });

  it("dismisses, clears toastId and shows success when enabled and isSuccess becomes true", async () => {
    const { dismissToast, showLoadingToast, showSuccessToast } =
      await import("../../utils/toast");
    const { useHistoricalChartToast } =
      await import("../detail/useHistoricalChartToast");

    vi.mocked(showLoadingToast).mockReturnValue("toast-1");

    const { result, rerender } = renderHook(
      ({ enabled, isError, isSuccess }) =>
        useHistoricalChartToast({ enabled, isError, isSuccess }),
      {
        initialProps: { enabled: true, isError: false, isSuccess: false },
      },
    );

    act(() => {
      result.current.show();
    });

    rerender({ enabled: true, isError: false, isSuccess: true });

    expect(dismissToast).toHaveBeenCalledTimes(1);
    expect(dismissToast).toHaveBeenCalledWith("toast-1");
    expect(showSuccessToast).toHaveBeenCalledTimes(1);
    expect(showSuccessToast).toHaveBeenCalledWith("Gráfico actualizado");
    expect(result.current.toastId).toBe(null);
  });

  it("does nothing when not enabled", async () => {
    const { dismissToast, showLoadingToast, showSuccessToast } =
      await import("../../utils/toast");
    const { useHistoricalChartToast } =
      await import("../detail/useHistoricalChartToast");

    vi.mocked(showLoadingToast).mockReturnValue("toast-1");

    const { result, rerender } = renderHook(
      ({ enabled, isError, isSuccess }) =>
        useHistoricalChartToast({ enabled, isError, isSuccess }),
      {
        initialProps: { enabled: false, isError: false, isSuccess: false },
      },
    );

    act(() => {
      result.current.show();
    });

    expect(result.current.toastId).toBe("toast-1");

    rerender({ enabled: false, isError: true, isSuccess: false });

    expect(dismissToast).not.toHaveBeenCalled();
    expect(showSuccessToast).not.toHaveBeenCalled();
    expect(result.current.toastId).toBe("toast-1");
  });
});
