# Issue #141 QA Report - Kanban Complete Order Details

- Date: 2026-02-18
- Scope: Verify Kanban `Ver orden` shows all captured order data (including item comments) without regressions.
- Deployment under test: `https://script.google.com/macros/s/AKfycby-tdJdLaJQg7jX8M5JkD2L3DpQf7_FhmsnETS3kFu7ttAKbWEgQ5gRIU3SfCeIJUgE/exec`

## Result
- GO
- Blockers: 0

## Evidence
- `docs/qa/evidence/issue-141-qa-e2e-20260218-010026.txt`
- `docs/qa/evidence/issue-141-order-view-detail-20260218-010154.txt`

## Checks covered
1. Full regression baseline (`qa_e2e.py`) passed: 25/25.
2. Kanban ticket expanded order view shows:
   - summary (folio, customer, delivery date/time, total)
   - captured fields (phone, type, channel, payment status, payment method, deposit, address, source notes)
   - full items list with quantity + item comment
3. Hydration path from board snapshot to full `getOrders` details confirmed.
4. No regression in status movement rules, Delivered lock, cancel/reactivate, and Kanban rendering density class.
