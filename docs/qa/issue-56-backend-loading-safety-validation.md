# Issue #56 - Backend Safety for Loading UX Support

## Scope Covered
- Normalized critical action error responses to include actionable metadata for UI recovery while preserving backward compatibility.
- Added top-level error normalization for `doGet` and `doPost` action handlers.
- Kept existing business-rule decisions and success payload contracts unchanged.

## Changes
- Added `failWithCode_(message, code, retryable, details)` helper.
- Updated `fail_` to delegate to normalized error structure.
- Standardized critical-path validation/business-rule failures with explicit `error_code` values in:
  - `createOrder_`
  - `updateOrderDetails_`
  - `updateOrderStatus_`
  - `getOrders_` / `getOrderDetails_`
  - `getBoardDelta_` scope/date validation
  - `archiveBoardDay_` / `unarchiveBoardDay_`

## Backward Compatibility
- Preserved `status: 'error'` and `message` fields expected by existing frontend.
- New fields are additive (`error_code`, `retryable`, optional `details`).

## Verification
- Syntax check passed by copying Apps Script source to `.js` and running:
  - `node --check <temp>.js` => `JS_OK`

## Outcome
- UI loading recovery can now rely on consistent error metadata without breaking legacy message-based handling.
