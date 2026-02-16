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
- [ ] Remove setup-heavy operations from hot path.
- [ ] Add `getBoardSnapshot` contract implementation.
- [ ] Add `board_rev` generation and validation.
- [ ] Document API shape in `../contracts/`.
