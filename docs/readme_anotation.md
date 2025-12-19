# Registro de línea base y mejoras de performance

## Reglas de medición (mantener constantes)

- **Cantidad de corridas**: 3 corridas por escenario (registrar cada corrida por separado)
- **Mismo flujo**: mismo texto de entrada, mismo timing, misma página

## Comandos del proyecto

Los siguientes comandos están disponibles vía `yarn <script>` (ver `package.json`).

| Comando              | Descripción                                                    | Cuándo usar                                                       |
| -------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------- |
| `yarn dev`           | Levanta el servidor de desarrollo con HMR (Vite).              | Desarrollo local y capturas de React Profiler (DevTools).         |
| `yarn build`         | Compila TypeScript y genera build de producción (`dist/`).     | Validar build final y medir bundle/Lighthouse en `preview`.       |
| `yarn preview`       | Sirve el build de producción en local.                         | Medición de Lighthouse y verificación de comportamiento en build. |
| `yarn typecheck`     | Typecheck sin emitir archivos.                                 | Validación rápida de tipos (también corre en `pre-push`).         |
| `yarn lint`          | Ejecuta ESLint en todo el repo (falla con warnings).           | Antes de entregar o para CI.                                      |
| `yarn lint:fix`      | ESLint con auto-fix.                                           | Correcciones rápidas locales.                                     |
| `yarn format`        | Prettier sobre todo el repo.                                   | Mantener formato consistente (ideal antes de entregar).           |
| `yarn format:check`  | Verifica formato sin escribir.                                 | CI / validación previa a PR.                                      |
| `yarn test`          | Ejecuta Vitest en modo watch/interactivo.                      | Desarrollo de tests.                                              |
| `yarn test:run`      | Ejecuta Vitest una sola vez (no interactivo).                  | Hooks/CI (corre en `pre-push`).                                   |
| `yarn test:coverage` | Ejecuta tests con reporte de coverage.                         | Generar evidencia final de cobertura.                             |
| `yarn analyze`       | Genera reporte de bundle visualizer en `docs/metrics/bundle/`. | Análisis de bundle y evidencia.                                   |
| `yarn prepare`       | Inicializa Husky (hooks).                                      | Se ejecuta automáticamente tras `yarn install`.                   |

### Husky / hooks

- **pre-commit**: corre `yarn lint-staged`.
- **pre-push**: corre `yarn typecheck` y `yarn test:run`.

Si necesitás saltear hooks en un caso excepcional:

```bash
git commit --no-verify
```

---

# React Profiler (React DevTools)

## Línea base inicial (histórico)

### Escenario A — Recarga (línea base)

**Objetivo**: medir el render inicial + primera pintura con datos.

#### Corrida 1

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

#### Corrida 2

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

#### Corrida 3

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

### Escenario B — Scroll/Desplazamiento (línea base)

**Objetivo**: detectar renders innecesarios durante el scroll.

#### Corrida 1

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

#### Corrida 2

- **# Commits**: 4/7
- **Render del commit más pesado (ms)**: 70.4
- **Componentes más costosos (Ranked)**:
  - 1. StockTable
  - 2. SelectImput2
  - 3. StockTable
- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/B2_scroll_commit4_flamegraph.png
  - Ruta/nombre del screenshot: metrics/profiler/B2_scroll_commit4_ranked.png

![B2 Scroll - Commit 4 - Flamegraph](./metrics/profiler/B2_scroll_commit4_flamegraph.png)

![B2 Scroll - Commit 4 - Ranked](./metrics/profiler/B2_scroll_commit4_ranked.png)

#### Corrida 3

- **# Commits**: 4/7
- **Render del commit más pesado (ms)**: 48.6
- **Componentes más costosos (Ranked)**:
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

### Escenario C — Escritura (filtro) (línea base)

**Objetivo**: medir renders disparados por escribir y filtrar.

**Entrada usada**: Buscar por símbolo "aame"

#### Corrida 1

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

## Línea base (antes de virtual scroll + React Query)

### Escenario A — Recarga

#### Corrida 1 (A1)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/A1_reload_commit5_flamegraph-before-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/A1_reload_commit5_ranked-before-virtual-react-query.png

![A1 Recarga - Commit 5 - Flamegraph (before virtual/react-query)](./metrics/profiler/A1_reload_commit5_flamegraph-before-virtual-react-query.png)

![A1 Recarga - Commit 5 - Ranked (before virtual/react-query)](./metrics/profiler/A1_reload_commit5_ranked-before-virtual-react-query.png)

#### Corrida 2 (A2)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/A2_reload_commit8_flamegraph-before-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/A2_reload_commit8_ranked-before-virtual-react-query.png

