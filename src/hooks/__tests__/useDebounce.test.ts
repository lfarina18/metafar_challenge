import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "../../test/utils";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("returns the initial value immediately", async () => {
    const { default: useDebounce } = await import("../useDebounce");

    const { result } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "a", delay: 300 },
      }
    );

    expect(result.current).toBe("a");
  });

  it("updates the debounced value after the delay", async () => {
    const { default: useDebounce } = await import("../useDebounce");

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "a", delay: 300 },
      }
    );

    rerender({ value: "b", delay: 300 });

    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe("b");
  });

  it("cancels the previous timeout when value changes before delay", async () => {
    const { default: useDebounce } = await import("../useDebounce");

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "a", delay: 300 },
      }
    );

    rerender({ value: "b", delay: 300 });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: "c", delay: 300 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("c");
  });

  it("resets the timer when delay changes", async () => {
    const { default: useDebounce } = await import("../useDebounce");

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "a", delay: 300 },
      }
    );

    rerender({ value: "b", delay: 300 });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: "b", delay: 400 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe("b");
  });
});
