import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StockTable from "./components/StockTable";
import { Box, CircularProgress } from "@mui/material";

const Detail = React.lazy(() => import("./components/Detail"));

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
            <Route path="/" element={<StockTable />} />
            <Route path="/stock/:symbol" element={<Detail />} />
          </Routes>
        </React.Suspense>
      </Box>
    </BrowserRouter>
  );
};

export default App;