![A2 Recarga - Commit 8 - Flamegraph (before virtual/react-query)](./metrics/profiler/A2_reload_commit8_flamegraph-before-virtual-react-query.png)

![A2 Recarga - Commit 8 - Ranked (before virtual/react-query)](./metrics/profiler/A2_reload_commit8_ranked-before-virtual-react-query.png)

#### Corrida 3 (A3)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/A3_reload_commit5_flamegraph-before-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/A3_reload_commit5_ranked-before-virtual-react-query.png

![A3 Recarga - Commit 5 - Flamegraph (before virtual/react-query)](./metrics/profiler/A3_reload_commit5_flamegraph-before-virtual-react-query.png)

![A3 Recarga - Commit 5 - Ranked (before virtual/react-query)](./metrics/profiler/A3_reload_commit5_ranked-before-virtual-react-query.png)

---

### Escenario B — Scroll/Desplazamiento

#### Corrida 1 (B1)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/B1_scroll_commit5_flamegraph-before-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/B1_scroll_commit5_ranked-before-virtual-react-query.png

![B1 Scroll - Commit 5 - Flamegraph (before virtual/react-query)](./metrics/profiler/B1_scroll_commit5_flamegraph-before-virtual-react-query.png)

![B1 Scroll - Commit 5 - Ranked (before virtual/react-query)](./metrics/profiler/B1_scroll_commit5_ranked-before-virtual-react-query.png)

#### Corrida 2 (B2)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/B2_scroll_commit1_flamegraph-before-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/B2_scroll_commit1_ranked-before-virtual-react-query.png

![B2 Scroll - Commit 1 - Flamegraph (before virtual/react-query)](./metrics/profiler/B2_scroll_commit1_flamegraph-before-virtual-react-query.png)

![B2 Scroll - Commit 1 - Ranked (before virtual/react-query)](./metrics/profiler/B2_scroll_commit1_ranked-before-virtual-react-query.png)

#### Corrida 3 (B3)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/B3_scroll_commit5_flamegraph-before-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/B3_scroll_commit5_ranked-before-virtual-react-query.png

![B3 Scroll - Commit 5 - Flamegraph (before virtual/react-query)](./metrics/profiler/B3_scroll_commit5_flamegraph-before-virtual-react-query.png)

![B3 Scroll - Commit 5 - Ranked (before virtual/react-query)](./metrics/profiler/B3_scroll_commit5_ranked-before-virtual-react-query.png)

---

### Escenario C — Escritura (filtro)

**Entrada usada**: Buscar por símbolo "aame"

#### Corrida 1 (C1)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/C1_search_symbol_commit13_flamegraph-before-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/C1_search_symbol_commit13_ranked-before-virtual-react-query.png

![C1 Escritura - Commit 13 - Flamegraph (before virtual/react-query)](./metrics/profiler/C1_search_symbol_commit13_flamegraph-before-virtual-react-query.png)

![C1 Escritura - Commit 13 - Ranked (before virtual/react-query)](./metrics/profiler/C1_search_symbol_commit13_ranked-before-virtual-react-query.png)

#### Corrida 2 (C2)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/C2_search_symbol_commit15_flamegraph-before-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/C2_search_symbol_commit15_ranked-before-virtual-react-query.png

![C2 Escritura - Commit 15 - Flamegraph (before virtual/react-query)](./metrics/profiler/C2_search_symbol_commit15_flamegraph-before-virtual-react-query.png)

![C2 Escritura - Commit 15 - Ranked (before virtual/react-query)](./metrics/profiler/C2_search_symbol_commit15_ranked-before-virtual-react-query.png)

#### Corrida 3 (C3)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/C3_search_symbol_commit1_flamegraph-before-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/C3_search_symbol_commit1_ranked-before-virtual-react-query.png

![C3 Escritura - Commit 1 - Flamegraph (before virtual/react-query)](./metrics/profiler/C3_search_symbol_commit1_flamegraph-before-virtual-react-query.png)

![C3 Escritura - Commit 1 - Ranked (before virtual/react-query)](./metrics/profiler/C3_search_symbol_commit1_ranked-before-virtual-react-query.png)

---

## Después de cambios (after virtual scroll + React Query)

### Escenario A — Recarga

#### Corrida 1 (A1)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/A1_reload_commit3_flamegraph-after-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/A1_reload_commit3_ranked-after-virtual-react-query.png

![A1 Recarga - Commit 3 - Flamegraph (after virtual/react-query)](./metrics/profiler/A1_reload_commit3_flamegraph-after-virtual-react-query.png)

![A1 Recarga - Commit 3 - Ranked (after virtual/react-query)](./metrics/profiler/A1_reload_commit3_ranked-after-virtual-react-query.png)

