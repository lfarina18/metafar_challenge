import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, CircularProgress, CssBaseline } from "@mui/material";
import { lazy, Suspense } from "react";
import type { FC } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));
const StockDetailPage = lazy(() => import("./pages/StockDetailPage"));

const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

const App: FC = () => {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Box
        component="main"
        role="main"
        sx={{
          width: "100%",
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          maxWidth: (theme) => theme.breakpoints.values.lg,
          mx: "auto",
          px: { xs: 1.5, sm: 2 },
          py: { xs: 1.5, sm: 2 },
          boxSizing: "border-box",
          overflowX: "hidden",
          overflowY: "hidden",
        }}
      >
        <CssBaseline />
        <Suspense fallback={<LoadingFallback />}>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/stock/:symbol" element={<StockDetailPage />} />
            </Routes>
          </Box>
        </Suspense>
      </Box>
    </BrowserRouter>
  );
};

export default App;
