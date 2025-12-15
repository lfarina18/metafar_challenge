import { StrictMode, Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./errorBoundary.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.ts";

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((m) => ({
        default: m.ReactQueryDevtools,
      }))
    )
  : null;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        {ReactQueryDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="top-right"
            />
          </Suspense>
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
