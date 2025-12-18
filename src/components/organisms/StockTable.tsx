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
import { TableHeader, TableRowsSkeleton } from "../molecules";
import TableRow from "./TableRow";
import { useStockSearch } from "../../hooks/queries/useStockSearch";
import { useStockAutocompleteState } from "../../hooks/table/useStockAutocompleteState";
import { useStockTableData } from "../../hooks/table/useStockTableData";
import { useVirtualizedRows } from "../../hooks/table/useVirtualizedRows";
import { getPublicErrorMessage } from "../../utils/toast";
import type { SymbolSearchResult } from "../../api/types";
import { useMemo, useRef } from "react";
import type { FC } from "react";

const StockTable: FC = () => {
  const {
    exchange,
    autocompleteInput,
    selectedSymbol,
    handleAutocompleteInputChange,
    handleAutocompleteChange,
  } = useStockAutocompleteState({ initialExchange: "NASDAQ" });

  const { stocks, data, isLoading, isError, error } = useStockTableData({
    exchange,
    selectedSymbol,
  });

  const parentRef = useRef<HTMLDivElement | null>(null);

  const { data: symbolSearchData, isFetching: isSymbolSearchFetching } =
    useStockSearch(autocompleteInput, {
      enabled: autocompleteInput.trim().length > 0,
      debounceMs: 400,
      outputsize: 30,
    });

  const symbolOptions = useMemo<SymbolSearchResult[]>(() => {
    return symbolSearchData?.data ?? [];
  }, [symbolSearchData]);

  const virtualizationResetDeps = useMemo(
    () => [exchange, selectedSymbol?.symbol],
    [exchange, selectedSymbol?.symbol],
  );

  const { virtualRows, paddingTop, paddingBottom } = useVirtualizedRows({
    count: stocks.length,
    parentRef,
    estimateSize: () => 52,
    overscan: 10,
    resetDeps: virtualizationResetDeps,
  });

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
          popupIcon={null}
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
