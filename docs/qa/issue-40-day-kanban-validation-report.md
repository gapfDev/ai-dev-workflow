# Validation Report - Issue #40 (Day-Based Kanban)

> Historical note: this report captures the **initial failed gate** before P0 remediation.
> Revalidation after fixes is documented in `docs/qa/issue-40-day-kanban-revalidation-afterfix.md`.

## Metadata
- Repo: `gapfDev/bakery-ops-board-private`
- Milestone: `Milestone 3 - Day-Based Kanban Operations`
- Track: `track:day-kanban`
- Ticket: `#40`
- QA Agent Start: `2026-02-16`
- Current Status: `COMPLETED - REJECTED (P0 blockers found)`

## Dependency Gate
Final QA execution/sign-off is blocked until all prerequisite tickets are CLOSED:
- `#31` B1: BoardDays schema/migration
- `#32` B2: getBoardDays + getOrders(board_day)
- `#33` B3: Day-scoped snapshot/delta
- `#34` B4: archive/unarchive endpoints
- `#35` B5: auto-unarchive on activity
- `#36` C1: Day Ribbon UI
- `#37` C2: Render selected day
- `#38` C3: Archive/Unarchive UI flow
- `#39` C4: Day-scoped polling optimization

Final gate snapshot (`2026-02-16 07:46 UTC`):
- CLOSED: `#31`, `#32`, `#33`, `#34`, `#35`, `#36`, `#37`, `#38`, `#39`

## Scope
- Full day-kanban QA matrix (functional + edge + error + boundary)
- Regression suite for pre-existing MVP core behavior
- Release checklist sign-off (staging -> production gate)

## Test Environment
- Backend: Apps Script `/exec` deployment under test
- UI (regression): local `apps-script/Index.html` against `/exec` API base
- UI (deployment validation): published `/exec` in Apps Script iframe runtime
- Data source: staging sheet configured by script properties
- Device profiles: tablet landscape + portrait (required for day ribbon UX)

## Day-Kanban Matrix (12 Mandatory Scenarios)
| TC ID | Scenario | Area | Expected Result | Result | Evidence |
|---|---|---|---|---|---|
| DK-001 | `setup()` creates/validates `BoardDays` | Data | Fresh and existing environments include required headers | ✅ PASS | `docs/qa/evidence/issue-40-day-kanban-api-20260216-075656.json` |
| DK-002 | `setup()` idempotency + backfill from `Orders.delivery_date` | Data | Re-run does not duplicate rows; all distinct days exist in `BoardDays` | ❌ FAIL | `docs/qa/evidence/issue-40-day-kanban-api-20260216-075656.json` |
| DK-003 | `GET getBoardDays` contract | API | Returns days with orders only, with counts + `is_archived` + `updated_at` | ❌ FAIL | `docs/qa/evidence/issue-40-day-kanban-api-20260216-075656.json` |
| DK-004 | `GET getOrders` with/without `board_day` | API | Scoped result when provided; backward-compatible full result when omitted | ❌ FAIL | `docs/qa/evidence/issue-40-day-kanban-api-20260216-075656.json` |
| DK-005 | `GET getBoardSnapshot(board_day)` isolation | API/Sync | Snapshot includes only selected day orders; deterministic day-scoped `board_rev` | ❌ FAIL | `docs/qa/evidence/issue-40-day-kanban-api-20260216-075656.json` |
| DK-006 | `GET getBoardDelta(board_day)` isolation + removals | API/Sync | Delta scoped to selected day; `removed` includes orders moved out of day | ❌ FAIL | `docs/qa/evidence/issue-40-day-kanban-api-20260216-075656.json` |
| DK-007 | `POST archiveBoardDay` validation rules | API | Missing reason/confirm flags returns actionable error | ✅ PASS | `docs/qa/evidence/issue-40-day-kanban-api-20260216-075656.json` |
| DK-008 | Archive day with pending orders + audit fields | API/Data | Archive succeeds even with pending orders; audit fields updated | ❌ FAIL | `docs/qa/evidence/issue-40-day-kanban-api-20260216-075656.json` |
| DK-009 | `POST unarchiveBoardDay` + audit trail | API/Data | Unarchive requires reason and updates state/audit fields | ❌ FAIL | `docs/qa/evidence/issue-40-day-kanban-api-20260216-075656.json` |
| DK-010 | Auto-unarchive on create/move into archived day | API | Archived day flips to active and response includes auto-unarchive hint | ❌ FAIL | `docs/qa/evidence/issue-40-day-kanban-api-20260216-075656.json` |
| DK-011 | Day Ribbon + selected day rendering | UI | Ribbon lists days-with-orders only; selected day isolation; archived badge visible | ❌ FAIL | `docs/qa/evidence/issue-40-day-kanban-ui-20260216-075936.json` |
| DK-012 | UI archive/unarchive flow + archived-day operations | UI | Double confirm + reason enforced; archived day still supports edit/drag/status | ❌ FAIL | `docs/qa/evidence/issue-40-day-kanban-ui-20260216-075936.json` |

