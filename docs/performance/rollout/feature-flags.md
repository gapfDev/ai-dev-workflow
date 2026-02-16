# Feature Flags Plan

## Active Flags (Script Properties)
- `PERF_BOARD_SNAPSHOT_ENABLED` (default: `true`)
- `PERF_BOARD_SKIP_NOCHANGE_RENDER` (default: `true`)
- `PERF_BOARD_INCREMENTAL_RENDER` (default: `true`)
- `PERF_BOARD_DELTA_SYNC` (default: `true`)

## Wiring
- Backend endpoint: `GET /exec?action=getClientConfig`
- Frontend load point: startup (`loadClientConfig()`) before first board refresh.

## Rollout Order
1. Snapshot endpoint usage
2. No-change render skip
3. Delegation + adaptive polling
4. Incremental render
5. Delta sync (optional)
