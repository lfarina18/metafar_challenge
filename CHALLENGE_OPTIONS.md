# Challenge para Senior Frontend Developer

Este documento contiene desafíos diseñados específicamente para evaluar a candidatos **Senior Frontend Developer**. Los challenges están enfocados en arquitectura, toma de decisiones técnicas, escalabilidad y mejores prácticas de nivel senior.

---

## 🎯 Challenge Principal Recomendado

### Challenge 1: Refactorización Arquitectónica Completa
**Tiempo estimado:** 8-12 horas  
**Objetivo:** Evaluar capacidad de mejorar arquitectura, tomar decisiones técnicas estratégicas y escribir código escalable y mantenible.

**Contexto:**
El proyecto actual funciona pero tiene varios problemas de arquitectura, performance y mantenibilidad. Tu tarea es refactorizarlo siguiendo mejores prácticas de nivel senior.

**Tareas Principales:**

#### 1. Arquitectura y Estado Global (2-3 horas)
- Analizar el estado actual y proponer una arquitectura de estado escalable
- Implementar una solución de estado global (Context API, Zustand, Redux Toolkit, o similar) con justificación técnica
- Refactorizar StockTable para usar el nuevo sistema de estado
- Implementar selectores memoizados para evitar re-renders innecesarios
- **Documentar** la decisión arquitectónica y sus trade-offs

#### 2. Capa de Servicios y Abstracción de API (2 horas)
- Crear una capa de servicios bien estructurada que abstraiga las llamadas a la API
- Implementar un sistema de caché inteligente con TTL y invalidación
- Agregar retry logic con exponential backoff para llamadas fallidas
- Implementar request cancellation para evitar race conditions
- Centralizar manejo de errores de API con tipos específicos
- **Justificar** las decisiones de diseño

#### 3. Optimización de Performance (2-3 horas)
- Identificar y resolver problemas de performance usando React DevTools Profiler
- Implementar virtualización para la tabla de acciones (react-window o react-virtual)
- Agregar lazy loading y code splitting estratégico
- Optimizar el bundle size (analizar con webpack-bundle-analyzer o similar)
- Implementar memoización apropiada (React.memo, useMemo, useCallback) con justificación
- **Medir y documentar** las mejoras de performance

#### 4. Manejo de Errores y Estados (1-2 horas)
- Mejorar el ErrorBoundary con recovery options y error reporting
- Implementar estados de error granulares (network error, validation error, etc.)
- Crear un sistema de notificaciones/toasts para feedback al usuario
- Agregar estados de loading específicos por sección
- **Diseñar** una UX coherente para todos los estados de error

#### 5. TypeScript y Type Safety (1 hora)
- Configurar TypeScript en modo estricto
- Eliminar todos los `any` implícitos y crear tipos apropiados
- Crear tipos compartidos y utilities types donde sea necesario
- Validar tipos en runtime si es necesario (usando zod, yup, o similar)
- **Documentar** decisiones sobre type safety

#### 6. Testing y Calidad (2 horas)
- Configurar Jest y React Testing Library
- Escribir tests unitarios para lógica de negocio y hooks
- Escribir tests de integración para flujos críticos
- Agregar tests E2E básicos (usando Playwright o Cypress)
- Configurar pre-commit hooks con Husky para linting y tests
- Alcanzar al menos 80% de cobertura en código crítico
- **Justificar** qué se testea y qué no

**Entregables:**
1. Código refactorizado y funcional
2. Documento técnico explicando:
   - Decisiones arquitectónicas y sus trade-offs
   - Mejoras de performance con métricas
   - Estrategia de testing
   - Áreas de mejora futuras
3. README actualizado con instrucciones de setup y arquitectura
4. Commits bien estructurados y descriptivos

**Criterios de Evaluación:**
- ✅ Arquitectura escalable y bien pensada
- ✅ Decisiones técnicas justificadas
- ✅ Código limpio, mantenible y bien documentado
- ✅ Mejoras medibles de performance
- ✅ Testing apropiado y estratégico
- ✅ TypeScript usado efectivamente
- ✅ Manejo robusto de errores y edge cases
- ✅ Documentación técnica clara

---

## 🔄 Challenge Alternativo 1: Feature Completa con Arquitectura

### Challenge 2: Sistema de Alertas y Notificaciones en Tiempo Real
**Tiempo estimado:** 10-14 horas  
**Objetivo:** Evaluar capacidad de diseñar e implementar una feature compleja desde cero con arquitectura escalable.

**Tareas:**

1. **Diseño y Arquitectura (2 horas)**
   - Diseñar la arquitectura del sistema de alertas
   - Crear diagrama de flujo y arquitectura de componentes
   - Definir estructura de datos y tipos TypeScript
   - **Documentar** decisiones de diseño

2. **Implementación Core (4-5 horas)**
   - Sistema de alertas de precios:
     - Crear alertas (precio objetivo, tipo: arriba/abajo)
     - Validaciones y edge cases
     - Persistencia (localStorage inicial, pero diseñado para migrar a backend)
   - Sistema de notificaciones:
     - Notificaciones en tiempo real cuando se cumple una alerta
     - Queue de notificaciones para manejar múltiples alertas
     - UI para gestionar alertas (CRUD completo)
   - Integración con datos de acciones existentes

