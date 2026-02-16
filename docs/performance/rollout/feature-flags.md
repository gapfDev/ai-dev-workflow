# Feature Flags Plan

## Candidate Flags
- `PERF_BOARD_SNAPSHOT_ENABLED`
- `PERF_BOARD_SKIP_NOCHANGE_RENDER`
- `PERF_BOARD_INCREMENTAL_RENDER`
- `PERF_BOARD_DELTA_SYNC`

## Rollout Order
1. Snapshot endpoint usage
2. No-change render skip
3. Delegation + adaptive polling
4. Incremental render
5. Delta sync (optional)
