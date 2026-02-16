# Board Revision Strategy (Draft)

## Goal
Return a deterministic `board_rev` so frontend can skip rendering when nothing relevant changed.

## Candidate Inputs
- Ordered tuple: `order_id`, `status`, `sync_version`, `updated_at`.

## Rules
1. Same logical board state must produce the same `board_rev`.
2. Any board-relevant change must produce a new `board_rev`.
3. Non-board changes should not rotate revision if they do not affect board rendering.

## Validation
- Add regression checks using static fixtures.
