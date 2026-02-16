# Runbook: Deploy and Rollback

## Deploy
1. Run `adminBackupSpreadsheet()` and store `backup_url`.
2. Run `adminPrepareEnvironment()`.
3. Run `adminRunSmokeTests()`.
4. Deploy a new Web App version (`Execute as: Me`, `Who has access: Anyone with the link`).
5. Validate:
  - `GET /exec?action=getProducts`
  - `GET /exec?action=getOrders`
  - `GET /exec?action=getBoardSnapshot`
  - `GET /exec?action=getClientConfig`
  - Create one order from UI and verify `order_number` and `captured_at`.

## Rollback
1. Switch Web App deployment to the previous stable version.
2. If needed, disable performance flags:
  - `PERF_BOARD_DELTA_SYNC=false`
  - `PERF_BOARD_INCREMENTAL_RENDER=false`
  - `PERF_BOARD_SKIP_NOCHANGE_RENDER=false`
  - `PERF_BOARD_SNAPSHOT_ENABLED=false`
3. Restore spreadsheet from `backup_url` if data integrity is impacted.
4. Re-run smoke checks.
5. Confirm core flows (capture, Kanban transitions, expenses).
