import { Box, Button, Typography } from "@mui/material";
import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Actualiza el estado para que el siguiente renderizado muestre la interfaz de error.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Puedes registrar el error en un servicio de registro de errores
    console.error("Error capturado:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Puedes personalizar el mensaje de error aquí
      return (
        <Box
          role="alert"
          aria-live="assertive"
          sx={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            px: 2,
          }}
        >
          <Typography variant="h5">¡Ups! Algo salió mal.</Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Probá recargar la página o reintentar.
          </Typography>
          <Box display="flex" gap={1}>
            <Button variant="outlined" onClick={this.handleReset}>
              Reintentar
            </Button>
            <Button variant="contained" onClick={this.handleReload}>
              Recargar
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
