# Deployment Checklist (Staging -> Production)

## 0) Preconditions
- Active spreadsheet with tabs: `Orders`, `Products`, `Expenses`.
- Apps Script project with these files:
  - `Code.gs`
  - `Admin.gs`
  - `Index.html`
  - `appsscript.json`

## 1) Mandatory backup
In Apps Script, run:
1. `adminBackupSpreadsheet()`

Expected:
- `status: success`
- `backup_url` returned

Save `backup_url` in your deployment log.

## 2) Environment preparation
Run:
1. `adminPrepareEnvironment()`

Expected:
- `status: success`
- `orders_headers` includes these columns:
  - `order_number`
  - `captured_at`
  - `delivery_time`
  - `delivery_at`
  - `channel`
  - `source_notes`
  - `payment_method`
  - `deposit_amount`
  - `updated_at`
  - `sync_version`
  - `is_legacy`

## 3) Smoke tests
Run:
1. `adminRunSmokeTests()`

Expected:
- `status: success`
- metrics for orders/products/expenses

If it fails:
- Fix before deploy.
- Do not promote to production.

## 4) Staging deploy
1. Deploy web app in staging.
2. Validate in browser:
  - Capture: create a new order.
  - Kanban: move `Pending -> Working -> Baked -> Delivered`.
  - Locking: cannot edit `Delivered`.
  - Rules: cannot do `Pending -> Delivered` directly.
  - FIFO: oldest order first.
  - Folio format: `ORD-DDMMM-###`.
  - Dashboard: metrics are visible.
  - Expenses: can add and data is reflected.

## 5) Production deploy
Only if staging is green:
1. Create a new production deployment.
2. Run `adminRunSmokeTests()` in production.
3. Validate three live scenarios:
  - Create manual order.
  - Update status in Kanban.
  - Register an expense.

## 6) Rollback plan
If there is a critical issue:
1. Revert to previous deployment.
2. Restore spreadsheet from `backup_url`.
3. Re-validate operation with three basic scenarios.

## 7) Daily operations (recommended)
- Monitor red border cards (>90 min) in Kanban.
- Review delayed orders in dashboard at least twice per day.
- Use `LEGACY` only for historical records; new orders must use automatic folio.
