# Phase 1 - Backend Hot Path Optimization

## Tickets
- #13
- #14
- #15

## Deliverables
- Runtime path without expensive setup per request.
- Lightweight snapshot endpoint for board rendering.
- Stable `board_rev` signature.

## Checklist
- [x] Remove setup-heavy operations from hot path.
- [x] Add `getBoardSnapshot` contract implementation.
- [x] Add `board_rev` generation and validation.
- [x] Document API shape in `../contracts/`.
