import React from "react";
import { TableRow, TableCell } from "@mui/material";
import { Link } from "react-router-dom";
import { IStock } from "../../types";

interface IStockTableRowProps {
  stock: IStock;
}

const StockTableRow: React.FC<IStockTableRowProps> = ({ stock }) => (
  <TableRow key={stock.symbol}>
    <TableCell>
      <Link to={`/stock/${stock.symbol}`}>{stock.symbol}</Link>
    </TableCell>
    <TableCell>{stock.name}</TableCell>
    <TableCell>{stock.currency}</TableCell>
    <TableCell>{stock.type}</TableCell>
  </TableRow>
);

export default StockTableRow;