3. **Tiempo Real y Performance (2-3 horas)**
   - Implementar polling inteligente para verificar alertas
   - Optimizar para evitar llamadas innecesarias a la API
   - Implementar WebSocket simulation o polling eficiente
   - Manejar desconexión/reconexión
   - **Optimizar** para que funcione con 100+ alertas activas

4. **Testing y Calidad (2 horas)**
   - Tests unitarios para lógica de alertas
   - Tests de integración para flujos completos
   - Tests de performance para polling
   - Al menos 75% de cobertura

5. **UX y Accesibilidad (1 hora)**
   - UI intuitiva y accesible
   - Manejo de estados de carga y error
   - Feedback visual apropiado

**Criterios de Evaluación:**
- ✅ Arquitectura bien diseñada y escalable
- ✅ Feature completa y funcional
- ✅ Performance optimizada
- ✅ Código limpio y mantenible
- ✅ Testing comprehensivo
- ✅ UX pulida

---

## 🏗️ Challenge Alternativo 2: Migración y Modernización

### Challenge 3: Modernizar Stack y Mejorar Developer Experience
**Tiempo estimado:** 8-10 horas  
**Objetivo:** Evaluar conocimiento de herramientas modernas, build optimization y developer experience.

**Tareas:**

1. **Build Optimization (2-3 horas)**
   - Analizar y optimizar el bundle size
   - Implementar code splitting estratégico
   - Optimizar imports (tree-shaking)
   - Configurar preloading de rutas críticas
   - **Documentar** mejoras con métricas

2. **Developer Experience (2 horas)**
   - Configurar ESLint con reglas estrictas y personalizadas
   - Agregar Prettier con configuración de equipo
   - Configurar Husky con pre-commit hooks
   - Agregar commitlint para commits convencionales
   - Configurar GitHub Actions o similar para CI/CD básico

3. **TypeScript Avanzado (1-2 horas)**
   - Migrar a TypeScript estricto
   - Crear utility types y type guards
   - Implementar branded types donde sea apropiado
   - Validación de tipos en runtime (zod o similar)

4. **Testing Infrastructure (2 horas)**
   - Configurar testing completo (Jest, RTL, E2E)
   - Crear testing utilities y helpers
   - Configurar coverage reporting
   - Agregar visual regression testing (opcional)

5. **Documentación y Tooling (1 hora)**
   - Documentar arquitectura y decisiones
   - Crear guías de contribución
   - Agregar Storybook para componentes (opcional pero valorado)

**Criterios de Evaluación:**
- ✅ Mejoras medibles en bundle size y performance
- ✅ Developer experience significativamente mejorada
- ✅ TypeScript usado de manera avanzada
- ✅ Testing infrastructure robusta
- ✅ Documentación clara y útil

---

## 🎨 Challenge Alternativo 3: Sistema de Diseño y Componentes

### Challenge 4: Crear Design System y Refactorizar Componentes
**Tiempo estimado:** 10-12 horas  
**Objetivo:** Evaluar capacidad de crear sistemas escalables, reutilizables y bien documentados.

**Tareas:**

1. **Design System (3-4 horas)**
   - Crear un sistema de diseño coherente:
     - Tokens de diseño (colores, tipografía, espaciado)
     - Componentes base (Button, Input, etc.) con variantes
     - Sistema de temas (light/dark)
   - Documentar en Storybook
   - Crear guía de uso

2. **Refactorización de Componentes (3-4 horas)**
   - Refactorizar componentes atómicos siguiendo principios de design system
   - Implementar compound components donde sea apropiado
   - Agregar variantes y estados (loading, error, disabled, etc.)
   - Asegurar accesibilidad (ARIA, keyboard navigation, focus management)

3. **Composición y Patrones (2 horas)**
   - Implementar patrones avanzados (render props, compound components, hooks personalizados)
   - Crear componentes compuestos reutilizables
   - Optimizar con React.memo y useMemo apropiadamente

4. **Testing de Componentes (2 horas)**
   - Tests para todos los componentes del design system
   - Visual regression testing
   - Tests de accesibilidad

**Criterios de Evaluación:**
- ✅ Design system coherente y escalable
- ✅ Componentes reutilizables y bien documentados
- ✅ Accesibilidad implementada correctamente
- ✅ Patrones avanzados de React aplicados
- ✅ Testing comprehensivo

---

## 📋 Instrucciones para el Candidato

### Setup Inicial
1. Fork o clona el repositorio
2. Instala dependencias: `npm install` o `yarn install`
3. Ejecuta el proyecto: `npm run dev`
4. Familiarízate con el código existente

### Proceso de Trabajo
1. **Análisis (30 min - 1 hora)**
   - Revisa el código actual
   - Identifica problemas y áreas de mejora
   - Planifica tu enfoque

2. **Implementación**
   - Trabaja en una rama separada
   - Haz commits frecuentes y descriptivos
   - Documenta decisiones importantes

