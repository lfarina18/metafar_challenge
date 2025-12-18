import { memo, type FC } from "react";
import { TableHead, TableRow, TableCell } from "@mui/material";

const StockTableHeader: FC = () => (
  <TableHead>
    <TableRow>
      <TableCell component="th" scope="col">
        Símbolo
      </TableCell>
      <TableCell component="th" scope="col">
        Exchange
      </TableCell>
      <TableCell component="th" scope="col">
        Nombre
      </TableCell>
      <TableCell component="th" scope="col">
        Moneda
      </TableCell>
      <TableCell component="th" scope="col">
        Tipo
      </TableCell>
    </TableRow>
  </TableHead>
);

export default memo(StockTableHeader);
