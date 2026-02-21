# SECURITY_BACKLOG.md
# NexaCore Platform — Security-Specific Backlog

> **Workflow Step:** 3 / 7  
> **Input:** SECURITY_MODEL.md (Gate A findings)  
> **Skill:** security-gate (Phase 1.5 — Backlog Conversion)  
> **Date:** 2026-02-21

---

## Security Ticket Conventions

- **SEC-P0:** Hard blockers — must be resolved before any environment promotion
- **SEC-P1:** Must be resolved before production launch
- **SEC-P2:** Must be resolved before launch with owner and due date
- **SEC-P3:** Track in backlog; address in hardening sprint

---

## 🔴 P0 Security Tickets (Hard Blockers)

### [SEC-001] PAN Scrubber — Pre-Storage Credit Card Redaction Pipeline

**Threat:** THREAT-002 — PAN persisted in patient record  
**Priority:** P0 — Hard Blocker

**As a** Security Engineer  
**I want** all OCR-parsed intake data to be scanned for credit card numbers and redacted BEFORE any DB write  
**So that** no PCI-adjacent data ever reaches our database or logs

#### Acceptance Criteria
- [ ] PAN detection: regex `\b(?:\d[ -]?){13,16}\b` + Luhn validation
- [ ] Any PAN-like sequence → replaced with `[REDACTED-PAN]` before DB write
- [ ] Security event logged: `SECURITY_EVENT:PAN_DETECTED` with form ID only (no PAN value in log)
- [ ] CI includes ≥ 5 synthetic forms with valid PANs in wrong fields
- [ ] Zero PANs survive to DB across all test runs (verified by automated test)

#### Definition of Done
- [ ] Scrubber implemented in OCR pipeline (before Pydantic validation)
- [ ] Tests pass including Luhn edge cases
- [ ] Security event audit records present in logs

**Owner:** Agent C (OCR Service)  
**Due:** Sprint 1 — cannot proceed to integration without this

---

### [SEC-002] HIPAA Audit Log — Append-Only Enforcement

**Threat:** THREAT-005 — HIPAA audit log tampering  
**Priority:** P0 — Hard Blocker

**As a** Compliance Officer  
**I want** the audit_logs table to be physically immutable  
**So that** HIPAA §164.312(b) requirements are met

#### Acceptance Criteria
- [ ] PostgreSQL rule: `NO UPDATE`, `NO DELETE` on `audit_logs` table
- [ ] DB test: attempt UPDATE → returns 0 rows affected (no error, just silently blocked)
- [ ] DB test: attempt DELETE → returns 0 rows affected
- [ ] Separate `AUDIT_READER` role with SELECT-only permission on `audit_logs`
- [ ] No application service granted DELETE/UPDATE on this table

**Owner:** Agent D (Shared Infra)  
**Due:** Sprint 1 — before any patient data flows through system

---

### [SEC-003] HIPAA BAA — Third-Party Vendor Contracts (Production Blocker)

**Threat:** THREAT-006 — PHI processed without HIPAA BAA  
**Priority:** P0 — Production Hard Stop

**As a** Platform Owner  
**I want** Business Associate Agreements signed with all PHI-handling vendors  
**So that** NexaCore is HIPAA compliant and not legally exposed

#### Acceptance Criteria
- [ ] Auth0 HIPAA BAA signed and documented
- [ ] Twilio HIPAA BAA signed and documented
- [ ] Google Cloud (Document AI) HIPAA BAA signed and documented
- [ ] AWS HIPAA BAA enabled on account
- [ ] Evidence file: `.agent/compliance/BAA_STATUS.md` with vendor, signed date, expiry

#### Definition of Done
- [ ] All BAAs documented in compliance folder
- [ ] Production deploy pipeline blocked if BAA_STATUS.md not present or not fully signed

**Owner:** Human (Client CTO) — platform owner must sign contracts  
**Due:** Before any test with real patient data; must be in place before production launch

---

### [SEC-004] Cross-Tenant RLS Automated Test Suite

**Threat:** THREAT-003 — RLS misconfiguration leaks clinic data  
**Priority:** P0 — Hard Blocker

**As a** Security Engineer  
**I want** automated tests that verify no cross-clinic data leaks via RLS  
**So that** any future schema change or migration cannot accidentally remove isolation

