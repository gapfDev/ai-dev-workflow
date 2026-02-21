# Evaluación — Fase 7: Feature Skip (Step 4 saltado)

**Tipo:** Brownfield | **UI:** Sí | **Steps esperados:** 1 → 7 (sin Step 4)

---

## Lo que estamos probando
- El workflow permite saltar Step 4 con el comando "Skip"
- Gate 4 se marca como "Skipped", no como "Done"
- Step 5 funciona sin IMPLEMENTATION_PLAN.md como input
- El agente calibra su esfuerzo al scope real (feature pequeño)

---

## Checklist por Step

### Step 1 — Product Discovery
| Esperado | ¿Pasó? |
|----------|--------|
| Detecta **Brownfield** (app existente) | ☐ |
| El scope es mínimo — no hace 50 preguntas | ☐ |
| Calibra preguntas al scope real | ☐ |

### Step 4 — Skip
| Esperado | ¿Pasó? |
|----------|--------|
| Presenta Step 4 al usuario | ☐ |
| El usuario dice "Skip" | ☐ |
| Marca Step 4 como **"Skipped"** (no "Done") | ☐ |
| `IMPLEMENTATION_PLAN.md` **NO se genera** | ☐ |
| Progress tracker muestra: "⏭️ Step 4: Skipped" | ☐ |
| El flujo continúa a Step 5 sin errores | ☐ |

### Step 5 — Implementation sin IMPLEMENTATION_PLAN
| Esperado | ¿Pasó? |
|----------|--------|
| Trabaja directo con el ticket de `BACKLOG.md` | ☐ |
| No se confunde por la falta de IMPLEMENTATION_PLAN | ☐ |
| GitHub Gate aún funciona (crea issue + branch) | ☐ |

---

## Resultado Global
| Criterio | ¿Pasó? |
|----------|--------|
| Skip registrado correctamente (no como error) | ☐ |
| El flujo no se rompió por saltar Step 4 | ☐ |
| Step 5 funcionó sin IMPLEMENTATION_PLAN.md | ☐ |
| El scope del agente se calibró al feature pequeño | ☐ |

## Artefactos que deben existir al final
```
PRODUCT_VISION.md (breve), TECH_STRATEGY.md (breve),
BACKLOG.md (1 ticket), VALIDATION_REPORT.md
```
> **Nota:** No hay `IMPLEMENTATION_PLAN.md` — fue skipped.
