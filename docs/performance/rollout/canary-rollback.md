# Canary and Rollback Plan

## Canary Steps
1. Enable flags for internal test users only.
2. Validate core flows: capture, board refresh, status transitions.
3. Compare perf and error metrics vs baseline.

## Rollback Triggers
- Broken status transitions
- Missing cards or stale board state
- Error spikes or severe UI instability

## Rollback Action
1. Disable performance flags in reverse order.
2. Revert to full snapshot/full render fallback.
3. Re-run smoke + QA checks.
