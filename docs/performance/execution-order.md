# Execution Order (Milestone 2)

## Phase 0 - Baseline
- #12 Phase 0 - Measure Current Kanban Speed and Define the 10x Target

## Phase 1 - Backend Hot Path
- #13 Phase 1A - Stop Running setup() on Every API Request
- #14 Phase 1B - Build Lightweight Kanban API (getBoardSnapshot)
- #15 Phase 1C - Add board_rev Signature for Change Detection

## Phase 2 - Frontend Throughput
- #16 Phase 2A - Skip Re-render When Kanban Data Is Unchanged
- #17 Phase 2B - Replace Per-Card Handlers with Event Delegation
- #18 Phase 2C - Add Visibility-Aware Polling and Smart Backoff
- #19 Phase 2D - Implement Incremental DOM Updates for Kanban

## Phase 3 - Optional Advanced Optimization
- #20 Phase 3 - Add Optional Delta Sync (Only Changed Orders)

## Phase 4 - Validation and Rollout
- #21 Phase 4A - Build Automated Performance Benchmark Gate
- #22 Phase 4B - Rollout Plan with Feature Flags and Safe Rollback
- #23 Phase 4C - Update Docs, Runbooks, and Ownership Handoff

## Exit Criteria
- 10x speed improvement against Phase 0 baseline metrics.
- No regression in Kanban behavior and order state rules.
- Rollout + rollback documented and validated.
