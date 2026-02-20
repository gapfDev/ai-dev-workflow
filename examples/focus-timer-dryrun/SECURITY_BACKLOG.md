# SECURITY BACKLOG: Focus Timer App

**Date:** 2026-02-19

## Security Tickets

- **#SEC-1 [Security] Enforce Content Security Policy (CSP)**
  - **DoD:** Meta tag or headers configured to prevent inline scripts or untrusted external scripts.

- **#SEC-2 [Security] Sanitize Task Input**
  - **DoD:** Any user-provided task name is properly escaped before being rendered. Use `document.createTextNode` instead of innerHTML.

- **#SEC-3 [Privacy] LocalStorage Warning**
  - **DoD:** A small info icon alerts users that data is local and clearing cache will wipe tasks.
