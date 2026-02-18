# Issue #120 - HOTFIX Regression Report (Ver orden por ticket)

## Scope
- Feature under test: boton `Ver orden` en cada ticket Kanban con panel expandible de resumen + items + comentarios.
- File changed: `apps-script/Index.html` (frontend only).
- Backend/API changes: none.

## Evidence
- `docs/qa/evidence/issue-120-hotfix-baseline-20260217-231846.log`
- `docs/qa/evidence/issue-120-hotfix-matrix-20260217-231846.log`

## Baseline Regression
- Suite: `apps-script/qa_e2e.py`
- Result: **PASS (25/25)**
- Covered legacy rules: FIFO, Delivered lock, Cancelled/reactivate, core board/capture behavior.

## Hotfix Matrix
- Result: **PASS (15/15)**

Validated scenarios:
1. Pending has `Ver orden` button.
2. Working has `Ver orden` button.
3. Baked has `Ver orden` button.
4. Delivered has `Ver orden` button.
5. Cancelled has `Ver orden` button.
6. Single expanded ticket behavior (open one closes previous).
7. Expanded panel shows summary (`Folio + Cliente + Entrega + Total`).
8. Expanded panel lists all item rows.
9. Missing item comment renders fallback (`-`).
10. Malformed `items_json` does not crash Kanban.
11. Move buttons regression check (`Pending -> Working`) passed.
12. Drag-and-drop regression check (`Working -> Baked`) passed.
13. Phase View still opens.
14. Baker Summary still opens.

## GO/NO-GO Decision
- **GO**

## Notes
- Expansion state is intentionally reset on refresh/polling and day switch.
- No public API contract changes were introduced.
