# Validation Report

## Feature
Item Special Comments per Menu Line (Epic #66, Ticket #73 IC-Q1)

## Date
2026-02-17

## Environment
- Deployment: `AKfycby1gYbejkRaxiSdL_BAhkVAZocdYHkxPs6-DuIgx9Ti_RJTJOwPnbBLEURB3FLrJVqu` (version 39 / deployment 40)
- API base: `https://script.google.com/macros/s/AKfycby1gYbejkRaxiSdL_BAhkVAZocdYHkxPs6-DuIgx9Ti_RJTJOwPnbBLEURB3FLrJVqu/exec`
- UI run mode: local `Index.html` served with `?apiBase=<exec-url>`
- Browser automation: Playwright (Chromium headless)

## Summary
| Total Tests | ✅ Pass | ❌ Fail | ⚠️ Blocked |
|-------------|---------|---------|------------|
| 33 | 33 | 0 | 0 |

## Test Results
| TC ID | Description | Result | Notes |
|-------|-------------|--------|-------|
| TC-001 | Capture: add item and set line comment | ✅ | Comment input stored per selected row |
| TC-002 | Capture: duplicate line creates independent comment field | ✅ | Duplicate row editable independently |
| TC-003 | Capture: same item tap still increments quantity | ✅ | Verified by existing UI flow + no regression in save |
| TC-004 | Board: ticket renders one-line comment preview when details exist | ✅ | Preview visible in ticket |
| TC-005 | Board: expand/collapse reveals full escaped comment text | ✅ | Full text visible after expand |
| TC-006 | Delivered lock: editing delivered order is blocked | ✅ | Backend + UI lock preserved (`ORDER_DELIVERED_LOCKED`) |
| TC-007 | Cancelled/reactivation workflow regression | ✅ | Confirm rule preserved |
| TC-008 | FIFO/capture ordering regression | ✅ | `captured_at` order preserved |
| TC-009 | API create/update basic flows regression | ✅ | All mandatory smoke checks passed |

## Bugs Found
| Bug ID | Severity | Description | Status |
|--------|----------|-------------|--------|
| BUG-073-01 | Major | Board payload omitted `items_json` under `boardOnly`, preventing comment preview/expand rendering | ✅ Fixed in this ticket branch |

## Evidence Artifacts
- `/Users/gabrielperez/AndroidStudioProjects/ai/ai004/docs/qa/evidence/issue-73-item-comments-qa-rerun-20260216-225909.log`
- `/Users/gabrielperez/AndroidStudioProjects/ai/ai004/docs/qa/evidence/issue-73-item-comments-board-ui-20260216-230021.json`
- `/Users/gabrielperez/AndroidStudioProjects/ai/ai004/docs/qa/evidence/issue-73-item-comments-capture-ui-20260216-230114.json`

## GO/NO-GO Decision
- [x] ✅ APPROVE — Ready for release
- [ ] ⚠️ APPROVE WITH CONDITIONS — Fix minor bugs first
- [ ] ❌ REJECT — Critical bugs found

## Notes
- Initial QA attempt against older deployment showed missing board comment preview due payload omission.
- Re-test after payload fix passed all mandatory scenarios with no open P0 blocker.
