import { useQuery } from "@tanstack/react-query";
import { quoteService } from "../../services/quoteService";
import { queryKeys } from "../../lib/queryKeys";
import { Interval, type IntervalType } from "../../api/types";
import { showErrorToast } from "../../utils/toast";
import { CACHE_TIME, REFETCH_INTERVAL } from "../../lib/cacheConfig";

interface UseStockQuoteParams {
  symbol: string;
  interval?: IntervalType;
  startDate?: string;
  endDate?: string;
  realTime?: boolean;
  enabled?: boolean;
}

const getOutputSizeForInterval = (
  interval: IntervalType,
  realTime: boolean,
  startDate?: string,
  endDate?: string
): number => {
  const MIN_OUTPUTSIZE = 30;
  const MAX_OUTPUTSIZE = 5000;
  const pointsPerDay: Record<IntervalType, number> = {
    [Interval.ONE_MIN]: 390,
    [Interval.FIVE_MIN]: 78,
    [Interval.FIFTEEN_MIN]: 26,
    [Interval.THIRTY_MIN]: 13,
    [Interval.ONE_HOUR]: 7,
    [Interval.ONE_DAY]: 1,
    [Interval.ONE_WEEK]: 1,
    [Interval.ONE_MONTH]: 1,
  };

  if (realTime) {
    const estimated = pointsPerDay[interval] || MIN_OUTPUTSIZE;
    return Math.min(Math.max(estimated, MIN_OUTPUTSIZE), MAX_OUTPUTSIZE);
  }

  if (!startDate || !endDate) {
    return 100;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const estimatedPoints = diffDays * pointsPerDay[interval];

  return Math.min(Math.max(estimatedPoints, MIN_OUTPUTSIZE), MAX_OUTPUTSIZE);
};

const INTERVAL_MAP: Record<IntervalType, number> = {
  [Interval.ONE_MIN]: REFETCH_INTERVAL.ONE_MIN,
  [Interval.FIVE_MIN]: REFETCH_INTERVAL.FIVE_MIN,
  [Interval.FIFTEEN_MIN]: REFETCH_INTERVAL.FIFTEEN_MIN,
  [Interval.THIRTY_MIN]: REFETCH_INTERVAL.THIRTY_MIN,
  [Interval.ONE_HOUR]: REFETCH_INTERVAL.ONE_HOUR,
  [Interval.ONE_DAY]: REFETCH_INTERVAL.ONE_DAY,
  [Interval.ONE_WEEK]: REFETCH_INTERVAL.ONE_WEEK,
  [Interval.ONE_MONTH]: REFETCH_INTERVAL.ONE_MONTH,
} as const;

export const useStockQuote = ({
  symbol,
  interval = Interval.FIVE_MIN,
  startDate,
  endDate,
  realTime = false,
  enabled = true,
}: UseStockQuoteParams) => {
  const getRefetchInterval = (): number | false => {
    if (!realTime) return false;
    return INTERVAL_MAP[interval] || REFETCH_INTERVAL.FIVE_MIN;
  };

  const shouldFetch = enabled && Boolean(symbol && startDate && endDate);
  const outputsize = getOutputSizeForInterval(
    interval,
    realTime,
    startDate,
    endDate
  );

  const query = useQuery({
    queryKey: queryKeys.quotes.detail({ symbol, interval, startDate, endDate }),
    queryFn: ({ signal }) =>
      quoteService.getStockQuote(
        {
          symbol,
          interval,
          start_date: startDate,
          end_date: endDate,
          outputsize,
        },
        { signal }
      ),
    staleTime: 0,
    gcTime: CACHE_TIME.FIVE_MINUTES,
    refetchInterval: getRefetchInterval(),
    enabled: shouldFetch,
    meta: {
      onError: () => {
        showErrorToast(
          "Error al cargar los datos. Por favor, intenta nuevamente."
        );
      },
    },
  });

  return query;
};
