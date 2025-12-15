# Registro de línea base y mejoras de performance

## Reglas de medición (mantener constantes)

- **Cantidad de corridas**: 3 corridas por escenario (registrar cada corrida por separado)
- **Mismo flujo**: mismo texto de entrada, mismo timing, misma página

---

# React Profiler (React DevTools)

## Escenario A — Recarga (línea base)

**Objetivo**: medir el render inicial + primera pintura con datos.

### Corrida 1

- **Sesión del Profiler**: A1
- **# Commits (1/N)**: 4/7
- **Commit más pesado**:
  - **Commit #**: 4
  - **Render (ms)**: 47.1
  - **Layout effects (ms)**: 1
  - **Passive effects (ms)**: 0.3
- **Componentes más costosos (Ranked)**:
  - 1. StockTable
  - 2. Link
  - 3. MuiOutlinedInputInput
- **¿Qué causó esta actualización?**: StockTable
- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/A1_reload_commit4_flamegraph.png
  - Ruta/nombre del screenshot: metrics/profiler/A1_reload_commit4_ranked.png

![A1 Recarga - Commit 4 - Flamegraph](./metrics/profiler/A1_reload_commit4_flamegraph.png)

![A1 Recarga - Commit 4 - Ranked](./metrics/profiler/A1_reload_commit4_ranked.png)

### Corrida 2

- **Sesión del Profiler**: A2
- **# Commits (1/N)**: 4/6
- **Render del commit más pesado (ms)**: 47.6
- **Componentes más costosos (Ranked)**:
  - 1. TableRow2
  - 2. Link
  - 3. StockTable
- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/A2_reload_commit4_flamegraph.png
  - Ruta/nombre del screenshot: metrics/profiler/A2_reload_commit4_ranked.png

![A2 Recarga - Commit 4 - Flamegraph](./metrics/profiler/A2_reload_commit4_flamegraph.png)

![A2 Recarga - Commit 4 - Ranked](./metrics/profiler/A2_reload_commit4_ranked.png)

### Corrida 3

- **Sesión del Profiler**: A3
- **# Commits (1/N)**: 4/6
- **Render del commit más pesado (ms)**: 47.6
- **Componentes más costosos (Ranked)**:
  - 1. TableRow2
  - 2. Link
  - 3. StockTable
- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/A3_reload_commit4_flamegraph.png
  - Ruta/nombre del screenshot: metrics/profiler/A3_reload_commit4_ranked.png

![A3 Recarga - Commit 4 - Flamegraph](./metrics/profiler/A3_reload_commit4_flamegraph.png)

![A3 Recarga - Commit 4 - Ranked](./metrics/profiler/A3_reload_commit4_ranked.png)

### Resumen línea base (A)

- **Commits (promedio)**: 4/6
- **Render del commit más pesado (ms, promedio)**: 47.6

---

## Escenario B — Scroll/Desplazamiento (línea base)

**Objetivo**: detectar renders innecesarios durante el scroll.

### Corrida 1

- **# Commits**: 1/7
- **Render del commit más pesado (ms)**: 54.7
- **Componentes más costosos (Ranked)**:
  - 1. Routes
  - 2. SelectImput2
  - 3. StockTable
- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/B1_scroll_commit1_flamegraph.png
  - Ruta/nombre del screenshot: metrics/profiler/B1_scroll_commit1_ranked.png

![B1 Scroll - Commit 1 - Flamegraph](./metrics/profiler/B1_scroll_commit1_flamegraph.png)

![B1 Scroll - Commit 1 - Ranked](./metrics/profiler/B1_scroll_commit1_ranked.png)

### Corrida 2

- **# Commits**: 4/7
- **Render del commit más pesado (ms)**: 70.4
- - **Componentes más costosos (Ranked)**:
  - 1. StockTable
  - 2. SelectImput2
  - 3. StockTable
- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/B2_scroll_commit4_flamegraph.png
  - Ruta/nombre del screenshot: metrics/profiler/B2_scroll_commit4_ranked.png

![B1 Scroll - Commit 1 - Flamegraph](./metrics/profiler/B1_scroll_commit1_flamegraph.png)

