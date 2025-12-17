import { StrictMode, Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./errorBoundary.tsx";
import type { Query } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "./lib/queryClient.ts";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((m) => ({
        default: m.ReactQueryDevtools,
      }))
    )
  : null;

const asyncLocalStorage = {
  getItem: async (key: string) => window.localStorage.getItem(key),
  setItem: async (key: string, value: string) => {
    window.localStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    window.localStorage.removeItem(key);
  },
};

const CACHE_BUSTER = "stocks-cache-v1";

const persister = createAsyncStoragePersister({
  storage: asyncLocalStorage,
});

const shouldDehydrateQuery = (query: Query): boolean => {
  const key = query.queryKey as unknown as unknown[];
  return key[0] === "stocks" && key[1] === "list";
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          buster: CACHE_BUSTER,
          maxAge: 1000 * 60 * 60 * 24 * 7,
          dehydrateOptions: {
            shouldDehydrateQuery,
          },
        }}
      >
        <App />
        <Toaster position="top-center" />
        {ReactQueryDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="bottom-left"
            />
          </Suspense>
        )}
      </PersistQueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
