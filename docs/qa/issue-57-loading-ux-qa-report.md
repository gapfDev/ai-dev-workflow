# Issue #57 - Loading UX QA Matrix + Regression + GO/NO-GO

## Decision
- **NO-GO**

## Rationale
- Core workflow business rules pass.
- Loading UX behavior has a blocker regression on board usability under active polling:
  - board loading overlay remains active for most of the time window and blocks day-switch interactions.

## Test Window
- Date (UTC): 2026-02-17
- Target API: `https://script.google.com/macros/s/AKfycbwdrOEkjbmkNl0gcwEtmBZFb_9nSbklnLKiB_fm2uel_igkFitO3zu8hxL9a9HhNUub/exec`
- Local UI harness: `apps-script/Index.html?apiBase=<exec>`

## Mandatory Matrix Coverage
| Scenario | Result | Evidence |
|---|---|---|
| Threshold/in-flight loading shown on board entry | PASS | `docs/qa/evidence/issue-57-loading-ux-observability-20260217-053751.json` |
| Manual refresh shows loading state | PASS | `docs/qa/evidence/issue-57-loading-ux-observability-20260217-053751.json` |
| Board remains interactive between polls | FAIL (blocker) | `docs/qa/evidence/issue-57-loading-ux-observability-20260217-053751.json` |
| Day switch remains usable under polling | FAIL (blocker) | `docs/qa/evidence/issue-57-loading-ux-observability-20260217-053751.json` |
| Regression: Delivered/Cancelled/FIFO business rules | PASS | `docs/qa/evidence/issue-57-qa-e2e-log.txt` |

## Regression Results (order workflow)
- API + UI regression suite: **25 passed / 0 failed**
- Verified rules:
  - Delivered only from Baked
  - Delivered cannot be edited or status-changed
  - Cancelled reactivation requires confirmation
  - FIFO ordering by capture timestamp

## Blocking Defect
- ID: `LUX-BLOCKER-001`
- Severity: P0
- Symptom:
  - board section stays in busy overlay state for most sampled intervals (`busy_ratio=0.974`, 76/78 samples in 20s)
  - day ribbon click cannot complete reliably while polling remains active
- Impact:
  - operators can be prevented from interacting with board day controls during normal operation
- Suspected area:
  - interaction between frequent board polling cadence and section-level busy overlay (pointer-event interception)

## GO Criteria Status
- Functional regression safety: ✅
- Loading UX usability on tablet workflow: ❌ (blocked by LUX-BLOCKER-001)

## Required Follow-up Before GO
1. Reduce busy-overlay lock contention during polling so board remains interactable.
2. Re-run loading observability checks and confirm busy ratio under interactive threshold.
3. Re-run full QA matrix and update GO/NO-GO decision.
