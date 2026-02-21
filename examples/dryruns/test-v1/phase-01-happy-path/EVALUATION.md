# Evaluación — Fase 1: Happy Path (CLI Tool)

**Tipo:** Greenfield | **UI:** No | **Steps esperados:** 1 → 7 completo

---

## Lo que estamos probando
- El flujo completo funciona de punta a punta sin fricción
- Los 7 gates se activan correctamente
- Todos los artefactos mínimos se generan
- El progress tracker se muestra en cada transición

---

## Checklist por Step

### Step 1 — Product Discovery
| Esperado | ¿Pasó? |
|----------|--------|
| El agente detecta **Greenfield** (no hay código existente) | ☐ |
| Confirma que **no hay UI** (CLI only) | ☐ |
| Hace preguntas sobre: unidades, formato de output, edge cases | ☐ |
| Genera `PRODUCT_VISION.md` (no `REVERSE_ENG.md`) | ☐ |
| Muestra Workflow Kickoff al inicio | ☐ |
| Espera confirmación del usuario antes de avanzar (Gate 1) | ☐ |

### Step 2 — Tech Analysis
| Esperado | ¿Pasó? |
|----------|--------|
| Selecciona stack viable (Python + argparse/click) | ☐ |
| Selecciona QA Paradigm (TDD recomendado) | ☐ |
| Reconoce que Schema/DB no aplica | ☐ |
| Threat model es mínimo (no hay datos sensibles) | ☐ |
| Genera `TECH_STRATEGY.md` | ☐ |
| Gate 2 pasa automáticamente | ☐ |

### Step 3 — Scaffold & Backlog
| Esperado | ¿Pasó? |
|----------|--------|
| Genera `BACKLOG.md` con tickets que tienen DoD | ☐ |
| Genera `AGENTS.md` (via agents-md-generator) | ☐ |
| Pre-flight checks ejecutados (auth, env, .gitignore) | ☐ |
| Gate 3 pasa automáticamente | ☐ |

### Step 4 — Sprint Planning
| Esperado | ¿Pasó? |
|----------|--------|
| Prioriza con MoSCoW | ☐ |
| Define un solo sprint (scope es pequeño) | ☐ |
| Genera `IMPLEMENTATION_PLAN.md` | ☐ |
| Gate 4 espera aprobación humana | ☐ |

### Step 5 — Implementation
| Esperado | ¿Pasó? |
|----------|--------|
| Step 5a: Acuerda workflow (1 agente, secuencial) | ☐ |
| GitHub Gate: Crea issues + branches ANTES de codear | ☐ |
| Step 5b: TDD — tests primero, luego implementación | ☐ |
| Ralph Wiggum Loop ejecutado (auto-fix local) | ☐ |
| Gate 5 pasa automáticamente | ☐ |

### Step 6 — Code Review
| Esperado | ¿Pasó? |
|----------|--------|
| PR creado y vinculado a issue (`Closes #XX`) | ☐ |
| Code review checklist aplicado | ☐ |
| Sin security concerns bloqueantes | ☐ |
| Gate 6 pasa | ☐ |

### Step 7 — QA & Release
| Esperado | ¿Pasó? |
|----------|--------|
| Tests 100% passing | ☐ |
| Edge cases cubiertos | ☐ |
| Genera `VALIDATION_REPORT.md` | ☐ |
| Gate 7 espera aprobación humana | ☐ |
| Progress tracker muestra 7/7 | ☐ |

---

## Resultado Global
| Criterio | ¿Pasó? |
|----------|--------|
| El flujo completo terminó sin bloqueos inesperados | ☐ |
| Todos los artefactos se generaron | ☐ |
| Los roles cambiaron correctamente (PM → Arch → DevOps → Dev → Lead → QA) | ☐ |
| Las 3 Global Rules se respetaron (Blocked, Illegibility, User Data) | ☐ |

## Artefactos que deben existir al final
```
PRODUCT_VISION.md, TECH_STRATEGY.md, BACKLOG.md, AGENTS.md,
IMPLEMENTATION_PLAN.md, VALIDATION_REPORT.md
```
