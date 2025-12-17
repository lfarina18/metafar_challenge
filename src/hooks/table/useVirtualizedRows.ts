import * as React from "react";
import {
  type VirtualItem,
  type Virtualizer,
  useVirtualizer,
} from "@tanstack/react-virtual";

interface UseVirtualizedRowsParams {
  count: number;
  parentRef: React.RefObject<HTMLDivElement>;
  estimateSize: () => number;
  overscan?: number;
  resetDeps: React.DependencyList;
}

interface UseVirtualizedRowsResult {
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  virtualRows: VirtualItem[];
  paddingTop: number;
  paddingBottom: number;
}

export const useVirtualizedRows = ({
  count,
  parentRef,
  estimateSize,
  overscan = 10,
  resetDeps,
}: UseVirtualizedRowsParams): UseVirtualizedRowsResult => {
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start ?? 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? virtualizer.getTotalSize() -
        ((virtualRows[virtualRows.length - 1]?.start ?? 0) +
          (virtualRows[virtualRows.length - 1]?.size ?? 0))
      : 0;

  React.useEffect(() => {
    if (!parentRef.current) return;
    if (count === 0) return;

    virtualizer.scrollToIndex(0);
  }, [count, parentRef, virtualizer, ...resetDeps]);

  return {
    virtualizer,
    virtualRows,
    paddingTop,
    paddingBottom,
  };
};