## Regression Suite (Core MVP)
| RG ID | Regression Check | Expected Result | Result | Evidence |
|---|---|---|---|---|
| RG-001 | Order capture generates `order_number` + `captured_at` | Pass | ✅ PASS | `docs/qa/evidence/issue-40-regression-20260216-080052.log` |
| RG-002 | FIFO ordering by `captured_at` | Pass | ✅ PASS | `docs/qa/evidence/issue-40-regression-20260216-080052.log` |
| RG-003 | `Delivered` lock and transition restrictions | Pass | ✅ PASS | `docs/qa/evidence/issue-40-regression-20260216-080052.log` |
| RG-004 | Cancel/reactivate confirmation rules | Pass | ✅ PASS | `docs/qa/evidence/issue-40-regression-20260216-080052.log` |
| RG-005 | Delivery + unpaid warning path | Pass | ✅ PASS | API create `type=Delivery` + `payment_status=Unpaid` accepted (`order_id=ORD-1771228842464`) |
| RG-006 | Existing unscoped board/capture flows unchanged | Pass | ✅ PASS | `docs/qa/evidence/issue-40-regression-20260216-080052.log` |
| RG-007 | Baseline automated suite (`apps-script/qa_e2e.py`) | 0 failures | ✅ PASS | `docs/qa/evidence/issue-40-regression-20260216-080052.log` (Passed: 25, Failed: 0) |

## Release Checklist (Sign-Off Gate)
| Item | Expected | Status | Evidence |
|---|---|---|---|
| Mandatory backup completed | `adminBackupSpreadsheet()` returns success + `backup_url` | ⚠️ BLOCKED | `action=adminBackupSpreadsheet` not exposed; `clasp run adminBackupSpreadsheet` not executable in this environment |
| Environment prepared | `adminPrepareEnvironment()` success and headers validated | ✅ PASS | `docs/qa/evidence/issue-40-day-kanban-api-20260216-075656.json` |
| Smoke tests green | `adminRunSmokeTests()` success in staging | ❌ FAIL | `docs/qa/evidence/issue-40-day-kanban-api-20260216-075656.json` (`BoardDays missing delivery_date keys...`) |
| Day-kanban matrix complete | 12/12 scenarios executed with artifacts | ✅ PASS | API + UI evidence files attached |
| Regression complete | All baseline checks pass | ✅ PASS | `docs/qa/evidence/issue-40-regression-20260216-080052.log` |
| P0 blockers | None open | ❌ FAIL | Open blockers: `#46`, `#47`, `#48` |
| Production gate decision | APPROVE / APPROVE WITH CONDITIONS / REJECT | ❌ REJECT | P0 blockers present |

## P0 Blockers Logged
| Issue | Title | Status |
|---|---|---|
| `#48` | board_day scoping returns wrong day and empty payloads | OPEN |
| `#46` | BoardDays consistency broken; smoke tests fail with missing delivery_date keys | OPEN |
| `#47` | Deployed Kanban UI not day-scoped (no day ribbon/archive controls, no board_day in sync calls) | OPEN |

## Blocking/Incident Log
- `2026-02-16`: Execution gating active; waiting for dependency tickets `#31..#39` to be CLOSED before running final matrix and sign-off.
- `2026-02-16 07:22 UTC`: Posted `BLOCKED` update on issue `#40` after >15 minutes waiting. Exact blocker: dependencies `#35..#39` still OPEN.
- `2026-02-16 07:46 UTC`: Dependency gate cleared (`#31..#39` CLOSED). Full matrix execution started.
- `2026-02-16 08:00 UTC`: Matrix + regression + release checks completed with REJECT outcome.

## Final Recommendation
- Decision: `❌ REJECT - NOT READY FOR PRODUCTION`
- Reason: P0 defects in day-scoped backend behavior, data consistency/smoke gate, and deployed UI day-kanban functionality.