#### Acceptance Criteria
- [ ] Test: Clinic A user queries `patients` → zero Clinic B rows returned
- [ ] Test: Clinic A user queries `alerts` → zero Clinic B rows returned
- [ ] Test: `CORPORATE_ADMIN` can query both clinics (expected)
- [ ] Tests run in CI on every PR
- [ ] Any new table added to schema triggers test coverage requirement

**Owner:** Agent D (Shared Infra)  
**Due:** Sprint 1 — with database migration

---

## 🟠 P1 Security Tickets

### [SEC-005] MFA Enforcement for ADMIN and CORPORATE_ADMIN Roles

**Threat:** THREAT-008 — Corporate Admin account compromise  
**Priority:** P1

**As a** Security Officer  
**I want** MFA enforced for all Admin and Corporate Admin accounts  
**So that** a stolen password alone cannot expose all 50 clinics' data

#### Acceptance Criteria
- [ ] Auth0 MFA policy applied to roles: ADMIN, CORPORATE_ADMIN
- [ ] DOCTOR role: MFA optional (balance with urgency alert response speed)
- [ ] Login without MFA for ADMIN roles → rejected at Auth0 level (not app level)

**Owner:** Agent D  
**Due:** Sprint 2  
**Risk acceptance:** None — P1 must be fixed

---

### [SEC-006] JWT Short Expiry + Refresh Token Rotation

**Threat:** THREAT-001 — Compromised JWT  
**Priority:** P1

**As a** Security Engineer  
**I want** access tokens to expire in 15 minutes with rotating refresh tokens  
**So that** a stolen token has a minimal exploitation window

#### Acceptance Criteria
- [ ] Access token TTL: 15 minutes
- [ ] Refresh token TTL: 7 days, rotating (new token issued on each refresh)
- [ ] Refresh token reuse → token family revoked (detect token theft)
- [ ] Auth0 configured with these settings; documented in TECH_STRATEGY

**Owner:** Agent D  
**Due:** Sprint 1

---

### [SEC-007] Input Validation + Injection Protection for OCR Output

**Threat:** THREAT-007 — Injection via crafted form content  
**Priority:** P1

**As a** Developer Agent  
**I want** all OCR-parsed output to be treated as untrusted and validated before DB write  
**So that** a maliciously crafted form cannot inject data or break the system

#### Acceptance Criteria
- [ ] Pydantic schema validation on all OCR output fields before DB write
- [ ] No raw string concatenation in DB queries (parameterized queries only)
- [ ] Schema: maximum field lengths enforced (patient_name < 200 chars, etc.)
- [ ] Test: malformed JSON from mock OCR → rejected with 422

**Owner:** Agent C  
**Due:** Sprint 2

---

## 🟡 P2 Security Tickets (Risk Accepted with Owner + Due Date)

### [SEC-008] Penetration Test — Schedule Before Launch

**Threat:** General attack surface  
**Priority:** P2

**Risk Acceptance:**  
- Owner: CTO (client)  
- Due: 2 weeks before production launch  
- Rationale: Cannot execute during development phase; scheduled for pre-launch

#### Acceptance Criteria
- [ ] External pen test firm engaged
- [ ] Scope: API endpoints, multi-tenant isolation, OCR service
- [ ] Critical findings resolved before launch

---

## 🟢 P3 Security Tickets (Hardening Backlog)

### [SEC-009] Column-Level Encryption Audit

All PHI columns must use pgcrypto. Ensure coverage is complete.  
**Owner:** Agent D | **Target Sprint:** Sprint 3

### [SEC-010] Rate Limiting at API Gateway

Protect alert and patient endpoints from brute force.  
**Owner:** Agent D | **Target Sprint:** Sprint 2

### [SEC-011] Dependency Vulnerability Scan in CI

Add `npm audit` + `pip-audit` to CI pipeline.  
**Owner:** Agent D | **Target Sprint:** Sprint 1 (add to CI)

---

## Summary

| Priority | Count | Status |
|----------|-------|--------|
| P0 | 4 | All tickets open — must complete Sprint 1 |
| P1 | 3 | Must complete before launch |
| P2 | 1 | Risk accepted with owner + date |
| P3 | 3 | Hardening backlog |
