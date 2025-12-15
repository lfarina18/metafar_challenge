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
