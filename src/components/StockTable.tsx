import * as React from "react";
import {
  Autocomplete,
  TableContainer,
  Table,
  TableBody,
  TableRow as MuiTableRow,
  TableCell,
  Box,
  Paper,
  TextField,
} from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TableHeader, TableRowsSkeleton } from "./molecules";
import TableRow from "./organisms/TableRow";
import { useStockSearch } from "../hooks/queries/useStockSearch";
import { useStockTableData } from "../hooks/useStockTableData";
import { getPublicErrorMessage } from "../utils/toast";
import type { SymbolSearchResult } from "../api/types";

const StockTable: React.FC = () => {
  const [exchange, setExchange] = React.useState<string>("NASDAQ");
  const [autocompleteInput, setAutocompleteInput] = React.useState<string>("");
  const [selectedSymbol, setSelectedSymbol] =
    React.useState<SymbolSearchResult | null>(null);

  const { stocks, data, isLoading, isError, error } = useStockTableData({
    exchange,
    selectedSymbol,
  });

  const parentRef = React.useRef<HTMLDivElement | null>(null);

  const { data: symbolSearchData, isFetching: isSymbolSearchFetching } =
    useStockSearch(autocompleteInput, {
      enabled: autocompleteInput.trim().length > 0,
      debounceMs: 400,
      outputsize: 30,
    });

  const symbolOptions = React.useMemo<SymbolSearchResult[]>(() => {
    return symbolSearchData?.data ?? [];
  }, [symbolSearchData]);

  const rowVirtualizer = useVirtualizer({
    count: stocks.length,
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
    if (stocks.length === 0) return;

    rowVirtualizer.scrollToIndex(0);
  }, [exchange, selectedSymbol?.symbol, stocks.length, rowVirtualizer]);

  const handleAutocompleteInputChange = React.useCallback(
    (
      _: React.SyntheticEvent,
      value: string,
      reason: "input" | "reset" | "clear"
    ) => {
      setAutocompleteInput(value);

      if (
        reason === "input" &&
        selectedSymbol &&
        value !== selectedSymbol.symbol
      ) {
        setSelectedSymbol(null);
      }
    },
    [selectedSymbol]
  );

  const handleAutocompleteChange = React.useCallback(
    (_: React.SyntheticEvent, value: SymbolSearchResult | null) => {
      setSelectedSymbol(value);

      if (!value) {
        setAutocompleteInput("");
        return;
      }

      setExchange(value.exchange);
      setAutocompleteInput(value.symbol);
    },
    []
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
        mb={2}
        sx={{ width: "100%" }}
      >
        <Autocomplete
          sx={{
            width: { xs: "100%", sm: 420 },
            flex: { xs: "1 1 auto", sm: "0 0 auto" },
          }}
          noOptionsText="Ingrese para buscar..."
          loadingText="Cargando..."
          options={symbolOptions}
          value={selectedSymbol}
          inputValue={autocompleteInput}
          onInputChange={handleAutocompleteInputChange}
          onChange={handleAutocompleteChange}
          loading={isSymbolSearchFetching}
          getOptionLabel={(option) =>
            `${option.symbol} - ${option.instrument_name}`
          }
          isOptionEqualToValue={(option, value) =>
            option.symbol === value.symbol &&
            option.exchange === value.exchange &&
            option.mic_code === value.mic_code
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Buscar por símbolo o nombre"
              fullWidth
            />
          )}
        />
      </Box>
      <TableContainer
        component={Paper}
        ref={parentRef}
        sx={{
          maxHeight: { xs: 520, sm: 600 },
          overflow: "auto",
          width: "100%",
        }}
      >
        <Table stickyHeader aria-label="Lista de acciones">
          <TableHeader />
          <TableBody>
            {isLoading && !data ? (
              <TableRowsSkeleton rows={10} />
            ) : isError ? (
              <MuiTableRow>
                <TableCell colSpan={5} align="center">
                  <Box role="alert" aria-live="assertive">
                    {getPublicErrorMessage(error)}
                  </Box>
                </TableCell>
              </MuiTableRow>
            ) : (
              <>
                {paddingTop > 0 ? (
                  <MuiTableRow>
                    <TableCell colSpan={5} sx={{ height: paddingTop, p: 0 }} />
                  </MuiTableRow>
                ) : null}

                {virtualRows.map((virtualRow) => {
                  const stock = stocks[virtualRow.index];

                  if (!stock) return null;

                  return (
                    <TableRow
                      key={`${stock.symbol}-${stock.exchange ?? ""}`}
                      stock={stock}
                    />
                  );
                })}

                {paddingBottom > 0 ? (
                  <MuiTableRow>
                    <TableCell
                      colSpan={5}
                      sx={{ height: paddingBottom, p: 0 }}
                    />
                  </MuiTableRow>
                ) : null}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StockTable;
