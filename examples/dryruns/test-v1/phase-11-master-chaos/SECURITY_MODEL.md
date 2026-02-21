# SECURITY_MODEL.md
# NexaCore Platform — Threat Model & Security Architecture

> **Workflow Step:** 2 / 7 (Security Gate A)  
> **Role:** Security Agent  
> **Compliance Framework:** HIPAA (primary), OWASP LLM Top 10 (for AI features)  
> **Date:** 2026-02-21

---

## Attack Surface Map

```
┌──────────────────────────────────────────────────────────────────┐
│                    TRUST BOUNDARY MAP                            │
│                                                                  │
│  EXTERNAL ZONE (Untrusted)                                       │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  Doctor Mobile App  │  Admin Web Browser │  Admissions │      │
│  │  (iOS/Android)      │  (HTTPS)           │  Web (HTTPS)│      │
│  └──────────┬──────────┴──────────┬──────────┴──────┬───┘      │
│             │ HTTPS/WSS           │ HTTPS/WSS        │ HTTPS    │
│  ──────────────────────── TRUST BOUNDARY ────────────────────── │
│  INTERNAL ZONE (Controlled)                                      │
│  ┌──────────▼──────────────────────────────────────────────┐    │
│  │  API Gateway (Kong) — JWT Validation, Rate Limit, CORS  │    │
│  └──────────────────────┬───────────────────────────────────┘   │
│                         │ Internal mTLS                          │
│  ┌──────────────────────▼───────────────────────────────────┐   │
│  │  Alert Service │ Patient Service │ Intake/OCR │ Audit Svc │   │
│  └──────────────────────────────────────────────────────────┘   │
│                         │                                        │
│  ┌──────────────────────▼───────────────────────────────────┐   │
│  │  PostgreSQL (encrypted) │ Redis │ S3 (encrypted)         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  EXTERNAL PARTNERS (Third-party SaaS)                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Auth0 (HIPAA BAA req.) │ Twilio (HIPAA BAA req.)       │    │
│  │  Square (read-only)     │ Google Document AI (BAA req.) │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

---

## Sensitive Data Flow Inventory

| Data Element | Classification | Storage | In Transit | Risk |
|-------------|----------------|---------|------------|------|
| Patient Full Name | PHI | PostgreSQL — column-level AES-256 | TLS 1.3 only | P0 |
| SSN | PHI | SHA-256 hash only (never stored plaintext) | Never transmitted | P0 |
| Diagnoses / Prescriptions | PHI | PostgreSQL encrypted | TLS 1.3 only | P0 |
| Credit Card # (accidental in forms) | PCI-adjacent | NEVER stored — scrubbed before write | N/A | P0 |
| Doctor Phone (for SMS alerts) | PII | PostgreSQL — column-level AES-256 | TLS 1.3 only | P1 |
| Alert reason text | Sensitive (PHI-adjacent) | PostgreSQL plaintext (triage only, not diagnosis) | TLS 1.3 only | P1 |
| Audit Logs | HIPAA-required | PostgreSQL encrypted separately | TLS 1.3 only | P0 |
| Square billing data | Financial | Cached display only, no card data | TLS 1.3 only | P2 |
| OCR raw form | PHI | S3 with SSE-KMS, pointer in DB | TLS 1.3 only | P0 |

---

## Threat Register

### THREAT-001: PHI Exposure via Compromised JWT

- **Attack vector:** Attacker steals JWT, calls `/api/v1/patients/:id`  
- **Severity:** P0  
- **Mitigation:**  
  - Short JWT expiry (15 minutes access token, 7-day refresh via refresh token rotation)  
  - JWT includes `clinic_id` — RLS enforces tenant isolation even with valid JWT  
  - Auth0 anomaly detection + IP-based flagging  
- **Residual risk:** Low after mitigations

---

### THREAT-002: PAN (Credit Card Number) Persisted in Patient Record

- **Attack vector:** Reception writes card number in wrong intake field; OCR parses and stores it  
- **Severity:** P0 (PCI violation + HIPAA breach)  
- **Mitigation:**  
  - **PAN scrubber runs as Step 0 in the OCR pipeline** — before any parsed data touches DB  
  - Pattern: `\b(?:\d[ -]?){13,16}\b` + Luhn algorithm check  
  - Any PAN detected: replaced with `[REDACTED-PAN]`, event logged as `SECURITY_EVENT:PAN_DETECTED`  
  - DB column for raw form is **never** the same as parsed output; only the scrubbed `parsed_json` is persisted  
- **Testing:** CI must include synthetic test forms with valid PANs in wrong fields

---

### THREAT-003: Cross-Tenant Data Leak via RLS Misconfiguration

- **Attack vector:** Clinic A admin queries and accidentally sees Clinic B patient data  
- **Severity:** P0  
- **Mitigation:**  
  - RLS policy unit tests: automated test suite runs CROSS-TENANT queries and asserts zero rows returned  
  - `CORPORATE_ADMIN` role has separate read-only schema, never mixed with write roles  
  - DB migrations requires security review from Security Agent before production deploy  
- **Testing requirement:** Any new table added to schema MUST have accompanying RLS policy test

---

### THREAT-004: Doctor Alert Missed Due to App Offline

- **Attack vector:** WiFi at clinic fails; doctor doesn't get push notification; patient deteriorates  
- **Severity:** P1  
- **Mitigation:**  
  - Twilio SMS sent in parallel with FCM push (not as fallback — both always sent)  
  - Alert status machine: `PENDING → DELIVERED → ACKNOWLEDGED`. If not acknowledged in N minutes → `ESCALATED`  
  - WatermelonDB local queue ensures any queued operations survive app restart  
- **⚠️ Open:** Escalation timeout not yet defined by client

---

### THREAT-005: HIPAA Audit Log Not Immutable

- **Attack vector:** Compromised admin deletes or modifies audit records to cover breach  
- **Severity:** P0  
- **Mitigation:**  
  - PostgreSQL rules: `NO UPDATE`, `NO DELETE` on `audit_logs` table  
  - Periodic export to AWS CloudWatch Logs (append-only, KMS encrypted)  
  - Separate `AUDIT_READER` DB role with SELECT-only on `audit_logs`  
  - No application service has DELETE permission on this table

---

### THREAT-006: Missing HIPAA BAA with Third-Party Vendors

- **Attack vector:** Auth0, Twilio, or Google Document AI processes PHI without signed BAA → HIPAA violation  
- **Severity:** P1  
- **Mitigation:**  
  - Auth0 Business/Enterprise plan → BAA available  
  - Twilio → BAA available on paid plans  
  - Google Document AI → BAA via Google Cloud Healthcare API tier  
  - **HARD BLOCKER:** No production data processed via these services until BAAs are signed and documented  
- **Residual risk:** None if BAAs signed before launch

---

### THREAT-007: Injection via OCR-Parsed Form Content

- **Attack vector:** Maliciously crafted handwritten form tricks OCR to output SQL/script injection payload  
- **Severity:** P1 (OWASP Prompt Injection adjacent for LLM-based OCR)  
- **Mitigation:**  
  - All OCR output treated as UNTRUSTED until validated  
  - Schema validation (Zod/Pydantic) applied to every parsed field before DB write  
  - SQLite parameterized queries only; no raw string concatenation in DB layer  
  - Output from Google Doc AI is JSON-parsed, not evaluated

---

### THREAT-008: Unauthorized Multi-Clinic Data Access

- **Attack vector:** Corporate Admin account compromised; attacker pivots to all 50 clinics' data  
- **Severity:** P1  
- **Mitigation:**  
  - MFA mandatory for `CORPORATE_ADMIN` role (enforced at Auth0 level)  
  - Corporate Admin can read aggregate stats only — patient-level details still require per-clinic context switch  
  - All corporate admin actions generate audit log entries

---

## Security Controls Summary

| Control | Implementation | Status |
|---------|---------------|--------|
| Encryption at rest | PostgreSQL pgcrypto (column-level PHI), S3 SSE-KMS | Required |
| Encryption in transit | TLS 1.3 mandatory for all external connections | Required |
| Authentication | Auth0 JWT, short expiry, refresh rotation | Required |
| Authorization | RBAC + PostgreSQL RLS | Required |
| MFA | Mandatory for ADMIN, CORPORATE_ADMIN | Required |
| PAN Scrubbing | Pre-storage pipeline step | Required |
| Audit Logging | Immutable append-only table + CloudWatch export | Required |
| HIPAA BAA | Auth0, Twilio, Google Cloud, AWS | BLOCKING — must sign before launch |
| Penetration Testing | Scheduled before launch | ⚠️ Not yet planned |

---

## ✅ Security Gate A Checklist

- [x] Attack surface documented
- [x] Sensitive data paths identified (all PHI fields mapped)
- [x] PAN scrubbing as P0 control
- [x] Mitigations defined for all P0 and P1 risks
- [x] HIPAA §164.312(b) audit control addressed
- [x] Third-party HIPAA BAA requirement documented as hard blocker
- [x] OWASP injection risk addressed for AI/OCR pipeline

**Security Gate A: ✅ PASS — Proceed to Step 3**

---

## ⚠️ Open Security Items

| ID | Item | Priority |
|----|------|----------|
| SEC-001 | Alert escalation timeout not defined → cannot build THREAT-004 mitigation completely | P1 |
| SEC-002 | Penetration test not yet scheduled | P2 |
| SEC-003 | HIPAA BAA contracts not yet signed (blocking for production) | P0 (production blocker) |
