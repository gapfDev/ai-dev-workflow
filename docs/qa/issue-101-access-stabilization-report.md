# Issue 101 - Access & Deploy Stabilization Closeout

Date: 2026-02-18

## Summary
This closeout documents the stabilization work executed in production for Apps Script access, spreadsheet binding, and runtime fetch reliability.

## Problems Observed
- External users saw Google Drive "unable to open file" gate when using web app URL.
- Runtime failed with spreadsheet permission errors on writes.
- Legacy spreadsheet had schema drift (missing headers/sheets).
- Frontend occasionally showed "Failed to fetch" due to API base/deployment mismatch.

## Implemented Mitigations
- Added permission diagnostics endpoint: `adminPermissionReport`.
- Added write-access probing and core schema drift checks in diagnostics.
- Hardened spreadsheet resolution and error messages around configured/internal IDs.
- Rebound active data source to spreadsheet: `1yp45Ov-qG1zSfHDX1VNx-_X0t_qdma5Zkn9OQR5gPiE`.
- Hardened frontend API base logic to default to current `/exec` URL.
- Updated deployment/readme references continuously through @59..@63.

## Verification
- Active deployments promoted to version `@63`.
- Smoke tests were successful after rebinding to the new spreadsheet.
- Team access issue was resolved when collaborator permissions were added to both Apps Script project and Spreadsheet.

## Final Status
- GO for controlled team use (restricted sharing with explicit collaborator list).
- No backend/API external contract changes required beyond diagnostic additions.
