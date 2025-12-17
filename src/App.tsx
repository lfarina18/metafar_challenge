import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const StockDetailPage = React.lazy(() => import("./pages/StockDetailPage"));

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

const App: React.FC = () => {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Box
        component="main"
        role="main"
        sx={{
          width: "100%",
          maxWidth: (theme) => theme.breakpoints.values.lg,
          mx: "auto",
          px: 2,
        }}
      >
        <React.Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stock/:symbol" element={<StockDetailPage />} />
          </Routes>
        </React.Suspense>
      </Box>
    </BrowserRouter>
  );
};

export default App;
