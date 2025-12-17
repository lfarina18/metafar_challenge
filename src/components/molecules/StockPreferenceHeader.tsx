import { Box, Button } from "@mui/material";

interface StockPreferenceHeaderProps {
  symbol: string;
  name?: string;
  currency?: string;
  onBack: () => void;
}

const StockPreferenceHeader = ({
  symbol,
  name,
  currency,
  onBack,
}: StockPreferenceHeaderProps) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "auto 1fr auto" },
        alignItems: { sm: "center" },
        columnGap: { sm: 2 },
        rowGap: 1,
        width: "100%",
      }}
    >
      <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
        <Button
          type="button"
          variant="outlined"
          onClick={onBack}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Volver
        </Button>
      </Box>

      <Box
        sx={{
          fontSize: { xs: "18px", sm: "24px" },
          textAlign: { xs: "left", sm: "center" },
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {symbol} - {name} - {currency}
      </Box>

      <Box
        sx={{
          fontSize: "18px",
          textAlign: { xs: "left", sm: "right" },
        }}
      >
        Usuario: Juan
      </Box>
    </Box>
  );
};

export default StockPreferenceHeader;