![B1 Scroll - Commit 1 - Ranked](./metrics/profiler/B1_scroll_commit1_ranked.png)

### Corrida 3

- **# Commits**: 4/7
- **Render del commit más pesado (ms)**: 48.6
- - **Componentes más costosos (Ranked)**:
  - 1. Link
  - 2. MuiTableRowRoot
  - 3. StockTable
- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/B3_scroll_commit4_flamegraph.png
  - Ruta/nombre del screenshot: metrics/profiler/B3_scroll_commit4_ranked.png

![B3 Scroll - Commit 4 - Flamegraph](./metrics/profiler/B3_scroll_commit4_flamegraph.png)

![B3 Scroll - Commit 4 - Ranked](./metrics/profiler/B3_scroll_commit4_ranked.png)

### Resumen línea base (B)

- **Commits (promedio)**: 4/6
- **Render del commit más pesado (ms, promedio)**: 70.4

---

## Escenario C — Escritura (filtro) (línea base)

**Objetivo**: medir renders disparados por escribir y filtrar.

**Entrada usada**: Buscar por símbolo "aame"

### Corrida 1

- **# Commits**: 14/17
- **Render del commit más pesado (ms)**: 131.1
- **Componentes más costosos (Ranked)**:
  - 1. ImputBase2
  - 2. MuiIconButtonRoot
  - 3. MuiOutlinedInputInput
- **Evidencia**:

![C1 Search symbol - Commit 14 - Flamegraph](./metrics/profiler/C1_search_symbol_commit14_flamegraph.png)

![C1 Search symbol - Commit 14 - Ranked](./metrics/profiler/C1_search_symbol_commit14_ranked.png)

### Corrida 2

- **# Commits**: 4/17
- **Render del commit más pesado (ms)**: 130.1
- **Componentes más costosos (Ranked)**:
  - 1. LINK
  - 2. MuiTableRowRoot
  - 3. StockTable
- **Evidencia**:

![C2 Search symbol - Commit 4 - Flamegraph](./metrics/profiler/C2_search_symbol_commit4_flamegraph.png)

![C2 Search symbol - Commit 4 - Ranked](./metrics/profiler/C2_search_symbol_commit4_ranked.png)

### Corrida 3

- **# Commits**: 13/15
- **Render del commit más pesado (ms)**: 116
- **Componentes más costosos (Ranked)**:
  - 1. MuiTableCellRoot
  - 2. MuiOutlinedInputInput
  - 3. MuiOutlinedInputInput
- **Evidencia**:

![C3 Search symbol - Commit 13 - Flamegraph](./metrics/profiler/C3_search_symbol_commit13_flamegraph.png)

![C3 Search symbol - Commit 13 - Ranked](./metrics/profiler/C3_search_symbol_commit13_ranked.png)

### Resumen línea base (C)

- **Commits (promedio)**: 10/15
- **Render del commit más pesado (ms, promedio)**: 116

---

# Lighthouse (Preview / build de producción)

## Línea base (antes de cambios)

- **Comando**: `yarn build` + `yarn preview`
- **URL testeada**: http://localhost:8080/
- **Modo de dispositivo**:
  - Desktop
- **Scores**:
  - **Performance**: 90
  - **Accessibility**: 98
  - **Best Practices**: 100
  - **SEO**: 82
- **Métricas clave**:
  - **FCP**: 0.4s
  - **LCP**: 1.7s
  - **TBT**: 40ms
  - **CLS**: 0.093
- **Evidencia**:

  - Ruta/nombre del screenshot/reporte: metrics/lighthouse/lighthouse_before.png

  ![Lighthouse Before](./metrics/lighthouse/lighthouse_before.png)

## Después de cambios

- **Scores**:
  - **Performance**:
- **Métricas clave**:
  - **FCP**:
  - **LCP**:
  - **TBT**:
  - **CLS**:
- **Evidencia**:
  - Ruta/nombre del screenshot/reporte:

---

# Tamaño del bundle

## Línea base (antes de cambios)

Registrar el output de `yarn build`:

