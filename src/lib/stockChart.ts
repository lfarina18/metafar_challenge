import type { IValuesStockData } from "../types";

export const parseDatetimeToMs = (datetime: string): number => {
  const trimmed = datetime.trim();
  const hasTimeZone = /Z$|[+-]\d{2}:?\d{2}$/.test(trimmed);
  const isIsoLike = trimmed.includes("T") || hasTimeZone;

  if (isIsoLike) {
    const direct = Date.parse(trimmed);
    if (!Number.isNaN(direct)) return direct;
  }

  const parts = trimmed.split(" ");
  if (parts.length !== 2) return NaN;

  const [datePart, timePart] = parts;
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm, ss] = timePart.split(":").map(Number);

  if ([y, m, d, hh, mm].some((n) => Number.isNaN(n))) return NaN;

  return new Date(y, m - 1, d, hh, mm, Number.isNaN(ss) ? 0 : ss).getTime();
};

export const sampleValues = <T>(values: T[], maxPoints: number): T[] => {
  if (values.length <= maxPoints) return values;

  const step = Math.ceil(values.length / maxPoints);
  return values.filter(
    (_, idx) => idx % step === 0 || idx === values.length - 1,
  );
};

export const buildSeriesData = (
  values: IValuesStockData[],
  maxPoints: number,
): [number, number][] => {
  const sampledValues = sampleValues(values, maxPoints);

  const unsortedSeriesData = sampledValues
    .map((item) => {
      const t = parseDatetimeToMs(item.datetime);
      const y = parseFloat(item.close);
      if (Number.isNaN(t) || Number.isNaN(y)) return null;
      return [t, y] as [number, number];
    })
    .filter((p): p is [number, number] => p !== null);

  return unsortedSeriesData.sort((a, b) => a[0] - b[0]);
};
