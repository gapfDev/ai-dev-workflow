# Engineering Standards

## Scope
These standards apply to all Bakery Ops MVP changes in `apps-script/` and operational documentation.

## Language and Communication
- Repository-facing artifacts must be in English.
- User-facing copy in the UI must default to English.
- Issue titles, milestones, and runbooks are maintained in English.

## Code Style
- Keep functions small and focused around one responsibility.
- Avoid hidden side effects in helpers; return values explicitly.
- Prefer guard clauses over nested conditionals.
- Reuse shared helpers for validation and response building.

## Backend Structure (Apps Script)
- `Code.gs` handles request routing and orchestration.
- `Admin.gs` contains admin-only setup/backup/smoke workflows.
- Business rules should be centralized and not duplicated across handlers.
- Sheet reads/writes must be encapsulated in utility functions.

## Frontend Structure
- `Index.html` should isolate concerns: API calls, state, rendering, and event binding.
- UI behavior must preserve these rules:
  - `Delivered` only from `Baked`.
  - `Delivered` is immutable.
  - `Cancelled` reactivation requires confirmation.

## Data Rules
- Required order fields: `order_id`, `order_number`, `captured_at`, `status`.
- Product records must remain deduplicated by canonical product key.
- Schema migrations must be idempotent.

## API Contract
- All actions return JSON.
- Success envelope: `status: "success"` + payload.
- Error envelope: `status: "error"` + actionable message.
- Validation errors must identify missing/invalid fields.

## Testing and Release
- Run `adminRunSmokeTests()` before production deploy.
- Run `qa_e2e.py` against the `/exec` deployment URL.
- Do not release if smoke or E2E critical checks fail.

## Git and PR Rules
- One issue per branch and PR when feasible.
- Branch naming prefix: `codex/`.
- Commits reference issue number when linked to milestone scope.
- PR description includes: scope, risk, validation evidence.