#### Corrida 2 (A2)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/A2_reload_commit3_flamegraph-after-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/A2_reload_commit3_ranked-after-virtual-react-query.png

![A2 Recarga - Commit 3 - Flamegraph (after virtual/react-query)](./metrics/profiler/A2_reload_commit3_flamegraph-after-virtual-react-query.png)

![A2 Recarga - Commit 3 - Ranked (after virtual/react-query)](./metrics/profiler/A2_reload_commit3_ranked-after-virtual-react-query.png)

#### Corrida 3 (A3)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/A3_reload_commit2_flamegraph-after-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/A3_reload_commit2_ranked-after-virtual-react-query.png

![A3 Recarga - Commit 2 - Flamegraph (after virtual/react-query)](./metrics/profiler/A3_reload_commit2_flamegraph-after-virtual-react-query.png)

![A3 Recarga - Commit 2 - Ranked (after virtual/react-query)](./metrics/profiler/A3_reload_commit2_ranked-after-virtual-react-query.png)

### Escenario B — Scroll/Desplazamiento

#### Corrida 1 (B1)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/B1_scroll_commit29_flamegraph-after-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/B1_scroll_commit29_ranked-after-virtual-react-query.png

![B1 Scroll - Commit 29 - Flamegraph (after virtual/react-query)](./metrics/profiler/B1_scroll_commit29_flamegraph-after-virtual-react-query.png)

![B1 Scroll - Commit 29 - Ranked (after virtual/react-query)](./metrics/profiler/B1_scroll_commit29_ranked-after-virtual-react-query.png)

#### Corrida 2 (B2)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/B2_scroll_commit31_flamegraph-after-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/B2_scroll_commit31_ranked-after-virtual-react-query.png

![B2 Scroll - Commit 31 - Flamegraph (after virtual/react-query)](./metrics/profiler/B2_scroll_commit31_flamegraph-after-virtual-react-query.png)

![B2 Scroll - Commit 31 - Ranked (after virtual/react-query)](./metrics/profiler/B2_scroll_commit31_ranked-after-virtual-react-query.png)

#### Corrida 3 (B3)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/B3_scroll_commit25_flamegraph-after-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/B3_scroll_commit25_ranked-after-virtual-react-query.png

![B3 Scroll - Commit 25 - Flamegraph (after virtual/react-query)](./metrics/profiler/B3_scroll_commit25_flamegraph-after-virtual-react-query.png)

![B3 Scroll - Commit 25 - Ranked (after virtual/react-query)](./metrics/profiler/B3_scroll_commit25_ranked-after-virtual-react-query.png)

### Escenario C — Escritura (filtro)

#### Corrida 1 (C1)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/C1_search_symbol_commit8_flamegraph-after-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/C1_search_symbol_commit8_ranked-after-virtual-react-query.png

![C1 Escritura - Commit 8 - Flamegraph (after virtual/react-query)](./metrics/profiler/C1_search_symbol_commit8_flamegraph-after-virtual-react-query.png)

![C1 Escritura - Commit 8 - Ranked (after virtual/react-query)](./metrics/profiler/C1_search_symbol_commit8_ranked-after-virtual-react-query.png)

#### Corrida 2 (C2)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/C2_search_symbol_commit10_flamegraph-after-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/C2_search_symbol_commit10_ranked-after-virtual-react-query.png

![C2 Escritura - Commit 10 - Flamegraph (after virtual/react-query)](./metrics/profiler/C2_search_symbol_commit10_flamegraph-after-virtual-react-query.png)

![C2 Escritura - Commit 10 - Ranked (after virtual/react-query)](./metrics/profiler/C2_search_symbol_commit10_ranked-after-virtual-react-query.png)

#### Corrida 3 (C3)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/C3_search_symbol_commit9_flamegraph-after-virtual-react-query.png
  - Ruta/nombre del screenshot: metrics/profiler/C3_search_symbol_commit9_ranked-after-virtual-react-query.png

![C3 Escritura - Commit 9 - Flamegraph (after virtual/react-query)](./metrics/profiler/C3_search_symbol_commit9_flamegraph-after-virtual-react-query.png)

![C3 Escritura - Commit 9 - Ranked (after virtual/react-query)](./metrics/profiler/C3_search_symbol_commit9_ranked-after-virtual-react-query.png)

---

## Línea base (antes de optimización de re-renders)

### Escenario A — Recarga

#### Corrida 1 (A1)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/RR_A1_reload_commit1_flamegraph-before-rerender-optimizations.png
  - Ruta/nombre del screenshot: metrics/profiler/RR_A1_reload_commit1_ranked-before-rerender-optimizations.png

![RR A1 Recarga - Commit 1 - Flamegraph (before rerender optimizations)](./metrics/profiler/RR_A1_reload_commit1_flamegraph-before-rerender-optimizations.png)

