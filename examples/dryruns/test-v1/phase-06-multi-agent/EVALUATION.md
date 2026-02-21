# Evaluación — Fase 6: Multi-Agent con Conflictos

**Tipo:** Greenfield | **UI:** Sí | **Steps esperados:** 5a → 6

---

## Lo que estamos probando
- Step 5a Workflow Agreement funciona con N agentes paralelos
- File CLAIM protocol detecta conflictos compartidos
- Circuit Breaker se activa a los 3 fallos consecutivos
- PRs se vinculan a issues correctamente

---

## Checklist por Step

### Step 5a — Workflow Agreement
| Esperado | ¿Pasó? |
|----------|--------|
| Manager decide: **N agentes** (3 paralelos) | ☐ |
| Define **stale threshold** | ☐ |
| Establece **File CLAIM protocol** | ☐ |
| `agent-communication` se activa (message board) | ☐ |

### Git Worktree Setup
| Esperado | ¿Pasó? |
|----------|--------|
| `git-worktree-runner` crea 3 worktrees aislados | ☐ |
| Branches siguen formato `codex/[issue-#]-[short-name]` | ☐ |

### Conflicto de Archivo — OrderService.ts
| Esperado | ¿Pasó? |
|----------|--------|
| Cart y Checkout reclaman `OrderService.ts` | ☐ |
| El protocolo CLAIM detecta el conflicto | ☐ |
| Se resuelve sin perder cambios | ☐ |
| El conflicto se documenta en message board | ☐ |

### Step 6 — Code Review
| Esperado | ¿Pasó? |
|----------|--------|
| 3 PRs creados, vinculados a issues (`Closes #XX`) | ☐ |
| `gh-pr-closeout` vincula PRs correctamente | ☐ |
| Code review detecta merge conflicts si los hay | ☐ |

### Circuit Breaker
| Esperado | ¿Pasó? |
|----------|--------|
| Si un agente falla 3 veces → Circuit Breaker activo | ☐ |
| Avisa: "⚠️ I need help. Sticking on error in branch X." | ☐ |

---

## Resultado Global
| Criterio | ¿Pasó? |
|----------|--------|
| 3 tickets completados sin pérdida de código | ☐ |
| Conflicto de archivo detectado y resuelto | ☐ |
| Message board tiene log de comunicación entre agentes | ☐ |
| Todos PRs vinculados y cerrados correctamente | ☐ |

## Artefactos que deben existir al final
```
WORKFLOW_AGREEMENT.md, MESSAGE_BOARD.md,
PR_REPORT_ticket_1.md, PR_REPORT_ticket_2.md, PR_REPORT_ticket_3.md
```
