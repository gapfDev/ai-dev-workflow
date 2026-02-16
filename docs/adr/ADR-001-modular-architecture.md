# ADR-001: Modular Architecture Baseline

## Status
Accepted

## Date
2026-02-16

## Context
The MVP operates in Google Apps Script with a single-page UI and a Sheet-backed datastore. The project needs safe parallel work between UI, backend, data, and QA agents.

## Decision
Adopt a modular boundary model:
- UI concerns isolated by responsibility (state, API, rendering, events).
- Backend organized by route handling + rule orchestration + sheet access helpers.
- Operational and release knowledge captured as versioned runbooks.

## Consequences
### Positive
- Lower regression risk during concurrent work.
- Faster onboarding for new contributors.
- Clearer validation gates for deploy.

### Trade-offs
- Slightly more documentation overhead.
- Requires discipline to avoid shortcut logic in handlers.

## Non-goals
- Full framework migration.
- Replacing Google Sheets datastore in this milestone.