![RR A1 Recarga - Commit 1 - Ranked (before rerender optimizations)](./metrics/profiler/RR_A1_reload_commit1_ranked-before-rerender-optimizations.png)

#### Corrida 2 (A2)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/RR_A2_reload_commit1_flamegraph-before-rerender-optimizations.png
  - Ruta/nombre del screenshot: metrics/profiler/RR_A2_reload_commit1_ranked-before-rerender-optimizations.png

![RR A2 Recarga - Commit 1 - Flamegraph (before rerender optimizations)](./metrics/profiler/RR_A2_reload_commit1_flamegraph-before-rerender-optimizations.png)

![RR A2 Recarga - Commit 1 - Ranked (before rerender optimizations)](./metrics/profiler/RR_A2_reload_commit1_ranked-before-rerender-optimizations.png)

#### Corrida 3 (A3)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/RR_A3_reload_commit2_flamegraph-before-rerender-optimizations.png
  - Ruta/nombre del screenshot: metrics/profiler/RR_A3_reload_commit2_ranked-before-rerender-optimizations.png

![RR A3 Recarga - Commit 2 - Flamegraph (before rerender optimizations)](./metrics/profiler/RR_A3_reload_commit2_flamegraph-before-rerender-optimizations.png)

![RR A3 Recarga - Commit 2 - Ranked (before rerender optimizations)](./metrics/profiler/RR_A3_reload_commit2_ranked-before-rerender-optimizations.png)

---

### Escenario B — Scroll/Desplazamiento

#### Corrida 1 (B1)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/RR_B1_scroll_commit40_flamegraph-before-rerender-optimizations.png
  - Ruta/nombre del screenshot: metrics/profiler/RR_B1_scroll_commit40_ranked-before-rerender-optimizations.png

![RR B1 Scroll - Commit 40 - Flamegraph (before rerender optimizations)](./metrics/profiler/RR_B1_scroll_commit40_flamegraph-before-rerender-optimizations.png)

![RR B1 Scroll - Commit 40 - Ranked (before rerender optimizations)](./metrics/profiler/RR_B1_scroll_commit40_ranked-before-rerender-optimizations.png)

#### Corrida 2 (B2)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/RR_B2_scroll_commit20_flamegraph-before-rerender-optimizations.png
  - Ruta/nombre del screenshot: metrics/profiler/RR_B2_scroll_commit20_ranked-before-rerender-optimizations.png

![RR B2 Scroll - Commit 20 - Flamegraph (before rerender optimizations)](./metrics/profiler/RR_B2_scroll_commit20_flamegraph-before-rerender-optimizations.png)

![RR B2 Scroll - Commit 20 - Ranked (before rerender optimizations)](./metrics/profiler/RR_B2_scroll_commit20_ranked-before-rerender-optimizations.png)

#### Corrida 3 (B3)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/RR_B3_scroll_commit58_flamegraph-before-rerender-optimizations.png
  - Ruta/nombre del screenshot: metrics/profiler/RR_B3_scroll_commit58_ranked-before-rerender-optimizations.png

![RR B3 Scroll - Commit 58 - Flamegraph (before rerender optimizations)](./metrics/profiler/RR_B3_scroll_commit58_flamegraph-before-rerender-optimizations.png)

![RR B3 Scroll - Commit 58 - Ranked (before rerender optimizations)](./metrics/profiler/RR_B3_scroll_commit58_ranked-before-rerender-optimizations.png)

---

### Escenario C — Escritura (filtro)

**Entrada usada**: Buscar por símbolo "aame"

#### Corrida 1 (C1)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/RR_C1_search_symbol_commit15_flamegraph-before-rerender-optimizations.png
  - Ruta/nombre del screenshot: metrics/profiler/RR_C1_search_symbol_commit15_ranked-before-rerender-optimizations.png

![RR C1 Escritura - Commit 15 - Flamegraph (before rerender optimizations)](./metrics/profiler/RR_C1_search_symbol_commit15_flamegraph-before-rerender-optimizations.png)

![RR C1 Escritura - Commit 15 - Ranked (before rerender optimizations)](./metrics/profiler/RR_C1_search_symbol_commit15_ranked-before-rerender-optimizations.png)

#### Corrida 2 (C2)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/RR_C2_search_symbol_commit13_flamegraph-before-rerender-optimizations.png
  - Ruta/nombre del screenshot: metrics/profiler/RR_C2_search_symbol_commit13_ranked-before-rerender-optimizations.png

![RR C2 Escritura - Commit 13 - Flamegraph (before rerender optimizations)](./metrics/profiler/RR_C2_search_symbol_commit13_flamegraph-before-rerender-optimizations.png)

