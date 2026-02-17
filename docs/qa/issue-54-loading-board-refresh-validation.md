# Issue #54 - Loading on Board Refresh Flows (Validation Notes)

## Scope Covered
- Board-day fetch path (`refreshBoardDays`) now uses loading wrapper with board section semantics.
- Board entry now runs deterministic sync flow via `runBoardEntrySync(true)`.
- Manual board refresh button now triggers the same deterministic board sync flow.
- Existing polling scheduler behavior remains unchanged (`restartPolling`, `pollOnceAndSchedule`).

## Evidence
- Updated file: `apps-script/Index.html`
- Added loading operation configs:
  - `refreshBoardDays`
  - `boardEntrySync`
- Added new flow helper:
  - `runBoardEntrySync(forceDays = true)`

## Verification
- Syntax check passed for inline script extraction:
  - `node --check` => `JS_OK`
- Board refresh actions share one consistent in-flight path (days + orders), reducing stale/uncertain state transitions.

## Outcome
- Board refresh and board-entry loading behavior is now explicit and deterministic while keeping polling flow intact.
