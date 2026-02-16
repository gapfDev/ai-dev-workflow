# Bakery Ops Board v1 (Google Apps Script)

## Live Website
- Open this URL in your browser:
  - `https://script.google.com/macros/s/AKfycbwdrOEkjbmkNl0gcwEtmBZFb_9nSbklnLKiB_fm2uel_igkFitO3zu8hxL9a9HhNUub/exec`
- Latest deployed version: `@22` (2026-02-16)

## What Is Included
- Fast order capture (manual + JSON paste from Square/GPT agent).
- Production Kanban with drag and drop and FIFO priority by capture time.
- Friendly daily folio format: `ORD-14FEB-001`.
- Product popup grouped and sorted by product family with color coding.
- Product menu fallback to keep menu visible during temporary API delays.
- Product upsert/import endpoint for catalog sync from external sheet sources.
- ES/EN bilingual UI with manual language toggle.

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
- Only `Baked -> Delivered` is allowed.
- `Cancelled` can be reverted only with confirmation.
- Visual age alert after 90+ minutes (red border).
- `Delivery` + `Unpaid` is allowed with a warning.
- Historical records without folio are marked as `LEGACY`.

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

## Product Catalog Sync
- Source spreadsheet used: `18hvcTtVil8Yc9hO9NYanGo6-qJVJ1iPf9gFXGcyFoII` (`gid=0`)
- Imported products in active menu: `15`
- Backend action: `action=adminUpsertProducts` (POST with `products` array)

## Operational Note
- This MVP is designed for internal use without login.
- ChatGPT agent is used externally to prepare JSON payloads; the app validates required fields before save.
