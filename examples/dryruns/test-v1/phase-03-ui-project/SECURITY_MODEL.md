# SECURITY MODEL

## 1. Threat Model
1. **P2: Cross-Site Scripting (XSS)** - Mitigated by React's default escaping.
2. **P2: Authentication Token Leakage** - Mitigated by securely storing JWTs in memory or HttpOnly cookies, not LocalStorage.

## 2. Security Gates
- Gate A (Design): Approved. UI focus.
- Gate B (Review): Checked for raw HTML overrides.
