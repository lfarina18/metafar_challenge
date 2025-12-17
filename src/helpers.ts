const toDateTimeLocal = (date: Date): string => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
};

const getTodayAt = (hours: number, minutes: number = 0) => {
  const now = new Date();
  const date = new Date(now);
  date.setHours(hours, minutes, 0, 0);
  return toDateTimeLocal(date);
};

export function getTodayMarketStart() {
  return getTodayAt(10, 0);
}

export function getNowClampedToMarketStart() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(10, 0, 0, 0);

  const clamped = new Date(Math.max(now.getTime(), start.getTime()));
  return toDateTimeLocal(clamped);
}
