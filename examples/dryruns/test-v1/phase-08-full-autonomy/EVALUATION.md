# Evaluación — Fase 8: Tech Delegate Mode (Full Autonomy)

**Tipo:** Greenfield | **UI:** No (API) | **Steps esperados:** 1 → 7 completo

---

## Lo que estamos probando
- Batched execution: Steps 2-3 y 5-6 sin interrumpir al usuario
- El agente PARA obligatoriamente en Gates 1, 4 y 7
- Illegibility Rule: todas las decisiones quedan en docs/
- `manager-log` se actualiza durante el flujo autónomo

---

## Checklist

### Batched Execution — Steps 2-3
| Esperado | ¿Pasó? |
|----------|--------|
| Ejecuta Step 2 sin preguntar después de Gate 1 | ☐ |
| Ejecuta Step 3 sin preguntar | ☐ |
| Reporta Steps 2-3 como **batch** | ☐ |
| No interrumpe con "Ready to proceed?" entre 2 y 3 | ☐ |

### Batched Execution — Steps 5-6
| Esperado | ¿Pasó? |
|----------|--------|
| Ejecuta Step 5 sin preguntar después de Gate 4 | ☐ |
| Ejecuta Step 6 sin preguntar | ☐ |
| No interrumpe entre Steps 5 y 6 | ☐ |

### Gates Obligatorios
| Esperado | ¿Pasó? |
|----------|--------|
| **Gate 1:** PARA y espera aprobación | ☐ |
| **Gate 4:** PARA y espera aprobación | ☐ |
| **Gate 7:** PARA y espera aprobación | ☐ |

### Illegibility Rule
| Esperado | ¿Pasó? |
|----------|--------|
| TODAS las decisiones del batch escritas en docs/ o .agent/ | ☐ |
| Ninguna decisión queda solo en el chat | ☐ |
| `manager-log` refleja razonamiento de decisiones autónomas | ☐ |

### Silencio del usuario
| Esperado | ¿Pasó? |
|----------|--------|
| Si no responde en gate obligatorio → ESPERA | ☐ |
| No avanza sin aprobación en Gates 1, 4, 7 | ☐ |

---

## Resultado Global
| Criterio | ¿Pasó? |
|----------|--------|
| Se detuvo EXACTAMENTE en 3 puntos: Gate 1, 4, 7 | ☐ |
| Steps 2-3 en batch sin micro-interrupciones | ☐ |
| Steps 5-6 en batch sin micro-interrupciones | ☐ |
| Illegibility Rule cumplida | ☐ |
| `manager-log` completo | ☐ |

## Artefactos que deben existir al final
```
PRODUCT_VISION.md, TECH_STRATEGY.md, SCHEMA.md, SECURITY_MODEL.md,
BACKLOG.md, AGENTS.md, IMPLEMENTATION_PLAN.md,
VALIDATION_REPORT.md, MANAGER_LOG.md
```
