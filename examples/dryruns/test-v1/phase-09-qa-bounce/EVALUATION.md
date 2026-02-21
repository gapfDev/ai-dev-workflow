# Evaluación — Fase 9: QA Bounce Back

**Tipo:** Greenfield | **UI:** Sí (Web) | **Steps esperados:** 5 → 7 → 5 (loop)

---

## Lo que estamos probando
- Gate 7 rechaza por bugs y el flujo rebota a Step 5
- La segunda pasada usa TDD (no solo patching)
- `ralph-wiggum-loop` se ejecuta para auto-fix
- `milestone-watchdog` detecta tickets stale durante el loop

---

## Checklist

### Step 7 (primera vez) — QA detecta bugs
| Esperado | ¿Pasó? |
|----------|--------|
| QA agent ejecuta validación | ☐ |
| Detecta bugs en las features | ☐ |
| `VALIDATION_REPORT.md` documenta bugs como P0 | ☐ |

### Gate 7 (primera vez) — Rechazo
| Esperado | ¿Pasó? |
|----------|--------|
| Gate 7: "0 critical bugs?" → ❌ | ☐ |
| Gate 7 **RECHAZA** la release | ☐ |
| Flujo **rebota a Step 5** (no a Step 6) | ☐ |
| Se crean tickets nuevos para los bugs | ☐ |

### Step 5 (segunda pasada) — Fix
| Esperado | ¿Pasó? |
|----------|--------|
| Aplica **TDD** para los fixes (no solo patching) | ☐ |
| Tests nuevos cubren los bugs encontrados | ☐ |
| `ralph-wiggum-loop` se ejecuta (auto-fix local) | ☐ |
| Tests pasan antes de avanzar a review | ☐ |

### Step 6 (segunda pasada) — Code Review
| Esperado | ¿Pasó? |
|----------|--------|
| PRs creados para los fixes | ☐ |
| Gate 6 es igual de riguroso (no shortcuts) | ☐ |

### Step 7 (segunda vez) — Re-validation
| Esperado | ¿Pasó? |
|----------|--------|
| QA re-ejecuta **TODA** la suite (no solo bugs fijados) | ☐ |
| Regression tests incluyen nuevos test cases | ☐ |
| Bugs verificados como FIXED | ☐ |
| No hay regresiones nuevas | ☐ |
| Gate 7 **PASA** esta vez | ☐ |

### Milestone Watchdog
| Esperado | ¿Pasó? |
|----------|--------|
| Detecta si tickets quedaron stale durante el loop | ☐ |
| No hay tickets abandonados o sin ownership | ☐ |

---

## Resultado Global
| Criterio | ¿Pasó? |
|----------|--------|
| Gate 7 rechazó correctamente la primera vez | ☐ |
| El rebote Step 7→5 funcionó limpiamente | ☐ |
| La segunda pasada usó TDD (no solo patching) | ☐ |
| La segunda pasada fue igual de rigurosa | ☐ |
| No hubo regresiones en la re-validation | ☐ |

## Artefactos que deben existir al final
```
VALIDATION_REPORT_v1.md (rejected), VALIDATION_REPORT_v2.md (passed)
```
