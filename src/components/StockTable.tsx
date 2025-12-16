import * as React from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow as MuiTableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TextField, TableHeader, TableRow } from "./atomics/index";
import { ClipLoader } from "react-spinners";
import { IStock } from "../types";
import useDebounce from "../hooks/useDebounce";
import { useStockList } from "../hooks/queries/useStockList";

const StockTable: React.FC = () => {
  const [searchName, setSearchName] = React.useState<string>("");
  const [searchSymbol, setSearchSymbol] = React.useState<string>("");

  const { data, isLoading, isError } = useStockList();

  const stocks: IStock[] = React.useMemo(() => {
    return (
      data?.data.map((s) => ({
        symbol: s.symbol,
        name: s.name,
        currency: s.currency,
        type: s.type,
      })) ?? []
    );
  }, [data]);

  const parentRef = React.useRef<HTMLDivElement | null>(null);

  const debouncedSearchName = useDebounce(searchName, 500);
  const debouncedSearchSymbol = useDebounce(searchSymbol, 500);

  const filteredStocks = React.useMemo(() => {
    const name = debouncedSearchName.trim().toLowerCase();
    const symbol = debouncedSearchSymbol.trim().toLowerCase();

    if (!name && !symbol) return stocks;

    return stocks.filter((stock) => {
      return (
        stock.name.toLowerCase().includes(name) &&
        stock.symbol.toLowerCase().includes(symbol)
      );
    });
  }, [debouncedSearchName, debouncedSearchSymbol, stocks]);

  const rowVirtualizer = useVirtualizer({
    count: filteredStocks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start ?? 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? rowVirtualizer.getTotalSize() -
        ((virtualRows[virtualRows.length - 1]?.start ?? 0) +
          (virtualRows[virtualRows.length - 1]?.size ?? 0))
      : 0;

  React.useEffect(() => {
    if (!parentRef.current) return;
    if (filteredStocks.length === 0) return;

    rowVirtualizer.scrollToIndex(0);
  }, [
    debouncedSearchName,
    debouncedSearchSymbol,
    filteredStocks.length,
    rowVirtualizer,
  ]);

  function handleSearchNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchName(event.target.value);
  }

  function handleSearchSymbolChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setSearchSymbol(event.target.value);
  }

  return (
    <>
      <TextField
        label="Buscar por nombre"
        value={searchName}
        onChange={handleSearchNameChange}
      />
      <TextField
        label="Buscar por símbolo"
        value={searchSymbol}
        onChange={handleSearchSymbolChange}
      />
      <TableContainer
        component={Paper}
        ref={parentRef}
        sx={{ maxHeight: 600, overflow: "auto" }}
      >
        <Table stickyHeader>
          <TableHeader />
          <TableBody>
            {isLoading && !data ? (
              <MuiTableRow>
                <TableCell colSpan={4} align="center">
                  <ClipLoader color="#0000ff" loading size={50} />
                </TableCell>
              </MuiTableRow>
            ) : isError ? (
              <MuiTableRow>
                <TableCell colSpan={4} align="center">
                  Error al cargar la lista.
                </TableCell>
              </MuiTableRow>
            ) : (
              <>
                {paddingTop > 0 ? (
                  <MuiTableRow>
                    <TableCell colSpan={4} sx={{ height: paddingTop, p: 0 }} />
                  </MuiTableRow>
                ) : null}

                {virtualRows.map((virtualRow) => {
                  const stock = filteredStocks[virtualRow.index];

                  if (!stock) return null;

                  return <TableRow key={stock.symbol} stock={stock} />;
                })}

                {paddingBottom > 0 ? (
                  <MuiTableRow>
                    <TableCell
                      colSpan={4}
                      sx={{ height: paddingBottom, p: 0 }}
                    />
                  </MuiTableRow>
                ) : null}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default StockTable;
