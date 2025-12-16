import React from "react";
import { TableRow, TableCell } from "@mui/material";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { IStock } from "../../types";
import { queryKeys } from "../../lib/queryKeys";
import { stockService } from "../../services/stockService";
import { CACHE_TIME } from "../../lib/cacheConfig";

interface IStockTableRowProps {
  stock: IStock;
}

const StockTableRow: React.FC<IStockTableRowProps> = ({ stock }) => {
  const queryClient = useQueryClient();

  const rowHeight = 52;

  const preloadDetailRoute = React.useCallback(() => {
    void import("../Detail").catch(() => undefined);
  }, []);

  const preloadChartChunk = React.useCallback(() => {
    void import("../StockChart").catch(() => undefined);
  }, []);

  const prefetchStockData = React.useCallback(() => {
    void queryClient
      .prefetchQuery({
        queryKey: queryKeys.stocks.detail(stock.symbol),
        queryFn: ({ signal }) =>
          stockService.getStockData(stock.symbol, { signal }),
        staleTime: CACHE_TIME.FIVE_MINUTES,
      })
      .catch(() => undefined);
  }, [queryClient, stock.symbol]);

  const handleHover = React.useCallback(() => {
    preloadDetailRoute();
    preloadChartChunk();
    prefetchStockData();
  }, [prefetchStockData, preloadChartChunk, preloadDetailRoute]);

  return (
    <TableRow key={stock.symbol} sx={{ height: rowHeight }}>
      <TableCell>
        <Link to={`/stock/${stock.symbol}`} onMouseEnter={handleHover}>
          {stock.symbol}
        </Link>
      </TableCell>
      <TableCell>{stock.name}</TableCell>
      <TableCell>{stock.currency}</TableCell>
      <TableCell>{stock.type}</TableCell>
    </TableRow>
  );
};

export default StockTableRow;
