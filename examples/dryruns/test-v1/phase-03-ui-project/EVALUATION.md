# Evaluación — Fase 3: Proyecto con UI

**Tipo:** Greenfield | **UI:** Sí | **Steps esperados:** 1 → 4

---

## Lo que estamos probando
- Gate 1 exige mockups aprobados para proyectos UI
- `ui-design-preview` se invoca cuando faltan mockups
- El análisis incluye frontend architecture, no solo backend
- Security evalúa vectores de datos de usuario (formularios, uploads)

---

## Checklist por Step

### Step 1 — Product Discovery
| Esperado | ¿Pasó? |
|----------|--------|
| El agente detecta que es un proyecto **con UI** | ☐ |
| Pregunta por mockups, screenshots o referencias visuales | ☐ |
| Pregunta por responsive (¿mobile? ¿tablet? ¿desktop only?) | ☐ |
| Pregunta por accesibilidad (a11y) | ☐ |
| Pregunta preferencias de diseño: colores, tipografía, estilo general | ☐ |
| Genera `PRODUCT_VISION.md` con sección de UX/UI requirements | ☐ |

### Gate 1
| Esperado | ¿Pasó? |
|----------|--------|
| Evalúa: "If UI project: Design mockups approved and locked?" | ☐ |
| **BLOQUEA** porque no hay mockups aprobados | ☐ |
| Invoca `ui-design-preview` para generar mockups | ☐ |
| Presenta mockups al usuario para aprobación | ☐ |

### Step 2 — Tech Analysis
| Esperado | ¿Pasó? |
|----------|--------|
| Incluye decisiones de **frontend** (React/Vue/Svelte, charting library) | ☐ |
| No se limita solo a backend — incluye CSS, responsive strategy | ☐ |
| Security Agent evalúa formularios de login y uploads | ☐ |
| Genera `TECH_STRATEGY.md` con frontend architecture | ☐ |
| Genera `SECURITY_MODEL.md` que cubre auth flows | ☐ |

### Steps 3-4
| Esperado | ¿Pasó? |
|----------|--------|
| `BACKLOG.md` incluye tickets de UI (no solo lógica) | ☐ |
| Tickets de diseño/CSS tienen DoD claros | ☐ |
| Sprint plan distingue frontend vs backend work | ☐ |

---

## Resultado Global
| Criterio | ¿Pasó? |
|----------|--------|
| Gate 1 detectó la falta de mockups y bloqueó | ☐ |
| `ui-design-preview` se invocó | ☐ |
| Security Agent analizó login/auth como vector de datos | ☐ |
| Artefactos incluyen perspectiva de frontend, no solo backend | ☐ |

## Artefactos que deben existir al final
```
PRODUCT_VISION.md, UI_MOCKUPS/, TECH_STRATEGY.md,
SECURITY_MODEL.md, BACKLOG.md, IMPLEMENTATION_PLAN.md
```
