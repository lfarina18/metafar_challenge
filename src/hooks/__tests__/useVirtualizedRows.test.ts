import { beforeEach, describe, expect, it, vi } from "vitest";
import * as React from "react";
import { renderHook, waitFor } from "../../test/utils";

type MockVirtualItem = {
  start: number;
  size: number;
};

type MockVirtualizer = {
  getVirtualItems: () => MockVirtualItem[];
  getTotalSize: () => number;
  scrollToIndex: (index: number) => void;
};

const useVirtualizerMock = vi.fn();

vi.mock("@tanstack/react-virtual", async () => {
  const actual = await vi.importActual<
    typeof import("@tanstack/react-virtual")
  >("@tanstack/react-virtual");

  return {
    ...actual,
    useVirtualizer: (...args: unknown[]) => useVirtualizerMock(...args),
  };
});

describe("useVirtualizedRows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 0 paddings when there are no virtual rows", async () => {
    const { useVirtualizedRows } = await import("../table/useVirtualizedRows");

    const virtualizer: MockVirtualizer = {
      getVirtualItems: () => [],
      getTotalSize: () => 0,
      scrollToIndex: vi.fn(),
    };

    useVirtualizerMock.mockReturnValue(virtualizer);

    const parentRef = { current: document.createElement("div") };
    const estimateSize = vi.fn(() => 42);

    const { result } = renderHook(() =>
      useVirtualizedRows({
        count: 0,
        parentRef,
        estimateSize,
        resetDeps: [],
      })
    );

    expect(useVirtualizerMock).toHaveBeenCalledTimes(1);

    const callArg = useVirtualizerMock.mock.calls[0]?.[0] as {
      count: number;
      getScrollElement: () => HTMLDivElement | null;
      estimateSize: () => number;
      overscan: number;
    };

    expect(callArg.count).toBe(0);
    expect(callArg.getScrollElement()).toBe(parentRef.current);
    expect(callArg.estimateSize).toBe(estimateSize);
    expect(callArg.overscan).toBe(10);

    expect(result.current.virtualRows).toEqual([]);
    expect(result.current.paddingTop).toBe(0);
    expect(result.current.paddingBottom).toBe(0);

    expect(virtualizer.scrollToIndex).not.toHaveBeenCalled();
  });

  it("computes paddingTop and paddingBottom from virtual rows and total size", async () => {
    const { useVirtualizedRows } = await import("../table/useVirtualizedRows");

    const virtualItems: MockVirtualItem[] = [
      { start: 100, size: 20 },
      { start: 120, size: 20 },
      { start: 140, size: 20 },
    ];

    const virtualizer: MockVirtualizer = {
      getVirtualItems: () => virtualItems,
      getTotalSize: () => 1000,
      scrollToIndex: vi.fn(),
    };

    useVirtualizerMock.mockReturnValue(virtualizer);

    const parentRef = { current: document.createElement("div") };
    const estimateSize = vi.fn(() => 20);

    const { result } = renderHook(() =>
      useVirtualizedRows({
        count: 200,
        parentRef,
        estimateSize,
        overscan: 5,
        resetDeps: [],
      })
    );

    expect(result.current.paddingTop).toBe(100);
    expect(result.current.paddingBottom).toBe(1000 - (140 + 20));
  });

  it("scrolls to index 0 when count > 0 and parentRef.current exists", async () => {
    const { useVirtualizedRows } = await import("../table/useVirtualizedRows");

    const virtualizer: MockVirtualizer = {
      getVirtualItems: () => [{ start: 0, size: 10 }],
      getTotalSize: () => 10,
      scrollToIndex: vi.fn(),
    };

    useVirtualizerMock.mockReturnValue(virtualizer);

    const parentRef = { current: document.createElement("div") };

    renderHook(() =>
      useVirtualizedRows({
        count: 1,
        parentRef,
        estimateSize: () => 10,
        resetDeps: [],
      })
    );

    await waitFor(() => {
      expect(virtualizer.scrollToIndex).toHaveBeenCalledTimes(1);
      expect(virtualizer.scrollToIndex).toHaveBeenCalledWith(0);
    });
  });

  it("does not scroll when parentRef.current is null", async () => {
    const { useVirtualizedRows } = await import("../table/useVirtualizedRows");

    const virtualizer: MockVirtualizer = {
      getVirtualItems: () => [{ start: 0, size: 10 }],
      getTotalSize: () => 10,
      scrollToIndex: vi.fn(),
    };

    useVirtualizerMock.mockReturnValue(virtualizer);

    const parentRef: React.RefObject<HTMLDivElement> = { current: null };

    renderHook(() =>
      useVirtualizedRows({
        count: 1,
        parentRef,
        estimateSize: () => 10,
        resetDeps: [],
      })
    );

    await new Promise((r) => setTimeout(r, 0));

    expect(virtualizer.scrollToIndex).not.toHaveBeenCalled();
  });

  it("re-scrolls when resetDeps change", async () => {
    const { useVirtualizedRows } = await import("../table/useVirtualizedRows");

    const virtualizer: MockVirtualizer = {
      getVirtualItems: () => [{ start: 0, size: 10 }],
      getTotalSize: () => 10,
      scrollToIndex: vi.fn(),
    };

    useVirtualizerMock.mockReturnValue(virtualizer);

    const parentRef = { current: document.createElement("div") };

    const { rerender } = renderHook(
      ({ dep }: { dep: string }) =>
        useVirtualizedRows({
          count: 2,
          parentRef,
          estimateSize: () => 10,
          resetDeps: [dep],
        }),
      { initialProps: { dep: "a" } }
    );

    await waitFor(() => {
      expect(virtualizer.scrollToIndex).toHaveBeenCalledTimes(1);
    });

    rerender({ dep: "b" });

    await waitFor(() => {
      expect(virtualizer.scrollToIndex).toHaveBeenCalledTimes(2);
    });
  });
});
