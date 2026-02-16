# Runbook: Deploy and Rollback

## Deploy
1. Run `adminBackupSpreadsheet()` and store `backup_url`.
2. Run `adminPrepareEnvironment()`.
3. Run `adminRunSmokeTests()`.
4. Deploy a new Web App version (`Execute as: Me`, `Who has access: Anyone with the link`).
5. Validate:
  - `GET /exec?action=getProducts`
  - `GET /exec?action=getOrders`
  - Create one order from UI and verify `order_number` and `captured_at`.

## Rollback
1. Switch Web App deployment to the previous stable version.
2. Restore spreadsheet from `backup_url` if data integrity is impacted.
3. Re-run smoke checks.
4. Confirm core flows (capture, Kanban transitions, expenses).
