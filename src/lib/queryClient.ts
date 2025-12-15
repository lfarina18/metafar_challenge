import { QueryCache, QueryClient } from "@tanstack/react-query";
import { CACHE_TIME } from "./cacheConfig";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const meta = query.meta as
        | undefined
        | { onError?: (err: unknown) => void };
      meta?.onError?.(error);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: CACHE_TIME.FIVE_MINUTES,
      gcTime: CACHE_TIME.TEN_MINUTES,
      retry: (failureCount, error) => {
        if (error instanceof Error && "response" in error) {
          const status = (error as { response?: { status?: number } }).response
            ?.status;
          if (status && status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => {
        return Math.min(1000 * 2 ** attemptIndex, 30000);
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
