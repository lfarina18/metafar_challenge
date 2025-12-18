import { memo } from "react";
import { TableRow, TableCell, Skeleton } from "@mui/material";
import type { FC } from "react";

interface TableRowsSkeletonProps {
  rows?: number;
}

const TableRowsSkeleton: FC<TableRowsSkeletonProps> = ({ rows = 10 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <TableRow key={`skeleton-${idx}`}>
          <TableCell>
            <Skeleton variant="text" width="60%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="50%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="80%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="40%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="50%" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default memo(TableRowsSkeleton);
