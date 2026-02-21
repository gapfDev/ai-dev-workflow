# SECURITY MODEL

## 1. Threat Model (OWASP)
1. **P0: Cross-Tenant Data Leakage** - Mitigated via strict Row-Level Security (RLS) in PostgreSQL.
2. **P1: Stripe Webhook Spoofing** - Mitigated via webhook signature checking.
3. **P2: SSO Misconfiguration** - Mitigated via Firebase Auth strict redirect URI matching.

## 2. Security Gates
- Gate A (Design): Tenant isolation design approved.
- Gate B (Review): P0/P1 issues must be 0 before merge.
- Gate C (Release): Final sign-off required.
