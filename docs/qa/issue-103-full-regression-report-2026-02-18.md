# Issue #103 - Full Regression Report (Old + New Features)

## Scope
- Legacy flows: capture, FIFO, status rules, cancel/reactivate, day archive/unarchive, baseline UI behavior.
- New flows: move buttons (Previous/Next), Phase View, Baker Summary (To Prepare/Delivered, day-scoped totals, malformed `items_json` tolerance).
- Environment date: 2026-02-18.

## Evidence Files
- `docs/qa/evidence/issue-103-regression-automated-20260217-223909.log`
- `docs/qa/evidence/issue-103-regression-seeded-20260217-223909.log`
- `docs/qa/evidence/issue-103-regression-archive-20260217-224208.log`
- `docs/qa/evidence/issue-103-regression-interactions-20260217-224208.log`
- `docs/qa/evidence/issue-103-regression-interactions-20260217-224449.log`
- `docs/qa/evidence/issue-103-regression-dnd-browser-events-20260217-224752.log`

## Dependency Gate
- Epic delivery chain was already closed before this run: #104 -> #111 closed.

## Results Summary
| Suite | Result |
|---|---|
| Baseline automated E2E (`qa_e2e.py`) | ✅ Pass (25/25) |
| New-feature seeded matrix | ✅ Pass (19/19) |
| Archive/unarchive API regression | ✅ Pass |
| Fast-tap duplicate suppression | ✅ Behavior observed (second click blocked while button disabled) |
| Drag-and-drop transition (Working -> Baked) | ✅ Pass via browser drag events dispatch |

## Matrix Details
| ID | Scenario | Result | Evidence |
|---|---|---|---|
| RG-001 | Product API, create order, folio/captured_at generation | ✅ | `issue-103-regression-automated-20260217-223909.log` |
| RG-002 | FIFO ordering by `captured_at` | ✅ | `issue-103-regression-automated-20260217-223909.log` |
| RG-003 | Delivered lock + transition restrictions | ✅ | `issue-103-regression-automated-20260217-223909.log` |
| RG-004 | Cancel/reactivate confirmation rules | ✅ | `issue-103-regression-automated-20260217-223909.log` |
| RG-005 | UI board loads and density class behavior | ✅ | `issue-103-regression-automated-20260217-223909.log` |
| KOUX-001 | Pending shows Next->Working | ✅ | `issue-103-regression-seeded-20260217-223909.log` |
| KOUX-002 | Working shows Prev/Next | ✅ | `issue-103-regression-seeded-20260217-223909.log` |
| KOUX-003 | Baked shows Prev/Next | ✅ | `issue-103-regression-seeded-20260217-223909.log` |
| KOUX-004 | Delivered/Cancelled show no move buttons | ✅ | `issue-103-regression-seeded-20260217-223909.log` |
| KOUX-005 | Phase View opens + 5 grouped statuses | ✅ | `issue-103-regression-seeded-20260217-223909.log` |
| KOUX-006 | Phase View search by seeded data | ✅ | `issue-103-regression-seeded-20260217-223909.log` |
| KOUX-007 | Baker Summary opens with 2 sections | ✅ | `issue-103-regression-seeded-20260217-223909.log` |
| KOUX-008 | Baker Summary delivered order count matches API | ✅ | `issue-103-regression-seeded-20260217-223909.log` |
| KOUX-009 | Baker Summary To Prepare totals match API | ✅ | `issue-103-regression-seeded-20260217-223909.log` |
| KOUX-010 | Baker Summary Delivered totals match API | ✅ | `issue-103-regression-seeded-20260217-223909.log` |
| KOUX-011 | Archive/unarchive day operations | ✅ | `issue-103-regression-archive-20260217-224208.log` |
| KOUX-012 | Fast-tap duplicate suppression | ✅ | `issue-103-regression-interactions-20260217-224449.log` (button remained disabled during pending request) |
| KOUX-013 | Drag-and-drop working->baked regression | ✅ | `issue-103-regression-dnd-browser-events-20260217-224752.log` |

## Findings
- No product defects confirmed in this regression cycle.

## Recommendation
- **APPROVE (GO)**
- Rationale: legacy + new feature regression matrix passed with evidence, including explicit DnD transition proof.

## Required Follow-up
1. Optional: keep one manual DnD smoke in release checklist for extra confidence on touch devices.
