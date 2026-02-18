# Bakery Ops Board v1 (Google Apps Script)

## Live Website
- Open this URL in your browser:
- `https://script.google.com/macros/s/AKfycby-tdJdLaJQg7jX8M5JkD2L3DpQf7_FhmsnETS3kFu7ttAKbWEgQ5gRIU3SfCeIJUgE/exec`
- Latest deployed version: `@64` (2026-02-18)

## What Is Included
- Fast order capture (manual + JSON paste from Square/GPT agent).
- Per-item comment input (`details`) in selected lines with duplicate-row action.
- JSON alias mapping for item comments: `details` > `notes` > `comment`.
- Production Kanban with drag-and-drop plus tap-first movement controls (Previous/Next) and FIFO priority by capture time.
- One-line item comment preview on Kanban tickets with expand/collapse full text.
- Phase View panel to scan all statuses with FIFO rows and search (folio/customer/phone).
- Baker Summary panel with exact-product aggregates for `Stock / To Prepare` and `Delivered`.
- Friendly daily folio format: `ORD-14FEB-001`.
- Product popup grouped and sorted by product family with color coding.
- Product menu fallback to keep menu visible during temporary API delays.
- Product upsert/import endpoint for catalog sync from external sheet sources.
- English-first UI copy across capture, menu, and Kanban workflows.

## Structure
- `Code.gs`: backend API + business rules + Sheets access.
- `Admin.gs`: backup, environment prep, and smoke test utilities.
- `Index.html`: Web app UI (capture + Kanban).
- `appsscript.json`: Apps Script manifest.
- `DEPLOYMENT_CHECKLIST.md`: staging-to-production checklist.
- `qa_e2e.py`: automated E2E QA suite (API + headless UI).

## Expected Sheets
The `setup()` function creates/updates these tabs:
- `Orders`
- `Products`
- `Expenses`

If they already exist, missing columns are added for compatibility.

### Products Catalog Columns
`Products` supports family-level organization and quick visual detection:
- `id`
- `name`
- `price`
- `category`
- `family_key`
- `family_label`
- `family_color` (hex, e.g. `#2E8B57`)
- `family_order` (sort order across families)
- `variant_order` (sort order inside each family)
- `active`

If family columns are missing in old sheets, backend infers values from name/category and backfills automatically.

## Connecting to the Correct Spreadsheet
The backend can resolve the spreadsheet in two ways:

1. `SPREADSHEET_ID` in Script Properties (recommended).
2. `getActiveSpreadsheet()` when the project is bound to the Sheet.

To force the correct data source:
- Apps Script -> Project Settings -> Script properties
- Add:
  - Key: `SPREADSHEET_ID`
  - Value: `<Google Sheet ID>`

Tip:
- The ID is the part between `/d/` and `/edit` in the Sheet URL.

## Team Access Setup (Critical)
To avoid `permission` errors while saving orders, configure all three layers below.

1. Web App deployment permissions
- Apps Script -> Deploy -> Manage deployments -> edit active Web App.
- `Execute as`: `Me` (deployment owner).
- `Who has access`: `Anyone` or `Anyone with Google account` (based on your policy).
- Save and redeploy.

2. Spreadsheet permissions
- Open the target Sheet (`SPREADSHEET_ID`).
- Share it with the deployment owner account as `Editor`.
- If using shared drives, ensure this owner can edit files inside that drive/folder.

3. Script target configuration
- Apps Script -> Project Settings -> Script properties.
- Set `SPREADSHEET_ID=<target_sheet_id>`.
- Run `adminSetSpreadsheetIdProperty({ spreadsheet_id: "<target_sheet_id>" })`.
- Run `adminPrepareEnvironment()`.

### Fast Diagnostics
Use these URLs on your active `/exec` deployment:

- Spreadsheet + permission report:
  - `...?action=adminPermissionReport&spreadsheet_id=<target_sheet_id>`
- Current spreadsheet binding:
  - `...?action=getSpreadsheetInfo`

Expected:
- `adminPermissionReport` shows at least one `checks[].can_write=true`.
- Core tabs (`Orders`, `Products`, `Expenses`) are present or can be created by owner.

If report returns `SPREADSHEET_ACCESS_DENIED`:
- Share the sheet with deployment owner.
- Confirm deployment is `Execute as: Me`.
- Confirm workspace policy allows users to open the Web App URL.

If report returns `SPREADSHEET_WRITE_DENIED`:
- Deployment owner can read the Sheet but cannot edit it.
- Grant `Editor` permission to deployment owner (or Shared Drive `Content manager+`).
- Re-run `adminPrepareEnvironment()` after permission update.

## Repository Security
- Do not hardcode IDs/tokens in `Code.gs` or `Admin.gs`.
- Keep sensitive values outside the repo in:
  - `apps-script/private.local.json` (local file, git-ignored).
  - Apps Script Script Properties (`SPREADSHEET_ID`, etc.).
- Use `apps-script/private.local.json.example` as a template.

