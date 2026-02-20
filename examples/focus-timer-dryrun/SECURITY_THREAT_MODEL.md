# SECURITY THREAT MODEL

**Date:** 2026-02-19
**Product:** Focus Timer

## 1. Attack Surface
- **LocalStorage Data:** The primary data store for user tasks and timer history.
- **Client-Side Scripting:** The app logic sits entirely in the client's browser.

## 2. Sensitive Data Paths
- Task List names (could contain user PII).
- Handled exclusively via LocalStorage; no network transmission.

## 3. Threat Assessment & Mitigations

### P1: Cross-Site Scripting (XSS)
- **Risk:** Malicious user input in the "Add Task" field could execute scripts if rendered without sanitization.
- **Mitigation:** Use `textContent` instead of `innerHTML` when rendering task names in the DOM.

### P2: Data Loss
- **Risk:** User clears browser data or uses incognito mode, losing all tasks.
- **Mitigation:** Clearly inform the user that data is device-local. Suggest periodic JSON export if the feature is added later.

## 4. Security Gate A Status
✅ XSS mitigated by strict DOM manipulation rules.
✅ No sensitive data transmitted over network.
✅ Ready for implementation backlog.
