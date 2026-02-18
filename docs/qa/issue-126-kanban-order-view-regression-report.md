# Issue #126 QA Regression Report (Kanban Order View Usability)

## Decision
- GO
- Date: 2026-02-18
- Deployment verified: `@68`
- URL: `https://script.google.com/macros/s/AKfycby-tdJdLaJQg7jX8M5JkD2L3DpQf7_FhmsnETS3kFu7ttAKbWEgQ5gRIU3SfCeIJUgE/exec`

## Gate 1 (Cleanup Before Regression)
- Action: `adminResetQaData`
- Result: `success`
- Backup URL: `https://docs.google.com/spreadsheets/d/1C9c2Dz7icUTAQOwK9PZyOs6mdi6kwfHW8HNn3JdHQVI/edit?usp=drivesdk`
- Cleared rows: `Orders=9`, `Expenses=0`, `BoardDays=2`
- Smoke metrics: `orders=0`, `products=15`, `expenses=0`, `board_days=0`
- Evidence: `docs/qa/evidence/issue-126-cleanup-gate.json`

## Regression Evidence
- Baseline E2E: PASS `25/25`
  - `docs/qa/evidence/issue-126-qa-e2e-20260217-235846.log`
- Extended matrix: PASS `24/24`
  - `docs/qa/evidence/issue-126-regression-matrix.log`

## Matrix Coverage Summary
- `Ver orden` button visible in all statuses.
- CTA style verified (gradient + high-contrast text + count label).
- Single-expanded-ticket behavior verified.
- Expanded summary fields verified.
- Full items list verified with no internal scroll.
- Missing item comments render fallback `-`.
- Malformed `items_json` does not crash render.
- Move-button map and behavior verified.
- Drag-and-drop regression verified.
- Phase View opens correctly.
- Baker Summary opens correctly.
- Delivered lock and cancelled/reactivate flow covered by baseline E2E.

## Residual Risks
- None blocking for hotfix scope.
- Continue monitoring board behavior during heavy-order peaks.
