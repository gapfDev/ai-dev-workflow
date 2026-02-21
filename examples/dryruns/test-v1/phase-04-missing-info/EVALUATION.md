# Evaluación — Fase 4: Información Faltante (Blocked Rule)

**Tipo:** Greenfield | **UI:** Sí | **Steps esperados:** 1 → 2

---

## Lo que estamos probando
- La Blocked Rule se aplica correctamente ante silencios del usuario
- El agente no inventa datos — usa assumptions conservadoras marcadas con ⚠️
- El agente insiste en clarificar antes de avanzar

---

## Checklist por Step

### Step 1 — Product Discovery
| Esperado | ¿Pasó? |
|----------|--------|
| El agente hace **muchas** preguntas (Relentless Architect) | ☐ |
| No acepta "app de fitness" como scope suficiente | ☐ |
| Insiste en clarificar antes de avanzar | ☐ |

### Blocked Rule — Manejo de silencios
| Esperado | ¿Pasó? |
|----------|--------|
| **Paso 1:** Pregunta al humano (primera vez) | ☐ |
| **Paso 2:** Si no hay respuesta → documenta assumption + marca ⚠️ | ☐ |
| **Paso 3:** NUNCA inventa datos — las assumptions son conservadoras | ☐ |
| Cada assumption tiene un ⚠️ visible en `PRODUCT_VISION.md` | ☐ |
| Las assumptions son explícitas: "Assumed NO wearable integration ⚠️" | ☐ |

### Gate 1 — Con Assumptions Pendientes
| Esperado | ¿Pasó? |
|----------|--------|
| Gate 1 muestra las assumptions como "pending questions" | ☐ |
| El agente avisa al usuario que hay decisiones sin confirmar | ☐ |
| No avanza sin al menos notificar los gaps | ☐ |

### Step 2 — Tech Analysis
| Esperado | ¿Pasó? |
|----------|--------|
| `TECH_STRATEGY.md` refleja las assumptions (no las trata como hechos) | ☐ |
| Decisiones de architecture se basan en lo confirmado, no lo asumido | ☐ |
| Scope del threat model se limita a lo confirmado | ☐ |

---

## Resultado Global
| Criterio | ¿Pasó? |
|----------|--------|
| La Blocked Rule se aplicó correctamente (3 pasos) | ☐ |
| NUNCA inventó features que el usuario no mencionó | ☐ |
| Las assumptions están documentadas y marcadas con ⚠️ | ☐ |
| El agente reintentó preguntar antes de asumir | ☐ |

## Artefactos que deben existir al final
```
PRODUCT_VISION.md (con assumptions ⚠️), TECH_STRATEGY.md
```
