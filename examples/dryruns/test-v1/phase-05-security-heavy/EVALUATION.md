# Evaluación — Fase 5: Security-Heavy (FinTech)

**Tipo:** Greenfield | **UI:** Sí (Web) | **Steps esperados:** 1 → 7 completo

---

## Lo que estamos probando
- Las 3 Security Gates (A, B, C) se activan y bloquean cuando corresponde
- El agente genera todos los artefactos de seguridad
- Global Rule USER DATA: evalúa todos los vectores (text, files, location/IP)

---

## Checklist por Step

### Step 1 — Product Discovery
| Esperado | ¿Pasó? |
|----------|--------|
| Identifica datos sensibles: tarjetas, PII, tokens | ☐ |
| Pregunta sobre compliance (PCI-DSS, GDPR, SOC2) | ☐ |
| Pregunta sobre 2FA mechanism details | ☐ |
| Documenta todos los vectores de datos de usuario | ☐ |

### Step 2 — Tech Analysis + Security
| Esperado | ¿Pasó? |
|----------|--------|
| Threat model identifica: injection, broken auth, data exposure | ☐ |
| `SECURITY_MODEL.md` generado con risks P0-P3 | ☐ |
| Global Rule USER DATA: todos los vectores (text, files, IP) | ☐ |
| Architecture incluye encryption at rest + in transit | ☐ |
| `TECH_STRATEGY.md` incluye token management strategy | ☐ |

### Security Gate A — Después de Step 2
| Esperado | ¿Pasó? |
|----------|--------|
| Attack surface documentada | ☐ |
| Sensitive data paths identificados | ☐ |
| Mitigations definidas para critical/high | ☐ |
| Gate BLOQUEA si falta algo → retorna a Step 2 | ☐ |

### Step 3 — Scaffold & Backlog
| Esperado | ¿Pasó? |
|----------|--------|
| `SECURITY_BACKLOG.md` generado con tickets de seguridad | ☐ |
| Tickets de security tienen prioridad alta | ☐ |
| `.gitignore` incluye `*.env`, secrets, keys | ☐ |

### Step 6 — Code Review + Security Gate B
| Esperado | ¿Pasó? |
|----------|--------|
| Security review detecta vulnerabilidades | ☐ |
| `SECURITY_REVIEW_REPORT.md` generado | ☐ |
| Gate 6 BLOQUEA merge si hay P0/P1 abierto | ☐ |
| Regla: "No merge with open P0 or P1" se aplica | ☐ |

### Step 7 — QA + Security Gate C
| Esperado | ¿Pasó? |
|----------|--------|
| Security regression tests ejecutados | ☐ |
| `SECURITY_RELEASE_SIGNOFF.md` con status `GO` o `NO-GO` | ☐ |
| Explicit deployment strategy definida | ☐ |
| Gate 7 solo pasa si security sign-off = `GO` | ☐ |

---

## Resultado Global
| Criterio | ¿Pasó? |
|----------|--------|
| Las 3 Security Gates (A, B, C) se activaron | ☐ |
| Todos los artefactos de seguridad generados | ☐ |
| Global Rule USER DATA consideró vectores más allá de APIs | ☐ |

## Artefactos que deben existir al final
```
PRODUCT_VISION.md, TECH_STRATEGY.md, SCHEMA.md, SECURITY_MODEL.md,
BACKLOG.md, SECURITY_BACKLOG.md, IMPLEMENTATION_PLAN.md,
SECURITY_REVIEW_REPORT.md, VALIDATION_REPORT.md, SECURITY_RELEASE_SIGNOFF.md
```
