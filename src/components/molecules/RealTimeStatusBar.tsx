import { Box, Button, Typography } from "@mui/material";

interface RealTimeStatusBarProps {
  paused: boolean;
  hasNoData: boolean;
  isUpdating: boolean;
  onTogglePause: () => void;
}

const RealTimeStatusBar = ({
  paused,
  hasNoData,
  isUpdating,
  onTogglePause,
}: RealTimeStatusBarProps) => {
  return (
    <Box
      px={{ xs: 1.5, sm: 2 }}
      py={1}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={2}
      role="status"
      aria-live="polite"
    >
      <Typography variant="body2" color="text.secondary">
        Tiempo real: {paused ? "Pausado" : "Activo"}
        {hasNoData ? " (sin datos)" : isUpdating ? " (actualizando...)" : ""}
      </Typography>

      <Button
        size="small"
        variant={paused ? "contained" : "outlined"}
        onClick={onTogglePause}
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        {paused ? "Reanudar" : "Pausar"}
      </Button>
    </Box>
  );
};

export default RealTimeStatusBar;