![RR C2 Escritura - Commit 13 - Ranked (before rerender optimizations)](./metrics/profiler/RR_C2_search_symbol_commit13_ranked-before-rerender-optimizations.png)

#### Corrida 3 (C3)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/RR_C3_search_symbol_commit15_flamegraph-before-rerender-optimizations.png
  - Ruta/nombre del screenshot: metrics/profiler/RR_C3_search_symbol_commit15_ranked-before-rerender-optimizations.png

![RR C3 Escritura - Commit 15 - Flamegraph (before rerender optimizations)](./metrics/profiler/RR_C3_search_symbol_commit15_flamegraph-before-rerender-optimizations.png)

![RR C3 Escritura - Commit 15 - Ranked (before rerender optimizations)](./metrics/profiler/RR_C3_search_symbol_commit15_ranked-before-rerender-optimizations.png)

---

### Escenario D — Navegación a detalle + gráfico

#### Corrida 1 (D1)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/RR_D1_reload_commit4_flamegraph-before-rerender-optimizations.png
  - Ruta/nombre del screenshot: metrics/profiler/RR_D1_reload_commit4_ranked-before-rerender-optimizations.png

![RR D1 Detail - Commit 4 - Flamegraph (before rerender optimizations)](./metrics/profiler/RR_D1_reload_commit4_flamegraph-before-rerender-optimizations.png)

![RR D1 Detail - Commit 4 - Ranked (before rerender optimizations)](./metrics/profiler/RR_D1_reload_commit4_ranked-before-rerender-optimizations.png)

#### Corrida 2 (D2)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/RR_D2_reload_commit1_flamegraph-before-rerender-optimizations.png
  - Ruta/nombre del screenshot: metrics/profiler/RR_D2_reload_commit1_ranked-before-rerender-optimizations.png

![RR D2 Detail - Commit 1 - Flamegraph (before rerender optimizations)](./metrics/profiler/RR_D2_reload_commit1_flamegraph-before-rerender-optimizations.png)

![RR D2 Detail - Commit 1 - Ranked (before rerender optimizations)](./metrics/profiler/RR_D2_reload_commit1_ranked-before-rerender-optimizations.png)

#### Corrida 3 (D3)

- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/profiler/RR_D3_reload_commit1_flamegraph-before-rerender-optimizations.png
  - Ruta/nombre del screenshot: metrics/profiler/RR_D3_reload_commit1_ranked-before-rerender-optimizations.png

![RR D3 Detail - Commit 1 - Flamegraph (before rerender optimizations)](./metrics/profiler/RR_D3_reload_commit1_flamegraph-before-rerender-optimizations.png)

![RR D3 Detail - Commit 1 - Ranked (before rerender optimizations)](./metrics/profiler/RR_D3_reload_commit1_ranked-before-rerender-optimizations.png)

---

## Optimización de re-renders (implementación - resumen escrito)

### Implementado

- **`React.memo` en `TableRow`** (`src/components/organisms/TableRow.tsx`):
  - Se memoizó la fila con un comparator por campos (`symbol/name/currency/type`).
  - **Objetivo**: evitar renders redundantes de filas visibles durante updates frecuentes del virtualizer/scroll cuando el `stock` no cambió.

- **`React.memo` en componentes atómicos**:
  - **`TextField`** (`src/components/atoms/TextField.tsx`)
  - **`TableHeader`** (`src/components/molecules/TableHeader.tsx`)
  - **Objetivo**: que inputs y header no se re-rendericen por renders del padre (`StockTable`) que no cambian sus props.

- **`useCallback` en handlers de búsqueda** (`src/components/organisms/StockTable.tsx`):
  - `handleSearchNameChange` y `handleSearchSymbolChange` se estabilizaron con `useCallback`.
  - **Objetivo**: mantener estable la identidad de `onChange` y aprovechar la memoización del `TextField`.

- **`useMemo` + `React.memo` en `StockChart`** (`src/components/organisms/StockChart.tsx`):
  - `chartOptions` se memorizó con `useMemo` (evita recomputar mapeos sobre `values`).
  - El componente se exporta con `React.memo`.
  - **Objetivo**: reducir recomputación y re-renders en el gráfico cuando `stockData` no cambia.

- **`useMemo` en filtrado** (`src/components/organisms/StockTable.tsx`):
  - `filteredStocks` se calcula con `useMemo` en base a `debouncedSearchName/debouncedSearchSymbol`.
  - **Objetivo**: evitar recalcar filtrado en renders no relacionados a la búsqueda.

---

## Optimizaciones adicionales de React Query (implementación - resumen escrito)

### Implementado

- **`structuralSharing: true`**
  - Se usa el comportamiento por defecto de TanStack Query (no se desactivó).
  - **Objetivo**: mantener referencias estables cuando la data no cambia, reduciendo re-renders.