3. **Documentación**
   - Actualiza el README
   - Documenta decisiones arquitectónicas
   - Incluye métricas de performance si aplica

### Entregables Requeridos
1. ✅ Código funcional y completo
2. ✅ README actualizado con:
   - Instrucciones de setup
   - Arquitectura y decisiones técnicas
   - Mejoras implementadas
3. ✅ Documento técnico (opcional pero valorado) explicando:
   - Decisiones y trade-offs
   - Alternativas consideradas
   - Próximos pasos recomendados
4. ✅ Commits bien estructurados

### Criterios de Evaluación General
- **Arquitectura:** Diseño escalable, mantenible, bien estructurado
- **Código:** Limpio, legible, bien documentado, sigue mejores prácticas
- **TypeScript:** Uso efectivo, type safety, tipos bien definidos
- **Performance:** Optimizaciones apropiadas, métricas mejoradas
- **Testing:** Estrategia clara, cobertura apropiada, tests significativos
- **UX/UI:** Experiencia de usuario pulida, manejo de estados, accesibilidad
- **Documentación:** Clara, completa, útil para otros desarrolladores
- **Decisiones Técnicas:** Justificadas, considerando trade-offs

---

## 💡 Tips para el Evaluador

### Antes del Challenge
- Proporciona contexto sobre el proyecto y el equipo
- Establece expectativas claras sobre tiempo y alcance
- Permite que el candidato elija el challenge que más le interese (si hay opciones)
- Proporciona acceso a documentación relevante

### Durante la Evaluación
- **Evalúa el proceso, no solo el resultado:**
  - ¿Cómo aborda el problema?
  - ¿Hace preguntas relevantes?
  - ¿Toma decisiones informadas?
  
- **Revisa:**
  - Commits y mensajes (calidad del trabajo incremental)
  - Documentación y comentarios
  - Estructura del código
  - Testing y cobertura
  
- **Considera:**
  - Trade-offs de las decisiones tomadas
  - Escalabilidad de las soluciones
  - Mantenibilidad del código
  - Conocimiento de mejores prácticas

### Después del Challenge
- Proporciona feedback constructivo
- Discute decisiones técnicas
- Pregunta sobre alternativas consideradas
- Evalúa fit cultural y capacidad de comunicación técnica

---

## 🔧 Setup del Challenge

Para preparar el challenge:

1. **Preparar el repositorio:**
   ```bash
   git checkout -b challenge/[nombre-candidato]
   # Opcional: introducir algunos problemas sutiles para que identifique
   ```

2. **Proporcionar al candidato:**
   - Acceso al repositorio (fork o branch)
   - Este documento con el challenge seleccionado
   - Tiempo límite (recomendado: 1-2 semanas para trabajo asíncrono, o 8-12 horas para sesión)
   - Criterios de evaluación
   - Contacto para preguntas

3. **Configurar evaluación:**
   - Revisar código y documentación
   - Ejecutar el proyecto y verificar funcionalidad
   - Revisar tests y cobertura
   - Preparar preguntas de seguimiento

---

## 📊 Rúbrica de Evaluación (Opcional)

| Criterio | Excelente (5) | Bueno (4) | Satisfactorio (3) | Necesita Mejora (2) | Insuficiente (1) |
|----------|---------------|-----------|-------------------|---------------------|------------------|
| **Arquitectura** | Solución escalable, bien diseñada, documentada | Buena estructura, algunos trade-offs | Estructura adecuada | Estructura básica | Sin planificación |
| **Código** | Limpio, mantenible, excelentes prácticas | Código bueno, algunas mejoras posibles | Funcional pero mejorable | Funciona pero desordenado | Código problemático |
| **TypeScript** | Uso avanzado, type safety completo | Buen uso, pocos any | Uso básico adecuado | Uso mínimo | Sin type safety |
| **Performance** | Optimizaciones avanzadas, métricas | Buenas optimizaciones | Algunas optimizaciones | Optimizaciones básicas | Sin optimización |
| **Testing** | Cobertura alta, tests significativos | Buena cobertura y calidad | Cobertura adecuada | Tests básicos | Sin tests o pobres |
| **Documentación** | Excelente, clara, completa | Buena documentación | Documentación básica | Documentación mínima | Sin documentación |

---

## 🎓 Nivel Esperado

Este challenge está diseñado para evaluar a un **Senior Frontend Developer** que debería:

- ✅ Tener experiencia sólida con React, TypeScript y ecosistema moderno
- ✅ Entender arquitectura de aplicaciones frontend escalables
- ✅ Conocer y aplicar mejores prácticas y patrones de diseño
- ✅ Ser capaz de tomar decisiones técnicas informadas
- ✅ Priorizar mantenibilidad y escalabilidad
- ✅ Escribir código limpio y bien documentado
- ✅ Entender performance y optimización
- ✅ Valorar testing y calidad de código

**Nota:** No se espera perfección, sino demostración de pensamiento estratégico, conocimiento técnico sólido y capacidad de tomar decisiones informadas.