## Implemented Core Rules
- Statuses: `Pending`, `Working`, `Baked`, `Delivered`, `Cancelled`.
- Strict FIFO by `captured_at`.
- `Delivered` cannot be edited or moved.
- `Delivered` lock also blocks item-comment updates.
- Only `Baked -> Delivered` is allowed.
- `Cancelled` can be reverted only with confirmation.
- Previous/Next button map:
  - `Pending -> Working`
  - `Working -> Pending | Baked`
  - `Baked -> Working | Delivered`
  - `Delivered` and `Cancelled` show no move buttons.
- Visual age alert after 90+ minutes (red border).
- `Delivery` + `Unpaid` is allowed with a warning.
- Historical records without folio are marked as `LEGACY`.

## Kanban Operations UX Additions
- Movement controls:
  - Drag-and-drop remains available.
  - Tap movement uses existing transition authority (`requestStatusTransition(...)`).
  - Move buttons are colored by destination status and auto-adjust text contrast.
  - Duplicate fast taps are blocked.
- Phase View:
  - Open from the Kanban toolbar.
  - Groups selected-day orders by status.
  - Displays FIFO rows: folio, customer, delivery date/time, age, status.
  - Includes search by folio, customer, and phone.
- Baker Summary:
  - Open from the Kanban toolbar.
  - Uses selected-day data only.
  - `Stock / To Prepare` = `Pending + Working + Baked`.
  - `Delivered` = `Delivered` status totals + delivered order count.
  - Aggregation is exact product line (variant-level) from `items_json.quantity`.
  - Legacy/malformed `items_json` rows are skipped safely (no panel crash).
- Terminology:
  - `To Prepare` is production requirement for the selected day.
  - It is not a warehouse stock ledger.

## Kanban DnD Target Highlight Behavior
- During drag, only the currently hovered destination column is highlighted.
- Hovered column uses visual preview states:
  - `drop-target-valid` for allowed transitions.
  - `drop-target-invalid` for disallowed transitions.
- Dragged ticket uses `.ticket.dragging` visual state while the drag is active.
- Highlight preview rules:
  - Invalid if source and target statuses are the same.
  - Invalid if source is `Delivered`.
  - Invalid if target is `Delivered` and source is not `Baked`.
- Cleanup is enforced on both `drop` and `dragend` to prevent sticky classes.
- Existing transition execution path remains unchanged (`requestStatusTransition(...)` still enforces final business rules).

## Recommended Deployment Flow
1. Create a full backup of the production spreadsheet.
2. Publish a staging deployment in Apps Script.
3. Run the functional checklist (below).
4. Publish production deployment.

You can also run the managed flow with these functions:
1. `adminBackupSpreadsheet()`
2. `adminPrepareEnvironment()`
3. `adminRunSmokeTests()`

## Minimum QA Checklist
1. Creating a manual order generates `order_number` and `captured_at`.
2. Daily folio sequence increments (`...-001`, `...-002`).
3. Legacy orders are shown as `LEGACY`.
4. Kanban is ordered by oldest capture first.
5. Tickets older than 90 min show red border.
6. `Delivered` orders cannot be edited.
7. `Cancelled` can only be reverted with confirmation.
8. `Delivered` is blocked from statuses other than `Baked`.
9. `Delivery` + `Unpaid` shows warning and still saves.
10. 5-second refresh keeps the board synchronized.
11. Previous/Next movement buttons respect the status map and call the normal transition path.
12. Drag-and-drop still works with movement buttons enabled.
13. Phase View groups selected-day orders by status with FIFO ordering and search.
14. Baker Summary totals match selected-day orders (`To Prepare` and `Delivered`) and show delivered order count.

## Automated QA
Prerequisites:
- Python 3.9+
- `pip install --user playwright`
- `python3 -m playwright install chromium`

Run:
```bash
cd apps-script
python3 qa_e2e.py \
  --api-base "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec" \
  --local-dir "$(pwd)"
```

The suite validates:
- Order creation and folio format.
- FIFO ordering by `captured_at`.
- Status transition rules.
- `Delivered` locking behavior.
- `Cancelled` revert confirmation rule.
- UI flow for family popup ordering/colors + Kanban visibility.

Latest verified run:
- Passed: `25`
- Failed: `0`

Loading UX release gate (Milestone 4):
- Decision date: `2026-02-17`
- Decision: `NO-GO`
- Blocking finding: `LUX-BLOCKER-001` (board interaction degradation under active polling)
- Evidence report: `docs/qa/issue-57-loading-ux-qa-report.md`

Item comments release gate:
- Decision date: `2026-02-17`
- Decision: `GO`
- Evidence report: `docs/qa/issue-73-item-comments-qa-report.md`

## Product Catalog Sync
- Source spreadsheet used: `18hvcTtVil8Yc9hO9NYanGo6-qJVJ1iPf9gFXGcyFoII` (`gid=0`)
- Imported products in active menu: `15`
- Backend action: `action=adminUpsertProducts` (POST with `products` array)

## Operational Note
- This MVP is designed for internal use without login.
- ChatGPT agent is used externally to prepare JSON payloads; the app validates required fields before save.