- **JS bundle (raw)**: 681.00 kB
- **JS bundle (gzip)**: 234.98 kB
- **Notas** (warnings de chunks, etc.):
  - Chunks > 500 kB después de minificar (warning de Vite)
  - Principal contribuidor al bundle: `highcharts/highcharts.js`
  - (!) Some chunks are larger than 500 kB after minification. Consider:
    - Using dynamic import() to code-split the application
    - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
    - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.

## Después de cambios

- **JS bundle (raw)**:
- **JS bundle (gzip)**:
- **Notas**:

---

# React Query: implementación, estrategia de caché y trade-offs

## ¿Las queries fueron implementadas?

Sí. Se implementó TanStack Query v5 a nivel de:

- **Infra**:
  - `src/lib/queryClient.ts`: `QueryClient` con `defaultOptions` + `QueryCache` para ejecutar `query.meta.onError`.
  - `src/main.tsx`: `PersistQueryClientProvider` con persister async sobre `localStorage` y `buster`.
- **Servicios** (con validación Zod + soporte de cancelación):
  - `src/services/stockService.ts`
  - `src/services/quoteService.ts`
  - `src/services/searchService.ts`
  - `src/services/shared/requestOptions.ts` (contrato único para `{ signal?: AbortSignal }`)
- **Custom hooks** (queries):
  - `src/hooks/queries/useStockList.ts`
  - `src/hooks/queries/useStockData.ts`
  - `src/hooks/queries/useStockQuote.ts`
  - `src/hooks/queries/useStockSearch.ts` (con debouncing)

### Nota sobre el uso actual en UI

- Los hooks/servicios están listos y usados para **prefetch** (`TableRow` hover y `Detail` mount).
- La **migración completa de componentes** a React Query (por ejemplo `StockTable` usando `useStockList` y búsqueda server-side con `useStockSearch`, y `StockPreferenceForm` usando `useStockData/useStockQuote`) todavía es un paso posterior.

## Estrategia de caché por tipo de dato

- **Datos estáticos: lista de acciones (`useStockList`)**

  - `staleTime`: `Infinity`
  - Persistencia: **sí**, en `localStorage` (persistimos solo `queryKey: ['stocks','list',exchange]`).
  - Motivo: dataset grande y poco cambiante; mejora tiempo de carga y reduce requests.

- **Datos históricos: time series histórico (`useStockQuote` con `realTime=false`)**

  - `staleTime`: `0` (config actual)
  - `gcTime`: `5m`
  - Motivo: el endpoint puede ser pesado; se priorizó refetch manual/estratégico. (Si se quiere alinear estrictamente con checklist, se puede subir `staleTime` a `5m` cuando `realTime=false`).

- **Datos tiempo real: time series realtime (`useStockQuote` con `realTime=true`)**

  - `staleTime`: `0`
  - `refetchInterval`: según intervalo seleccionado (`REFETCH_INTERVAL`).
  - Motivo: asegurar datos frescos y updates automáticos.

- **Búsquedas: symbol search (`useStockSearch`)**
  - `staleTime`: `1m`
  - `gcTime`: `5m`
  - Debounce: `400ms` (configurable).
  - Motivo: evitar spam de requests mientras el usuario tipea y reutilizar resultados recientes.

## Trade-offs / Decisiones

- **Persistencia selectiva**:

  - Solo persistimos la lista (`stocks.list`) para reducir tamaño y evitar guardar time series (más pesado, más volátil).

- **Buster para invalidación de cache persistida**:

  - `buster: 'stocks-cache-v1'` permite resetear el caché persistido ante cambios incompatibles (schemas/queryKeys/estrategias).

- **Validación runtime con Zod**:

  - Se detectó que `/stocks` puede devolver payload parcial, por lo que `StockSchema` se relajó (campos extendidos opcionales + `.passthrough()`) para evitar crashes.

- **Errores con TanStack Query v5**:

  - Para toasts por query se usa `query.meta.onError` y se ejecuta desde `QueryCache.onError` (v5 no expone `onError` en el objeto options como en v4).

- **Cancelación de requests (AbortSignal)**:
  - Los `queryFn` usan `({ signal })` y los services propagan `signal` a Axios.
  - Beneficio: evitar race conditions y requests innecesarias cuando cambia el input/params o se desmonta el componente.
