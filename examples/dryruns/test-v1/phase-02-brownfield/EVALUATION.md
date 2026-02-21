# Evaluación — Fase 2: Brownfield / Legacy

**Tipo:** Brownfield | **UI:** Sí (existente) | **Steps esperados:** 1 → 4

---

## Lo que estamos probando
- El agente detecta Brownfield correctamente y no trata como Greenfield
- Genera `REVERSE_ENGINEERING_REPORT.md` en vez de `PRODUCT_VISION.md`
- El enfoque es refactoring, no new build

---

## Checklist por Step

### Step 1 — Product Discovery
| Esperado | ¿Pasó? |
|----------|--------|
| El agente detecta **Brownfield** (código existente) | ☐ |
| Genera `REVERSE_ENGINEERING_REPORT.md` (NO `PRODUCT_VISION.md`) | ☐ |
| Pregunta por el repo/tech stack existente (no asume) | ☐ |
| Identifica los problemas actuales en vez de proponer features nuevos | ☐ |
| No propone re-escribir desde cero sin justificación | ☐ |

### Step 2 — Tech Analysis
| Esperado | ¿Pasó? |
|----------|--------|
| Analiza el código **existente** (no inventa stack nuevo) | ☐ |
| Identifica deuda técnica y código duplicado | ☐ |
| Propone estrategia de refactoring incremental | ☐ |
| QA Paradigm: sugiere tests para código existente primero | ☐ |
| Genera `TECH_STRATEGY.md` enfocado en refactor, no en new build | ☐ |

### Step 3 — Scaffold & Backlog
| Esperado | ¿Pasó? |
|----------|--------|
| Los tickets de `BACKLOG.md` son de **refactoring** (no features) | ☐ |
| Tickets tienen DoD claros | ☐ |
| No crea un repo nuevo (el repo ya existe) | ☐ |

### Step 4 — Sprint Planning
| Esperado | ¿Pasó? |
|----------|--------|
| Prioriza bugs/deuda técnica como MoSCoW "Must Have" | ☐ |
| Features nuevos aparecen como "Won't Have" o ni aparecen | ☐ |
| Sprint refleja el scope de refactoring, no de feature delivery | ☐ |

---

## Resultado Global
| Criterio | ¿Pasó? |
|----------|--------|
| El agente **nunca** confundió Brownfield con Greenfield | ☐ |
| `REVERSE_ENGINEERING_REPORT.md` se generó (no `PRODUCT_VISION.md`) | ☐ |
| Todos artefactos de Steps 1-4 generados | ☐ |
| El enfoque fue refactoring, no new build | ☐ |

## Artefactos que deben existir al final
```
REVERSE_ENGINEERING_REPORT.md, TECH_STRATEGY.md,
BACKLOG.md, IMPLEMENTATION_PLAN.md
```
