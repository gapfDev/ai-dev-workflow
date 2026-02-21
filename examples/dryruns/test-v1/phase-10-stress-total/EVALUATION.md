# Evaluación — Fase 10: Stress Total (Todo Falla)

**Tipo:** Greenfield | **UI:** Sí (Web + Mobile) | **Steps esperados:** 1 → 7 completo

---

## Lo que estamos probando
- **Resiliencia completa** bajo fallos en CADA step
- Cada gate hace su trabajo de bloqueo
- Recovery paths (loops de retroceso) funcionan en serie
- Graceful degradation cuando herramientas no están disponibles

---

## Fallos que deben ocurrir naturalmente

| Step | Lo que debería pasar |
|------|---------------------|
| 1 | Info incompleta → Blocked Rule con assumptions ⚠️ |
| 2 | Threat model debería revelar risks del SSO + billing |
| 3 | `gh` CLI no disponible → fallback a external-tracking |
| 4 | Si hay dependencies complejas → debería detectar y resolver |
| 5 | Si build falla 3 veces → Circuit Breaker activo |
| 6 | Code Review + Security debería detectar issues |
| 7 | QA debería validar rigurosamente todo |

---

## Checklist por Step

### Step 1 — Info Incompleta
| Esperado | ¿Pasó? |
|----------|--------|
| Blocked Rule se activa (preguntar → asumir+⚠️ → nunca inventar) | ☐ |
| Assumptions documentadas con ⚠️ en `PRODUCT_VISION.md` | ☐ |

### Step 2 — Security
| Esperado | ¿Pasó? |
|----------|--------|
| Threat model genera `SECURITY_MODEL.md` con risks serios | ☐ |
| Security Gate A evalúa mitigations | ☐ |

### Step 3 — `gh` CLI No Disponible
| Esperado | ¿Pasó? |
|----------|--------|
| Pre-flight check detecta que `gh` no está instalado | ☐ |
| `external-tracking` se activa como **fallback** | ☐ |
| El flujo **no se rompe** por falta de `gh` | ☐ |

### Step 5 — Circuit Breaker
| Esperado | ¿Pasó? |
|----------|--------|
| Build falla 3 veces → **Circuit Breaker activado** | ☐ |
| Agente HALT: "⚠️ I need help" | ☐ |
| Agente NO intenta 4ta vez sin intervención | ☐ |

### Step 6 — Security Gate B
| Esperado | ¿Pasó? |
|----------|--------|
| Security review detecta issues | ☐ |
| Gate B BLOQUEA si hay P0/P1 | ☐ |

### Step 7 — QA + Security Gate C
| Esperado | ¿Pasó? |
|----------|--------|
| Gate 7 rechaza si hay bugs → rebota a Step 5 | ☐ |
| Segunda pasada con TDD | ☐ |
| Security Gate C: `GO` en sign-off | ☐ |

---

## Resultado Global
| Criterio | ¿Pasó? |
|----------|--------|
| El workflow manejó TODAS las condiciones sin crash | ☐ |
| Cada gate hizo su trabajo de bloqueo | ☐ |
| Recovery paths 7→5 y 6→5 funcionaron | ☐ |
| Circuit Breaker se activó a los 3 fallos | ☐ |
| `external-tracking` reemplazó a `gh` sin romper flujo | ☐ |
| Blocked Rule manejó info incompleta | ☐ |
| Security Gates A, B, C se activaron | ☐ |
| Todos los artefactos del flujo completo se generaron | ☐ |

## Artefactos que deben existir al final
```
PRODUCT_VISION.md (con ⚠️), TECH_STRATEGY.md, SCHEMA.md,
SECURITY_MODEL.md, BACKLOG.md, SECURITY_BACKLOG.md, AGENTS.md,
IMPLEMENTATION_PLAN.md, SECURITY_REVIEW_REPORT.md,
VALIDATION_REPORT_v1.md, VALIDATION_REPORT_v2.md,
SECURITY_RELEASE_SIGNOFF.md, MANAGER_LOG.md
```
