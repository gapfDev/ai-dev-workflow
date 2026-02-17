# Issue #53 - Loading on P0 Transactional Actions (Validation Notes)

## Scope Covered
- Save order action (`saveOrder`) uses threshold-based loading and submit lock.
- Status transitions (`requestStatusTransition`) now reject repeated submissions while in-flight.
- Archive/unarchive day actions now use in-flight loading + button lock.
- Day switch (`setSelectedBoardDay`) now enforces in-flight lock and loading wrapper until refresh completes.

## Evidence
- Updated file: `apps-script/Index.html`
- Added operation configs:
  - `switchBoardDay`
  - `archiveBoardDay`
  - `unarchiveBoardDay`
- Added in-flight guard helper: `operationInFlight(name)`.

## Verification
- Syntax check passed for inline script extraction:
  - `node --check` => `JS_OK`
- Business-rule behavior unchanged:
  - Existing confirm/prompt flows for archive/unarchive preserved.
  - Existing status transition rules (Delivered lock, Baked->Delivered gate, reactivate confirm) preserved.

## Outcome
- P0 actions now provide deterministic in-flight UX and double-submit prevention without API contract changes.