- **`placeholderData` / `keepPreviousData` para transiciones suaves**
  - `useStockList` (`src/hooks/queries/useStockList.ts`) usa `placeholderData: (previousData) => previousData`.
  - `useStockSearch` (`src/hooks/queries/useStockSearch.ts`) usa `placeholderData: (previousData) => previousData`.
  - `useStockQuote` (`src/hooks/queries/useStockQuote.ts`) usa `placeholderData: keepPreviousData`.
  - **Objetivo**: evitar flicker o “pantallas vacías” al cambiar parámetros y mientras se resuelve la nueva request.

- **`select` para transformar datos solo cuando es necesario**
  - `useStockQuote` (`src/hooks/queries/useStockQuote.ts`) usa `select` para ordenar `values` por `datetime`.
  - **Objetivo**: mover transformaciones a la capa de query (cerca de la data) y entregar al UI un shape estable/predecible.

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
- **Tiempo de carga inicial (proxy)**: LCP
- **Evidencia**:
  - Ruta/nombre del screenshot/reporte: metrics/lighthouse/lighthouse_before.png

  - Ruta/nombre del screenshot/reporte: metrics/lighthouse/lighthouse-before-virtual.png (preview)

  ![Lighthouse Before](./metrics/lighthouse/lighthouse_before.png)

  ![Lighthouse Before Virtual](./metrics/lighthouse/lighthouse-before-virtual.png)

## Después de cambios

- **Scores**:
  - **Performance**: 100
  - **Accessibility**: 100
  - **Best Practices**: 100
  - **SEO**: 100
- **Métricas clave**:
  - **FCP**: 0.4s
  - **LCP**: 0.5s
  - **TBT**: 0ms
  - **CLS**: 0
- **Tiempo de carga inicial (proxy)**: LCP
- **Notas (cambios que habilitaron 100/100)**:
  - **A11y (labels / landmarks / semántica)**:
    - Asociar `label` a inputs (`htmlFor`/`id`) y `aria-label` como fallback en atómicos.
    - Agregar `main` landmark en el layout raíz.
    - Semántica de tabla: headers como `th` con `scope="col"`.
    - Anuncios de estado: `role="status"`/`role="alert"` + `aria-live` en loading/error.

  - **SEO (crawling/indexing)**:
    - `public/robots.txt` válido.
    - `public/sitemap.xml` + referencia desde `robots.txt`.
    - `lang="es-AR"` en `index.html`.

- **Evidencia**:
  - Ruta/nombre del screenshot/reporte: metrics/lighthouse/lighthouse-after-virtual.png
  - Ruta/nombre del screenshot/reporte: metrics/lighthouse/lighthouse-100.png

  ![Lighthouse After Virtual](./metrics/lighthouse/lighthouse-after-virtual.png)

  ![Lighthouse 100](./metrics/lighthouse/lighthouse-100.png)

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

### Línea base (antes de code splitting y lazy loading)

Registrar el output de `yarn build`:

- **JS bundle (raw)**: 805.01 kB
- **JS bundle (gzip)**: 271.78 kB
- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/bundle/build-before-code-splliting-and-lazy-loading.png

  ![Build before code splitting/lazy loading](./metrics/bundle/build-before-code-splliting-and-lazy-loading.png)

## Después de cambios

- **JS bundle (raw)**:
  - `dist/assets/index-Cl7JHqTl.js`: 496.14 kB
  - `dist/assets/Detail-C6G-CoSt.js`: 23.87 kB
  - `dist/assets/StockChart-BRa0eoi8.js`: 288.05 kB
- **JS bundle (gzip)**:
  - `dist/assets/index-Cl7JHqTl.js`: 159.56 kB
  - `dist/assets/Detail-C6G-CoSt.js`: 8.10 kB
  - `dist/assets/StockChart-BRa0eoi8.js`: 106.63 kB
- **Notas**:
  - Se generó un chunk separado para `Detail` mediante `React.lazy()`.
  - Se generó un chunk separado para `StockChart` (Highcharts) mediante `React.lazy()`.
  - Se implementó preloading del chunk de `Detail` y `StockChart` al hacer hover sobre los links en la tabla.
- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/bundle/build-after-code-splliting-and-lazy-loading.png

  ![Build after code splitting/lazy loading](./metrics/bundle/build-after-code-splliting-and-lazy-loading.png)

### Build final (estado actual)

Registrar el output de `yarn build`:

- **JS bundle (raw)**:
  - `dist/assets/index-CddexZV8.js`: 303.58 kB
  - `dist/assets/useStockData-B7W0p2v5.js`: 206.62 kB
  - `dist/assets/StockChart-Dt3R_i1E.js`: 439.32 kB
  - `dist/assets/HomePage-B1vZEa14.js`: 81.47 kB
  - `dist/assets/StockDetail-BaPFV9QA.js`: 15.93 kB
- **JS bundle (gzip)**:
  - `dist/assets/index-CddexZV8.js`: 100.71 kB
  - `dist/assets/useStockData-B7W0p2v5.js`: 64.15 kB
  - `dist/assets/StockChart-Dt3R_i1E.js`: 157.85 kB
  - `dist/assets/HomePage-B1vZEa14.js`: 27.09 kB
  - `dist/assets/StockDetail-BaPFV9QA.js`: 5.96 kB
- **Evidencia**:
  - Ruta/nombre del screenshot: metrics/bundle/build-final.png

  ![Build final](./metrics/bundle/build-final.png)

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

- Los hooks de React Query están integrados en la UI:
  - `StockTable` consume `useStockTableData` (que compone `useStockList` + `useStockData`) y `useStockSearch`.
  - `StockDetail` consume `useStockQuote` y lazy-load del `StockChart`.
  - `StockPreferenceForm` consume `useStockData`.
- También se utiliza **prefetch** para mejorar navegación (hover en filas / carga de detalle) cuando aplica.

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

---

# Lighthouse (FINAL) — Evidencia entregable

## Página 1 — Home (tabla)

### Desktop (final)

- **Screenshot**: `docs/metrics/lighthouse/page-1-desktop-lighthouse-final.png`
- **Scores**: Performance 100 / Accessibility 100 / Best Practices 100 / SEO 100

![Page 1 Desktop - Lighthouse Final](./metrics/lighthouse/page-1-desktop-lighthouse-final.png)

### Mobile (final)

- **Screenshot**: `docs/metrics/lighthouse/page-1-mobile-lighthouse-final.png`
- **Scores**: Performance 86 / Accessibility 100 / Best Practices 100 / SEO 100
- **Métricas**:
  - **FCP**: 1.7s
  - **LCP**: 2.7s
  - **TBT**: 380ms
  - **CLS**: 0

![Page 1 Mobile - Lighthouse Final](./metrics/lighthouse/page-1-mobile-lighthouse-final.png)

## Página 2 — Detail (gráfico)

### Desktop (final)

- **Screenshot**: `docs/metrics/lighthouse/page-2-desktop-lighthouse-final.png`
- **Scores**: Performance 100 / Accessibility 100 / Best Practices 100 / SEO 100
- **Métricas**:
  - **FCP**: 0.5s
  - **LCP**: 0.6s
  - **TBT**: 0ms
  - **CLS**: 0.004

![Page 2 Desktop - Lighthouse Final](./metrics/lighthouse/page-2-desktop-lighthouse-final.png)

### Mobile (final)

- **Screenshot**: `docs/metrics/lighthouse/page-2-mobile-lighthouse-final.png`
- **Scores**: Performance 86 / Accessibility 100 / Best Practices 100 / SEO 100
- **Métricas**:
  - **FCP**: 1.8s
  - **LCP**: 2.8s
  - **TBT**: 380ms
  - **CLS**: 0.005

![Page 2 Mobile - Lighthouse Final](./metrics/lighthouse/page-2-mobile-lighthouse-final.png)

---

# Informe final (resumen ejecutivo)

## Alcance

- La aplicación fue refactorizada para usar **TanStack Query (React Query v5)** como capa de estado de servidor.
- Se aplicaron optimizaciones de performance enfocadas en:
  - Virtualización de tabla
  - Code splitting / lazy loading (especialmente Highcharts)
  - Optimización de re-renders
  - Optimización de render del chart para datasets grandes
  - Optimización de carga de fuentes (eliminación de Google Fonts render-blocking)

## Estructura de directorios (final)

```
src/
  api/
    client.ts
    endpoints.ts
    schemas.ts
    types.ts
    __tests__/
  components/
    atoms/
    molecules/
    organisms/
  hooks/
    queries/
    table/
    detail/
    __tests__/
    useDebounce.ts
  lib/
    cacheConfig.ts
    invalidation.ts
    queryClient.ts
    queryKeys.ts
    stockChart.ts
    __tests__/
  pages/
    HomePage.tsx
    StockDetailPage.tsx
  services/
    stockService.ts
    quoteService.ts
    searchService.ts
    shared/
      requestOptions.ts
      validateResponse.ts
      __tests__/
    __tests__/
  test/
    setup.ts
    utils.tsx
  utils/
    toast.ts
    __tests__/
  App.tsx
  main.tsx
  types.ts

docs/
  metrics/
    bundle/
    coverage/
    lighthouse/
    profiler/
  readme_anotation.md
```

