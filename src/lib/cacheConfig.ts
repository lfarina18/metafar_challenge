/**
 * Configuración centralizada de tiempos de caché para React Query
 */

export const CACHE_TIME = {
  /** 5 minutos - Para datos históricos y búsquedas */
  FIVE_MINUTES: 1000 * 60 * 5,

  /** 10 minutos - Garbage collection time por defecto */
  TEN_MINUTES: 1000 * 60 * 10,

  /** 1 minuto - Para búsquedas con caché corto */
  ONE_MINUTE: 1000 * 60,

  /** Infinito - Para datos estáticos que no cambian */
  INFINITE: Infinity,

  /** 0 - Para datos en tiempo real que siempre deben ser frescos */
  ZERO: 0,
} as const;

/**
 * Intervalos de refetch para modo tiempo real
 */
export const REFETCH_INTERVAL = {
  ONE_MIN: 60 * 1000,
  FIVE_MIN: 5 * 60 * 1000,
  FIFTEEN_MIN: 15 * 60 * 1000,
  THIRTY_MIN: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
  ONE_MONTH: 30 * 24 * 60 * 60 * 1000,
} as const;
