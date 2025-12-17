import * as React from "react";
import { TableRow, TableCell, Skeleton } from "@mui/material";

interface TableRowsSkeletonProps {
  rows?: number;
}

const TableRowsSkeleton: React.FC<TableRowsSkeletonProps> = ({ rows = 10 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <TableRow key={`skeleton-${idx}`}>
          <TableCell>
            <Skeleton variant="text" width="60%" />
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

export default React.memo(TableRowsSkeleton);