## React Query — decisiones y estrategia

- **Diseño por capas**:
  - `src/services/*` encapsula acceso a API + validación runtime (Zod).
  - `src/hooks/queries/*` define queries, keys y políticas de cache.
  - UI consume hooks y se mantiene declarativa (`isLoading/isError/isFetching`).
- **Caché por tipo de dato**:
  - Lista de stocks: cache de largo plazo + persistencia selectiva.
  - Search: cache corto + debounce.
  - Quote realtime: `staleTime: 0` + `refetchInterval` configurable.
- **Trade-offs**:
  - Persistencia selectiva (solo lista) para evitar cachear time-series pesado.
  - Cancelación con `AbortSignal` para evitar race conditions.

## Performance — optimizaciones aplicadas (justificación)

- **Virtualización (`@tanstack/react-virtual`)**:
  - Reduce trabajo de render cuando el listado es grande.
- **Code splitting (rutas + chart)**:
  - Se implementó lazy loading de `StockChart` para no penalizar el bundle inicial.
- **Highcharts/Highstock**:
  - Se deshabilitan animaciones/markers/hover y se aplica `boost`.
  - En mobile se reduce cantidad de puntos y se agrupa la data más agresivamente.
- **Fonts**:
  - Se eliminó Google Fonts (render-blocking) y se pasó a `@fontsource/roboto`.
  - Se ajustó a subset `latin-*` para evitar empaquetar múltiples subsets innecesarios.

## Evidencia de métricas

- Lighthouse FINAL:
  - Ver sección **"Lighthouse (FINAL) — Evidencia entregable"** y capturas bajo `docs/metrics/lighthouse/`.
- Bundle:
  - Ver `docs/metrics/bundle/*`.
- React Profiler:
  - Ver `docs/metrics/profiler/*`.

## Testing & Coverage

- Command:
  - `yarn test:coverage`
- Resultados finales:
  - Statements: 99.5%
  - Branches: 93.17%
  - Functions: 100%
  - Lines: 100%
- Evidencia:
  ![Coverage](./metrics/coverage/coverage.png)

## React Profiler

- **Entorno**:
  - `yarn dev`.
  - Nota: React DevTools Profiler no soporta `yarn preview` (build de producción estándar) sin un profiling build específico de React.

- **Alcance**:
  - Capturas realizadas sobre **Pantalla 1 (tabla)**.
  - No se capturó Profiler sobre Pantalla 2 (gráfico).

- **Qué se midió (final)**:
  - **A (Reload / mount Home)**: carga inicial de la tabla.
  - **B (Scroll tabla)**: scroll sostenido con virtualización.
  - **C (Search / Autocomplete)**: búsqueda y selección de símbolo.

### Resumen (antes vs después)

- **Antes** (previo a optimizaciones de re-render / virtualización):
  - Commits más pesados y con mayor “fan-out” de componentes actualizando durante scroll/interacciones.
  - Más re-renders en cascada desde el contenedor hacia filas, con trabajo de reconciliación innecesario.
  - Evidencia: ver capturas históricas en `docs/metrics/profiler/` con sufijos `*-before-*` y `RR_*` (sección de Profiler previa en este documento).

- **Después (final)**:
  - Commits más chicos y localizados.
  - `TableRow` estable (memorización) y renders concentrados en el viewport visible (virtualización).
  - Interacciones (scroll/búsqueda) no disparan re-render global de la tabla completa.

### Evidencia (final)

#### A — Reload / mount (Pantalla 1)

- Observación:
  - Mount acotado, sin costos “sorpresa” por componentes no requeridos en la vista inicial.

![FINAL A - Reload - Flamegraph](./metrics/profiler/FINAL_A_reload_flamegraph.png)

![FINAL A - Reload - Ranked](./metrics/profiler/FINAL_A_reload_ranked.png)

#### B — Scroll tabla (Pantalla 1)

- Observación:
  - Commits chicos y repetibles durante scroll.
  - Top components estables, sin rerenders globales.

![FINAL B - Scroll - Flamegraph](./metrics/profiler/FINAL_B_scroll_flamegraph.png)

![FINAL B - Scroll - Ranked](./metrics/profiler/FINAL_B_scroll_ranked.png)

#### C — Search / Autocomplete (Pantalla 1)

- Observación:
  - Re-renders acotados al input/lista/estado de query, sin afectar filas no visibles.

![FINAL C - Search - Flamegraph](./metrics/profiler/FINAL_C_search_flamegraph.png)

![FINAL C - Search - Ranked](./metrics/profiler/FINAL_C_search_ranked.png)

## Qué haría con más tiempo

- Separar el CSS de los `sx` en archivos de styles separados para mejorar la legibilidad de los componentes.
