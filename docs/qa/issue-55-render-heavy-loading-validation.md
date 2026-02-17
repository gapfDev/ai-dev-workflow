# Issue #55 - Render-Heavy UI Loading Validation

## Scope Covered
- Added section-level loading treatment for render-heavy paths:
  - `renderKanban`
  - `renderMenuFamilies`
  - `renderSelectedItems`
- Heavy-render loading is applied conditionally using workload limits to avoid unnecessary visual noise.

## Workload Heuristics
- `menuProducts >= 24`
- `selectedItems >= 10`
- `boardOrders >= 16`

## Evidence
- Updated file: `apps-script/Index.html`
- Added render thresholds constant: `RENDER_HEAVY_LIMITS`.
- Added section loading enter/exit around heavy render blocks with `updateSectionCounts(...)`.

## Verification
- Syntax check passed for inline script extraction:
  - `node --check` => `JS_OK`
- Existing visual hierarchy and behavior preserved:
  - No structural markup changes to menu cards, selected-items table, or kanban ticket/column layout.

## Outcome
- Render-heavy UI paths now show non-blocking section loading feedback when workload is likely to exceed threshold-driven UX expectations.
