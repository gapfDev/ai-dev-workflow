# Phase 0 - Baseline and 10x Target

## Tickets
- #12

## Deliverables
- Baseline benchmark against the live production board size.
- Target threshold table for sign-off.

## Checklist
- [x] Define baseline scenario inputs.
- [x] Capture API p50/p95 for board reads.
- [x] Capture payload size for board API.
- [x] Capture frontend render+script cost.
- [x] Store results under `../benchmarks/runs/`.

## Notes
- Baseline and post-deploy runs are stored under `../benchmarks/runs/`.
- Extended 100/300-order synthetic benchmarks should be tracked as a follow-up backlog item.
