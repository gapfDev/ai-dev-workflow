# BACKLOG.md
# NexaCore Platform — Development Backlog

> **Workflow Step:** 3 / 7  
> **Source of truth** for all development tickets (synced manually to client Jira)  
> **Tracking system:** BACKLOG.md (Hybrid — agent reads/writes, client syncs to Jira)  
> **Date:** 2026-02-21

---

## Epic Overview

| Epic | Description | Priority |
|------|-------------|----------|
| EPIC-01 | Shared Infrastructure (DB, Auth, DevOps) | Must |
| EPIC-02 | Real-Time Alert System | Must |
| EPIC-03 | Doctor Mobile App | Must |
| EPIC-04 | AI Intake Form Reader | Must |
| EPIC-05 | Admin Web Dashboard | Should |
| EPIC-06 | HIPAA Audit Log | Must |
| EPIC-07 | Billing Display (Square Integration) | Should |
| EPIC-08 | Multi-Clinic Corporate View | Could |
| EPIC-09 | Appointment Scheduling | Could |

---

## EPIC-01: Shared Infrastructure

### [EPIC-01-001] Database Schema & Migrations

**As a** Developer Agent  
**I want** a fully migrated PostgreSQL database with RLS policies  
**So that** all services can start development with a stable, secure data foundation

#### Acceptance Criteria
- [ ] All tables defined in SCHEMA.md exist after migration
- [ ] RLS policies on `patients`, `users`, `alerts` tables are active
- [ ] Cross-tenant query test: Clinic A query returns zero Clinic B rows
- [ ] `audit_logs` table is append-only (no UPDATE/DELETE rules verified)
- [ ] pgcrypto extension enabled; PHI columns encrypted

#### Definition of Done (DoD)
- [ ] Code implemented
- [ ] Migration tested locally and in CI
- [ ] RLS automated tests pass
- [ ] Documentation updated

#### Technical Notes
<!-- Use Prisma for schema definition. Raw SQL for RLS policies (Prisma doesn't support RLS natively). Seed script for local dev with synthetic non-PHI data. -->

#### Estimation
- Complexity: L
- Dependencies: None

---

### [EPIC-01-002] Auth0 JWT Middleware Shared Package

**As a** Developer Agent  
**I want** a shared authentication middleware package  
**So that** all NestJS services can validate JWTs with consistent RBAC and clinic isolation

#### Acceptance Criteria
- [ ] JWT validation rejects expired or malformed tokens
- [ ] `clinic_id`, `user_id`, `role` extracted from JWT claims
- [ ] `app.current_clinic_id` PostgreSQL session variable set per request
- [ ] Unauthorized requests return 401
- [ ] Forbidden role/clinic access returns 403

#### Definition of Done (DoD)
- [ ] Code implemented
- [ ] Unit tests: valid JWT, expired JWT, wrong clinic_id, missing role
- [ ] Integrated into at least one service as proof

#### Estimation
- Complexity: M
- Dependencies: EPIC-01-001

---

### [EPIC-01-003] Docker Compose Local Dev Environment

**As a** Developer Agent  
**I want** a local Docker Compose stack  
**So that** all 4 agents can run the full system locally for development and testing

#### Acceptance Criteria
- [ ] `docker compose up` starts PostgreSQL, Redis, all services
- [ ] Seed script populates test clinics, users, synthetic patients (no real PHI)
- [ ] Hot-reload enabled for NestJS services
- [ ] README documents setup steps

#### Estimation
- Complexity: M
- Dependencies: EPIC-01-001

---

### [EPIC-01-004] GitHub Actions CI Pipeline

**As a** Developer Agent  
**I want** a CI pipeline that runs tests on every PR  
**So that** broken code cannot be merged to main

#### Acceptance Criteria
- [ ] On PR: lint (ESLint, Prettier), type check, unit tests, integration tests run
- [ ] RLS policy tests included in CI
- [ ] Build artifacts produced (Docker images)
- [ ] Failing CI blocks merge

#### Estimation
- Complexity: M
- Dependencies: EPIC-01-003

---

## EPIC-02: Real-Time Alert System

### [EPIC-02-001] Alert Creation API

**As an** Admissions Staff  
**I want** to trigger an urgency alert via API when an emergency patient is registered  
**So that** the system notifies the on-duty doctor immediately

#### Acceptance Criteria
- [ ] POST /api/v1/alerts creates alert record in DB
- [ ] Alert includes urgency level, room, reason, assigned doctor
- [ ] Alert status set to PENDING on creation
- [ ] Creates audit log entry
- [ ] Returns 201 with alert ID

#### Definition of Done (DoD)
- [ ] Code implemented with TDD (Red-Green-Refactor)
- [ ] Unit tests for request validation
- [ ] Integration test: alert created → DB record confirmed
- [ ] No PHI in service logs

#### Estimation
- Complexity: M
- Dependencies: EPIC-01-001, EPIC-01-002

---

### [EPIC-02-002] FCM Push Notification Dispatch

**As a** Doctor  
**I want** to receive a push notification on my phone when an urgent patient arrives  
**So that** I can respond immediately without waiting for a phone call

#### Acceptance Criteria
- [ ] FCM token stored per user (encrypted)
- [ ] Alert dispatch sends FCM push within 10 seconds of alert creation
- [ ] Push payload: patient context (no full PHI — only name + room + urgency level)
- [ ] Failed FCM delivery logged for retry

#### Estimation
- Complexity: M
- Dependencies: EPIC-02-001

---

### [EPIC-02-003] Twilio SMS Dispatch (Redundant Channel)

**As a** Doctor  
**I want** to receive an SMS alert when a critical patient arrives  
**So that** I am notified even if I'm not looking at my phone or the app

#### Acceptance Criteria
- [ ] SMS sent in parallel with FCM push (not as fallback — both always sent)
- [ ] SMS sent within 30 seconds of alert creation
- [ ] Twilio delivery status tracked
- [ ] HIPAA-compliant SMS content (no SSN, diagnosis — only: "Urgent patient: [Room X]. Check app.")

#### Estimation
- Complexity: S
- Dependencies: EPIC-02-001

---

### [EPIC-02-004] Alert Status Machine & Escalation

**As a** Manager  
**I want** alerts to automatically escalate if the doctor doesn't acknowledge in N minutes  
**So that** no urgent patient goes unattended due to an unreachable doctor

#### Acceptance Criteria
- [ ] Alert transitions: PENDING → DELIVERED → ACKNOWLEDGED or ESCALATED
- [ ] If not ACKNOWLEDGED within configurable timeout → ESCALATED to backup doctor
- [ ] ESCALATED alert triggers new FCM + SMS to backup
- [ ] Escalation event logged in audit log
- [ ] Config: escalation timeout (⚠️ default assumed 10 minutes pending client confirmation)

#### Estimation
- Complexity: L
- Dependencies: EPIC-02-002, EPIC-02-003

---

## EPIC-03: Doctor Mobile App

### [EPIC-03-001] Doctor App — Alert List Screen (Offline-First)

**As a** Doctor  
**I want** to see a list of active alerts for my current shift on my phone  
**So that** I always know which patients need my attention

#### Acceptance Criteria
- [ ] Displays alerts sorted by urgency level (CRITICAL > URGENT > MODERATE)
- [ ] Data loads from local WatermelonDB when offline
- [ ] Syncs with server when connection restored
- [ ] Push notification taps navigate to alert detail
- [ ] Displays "Offline" indicator when no connection

#### Estimation
- Complexity: L
- Dependencies: EPIC-02-001, EPIC-01-002

---

### [EPIC-03-002] Doctor App — Alert Detail Screen + Acknowledge

**As a** Doctor  
**I want** to see the full detail of a patient alert and mark it as attended  
**So that** the system and my colleagues know I am handling the case

#### Acceptance Criteria
- [ ] Shows: patient name, room, urgency level, reason, time of arrival
- [ ] "Mark as Attended" button → transitions alert to ACKNOWLEDGED
- [ ] Action queued locally if offline, synced on reconnect
- [ ] Confirmation recorded in audit log

#### Estimation
- Complexity: M
- Dependencies: EPIC-03-001

---

## EPIC-04: AI Intake Form Reader

### [EPIC-04-001] OCR Service — Form Upload & Processing Pipeline

**As an** Admissions Staff Member  
**I want** to upload a patient intake form (image or PDF) and have it parsed automatically  
**So that** I don't have to manually transcribe handwritten forms

#### Acceptance Criteria
- [ ] POST /api/v1/intake/upload accepts image/PDF up to 20MB
- [ ] Routed to async BullMQ queue for processing
- [ ] Google Document AI called for OCR
- [ ] Fallback to Tesseract if Document AI unavailable
- [ ] OCR confidence score stored

#### Estimation
- Complexity: L
- Dependencies: EPIC-01-001, EPIC-01-003

---

### [EPIC-04-002] PAN Scrubber — Credit Card Detection & Redaction

**As a** Security Officer  
**I want** all parsed intake form data to have credit card numbers automatically detected and redacted  
**So that** PCI-adjacent data never reaches our database

#### Acceptance Criteria
- [ ] PAN detection runs BEFORE any parsed data is written to DB
- [ ] Pattern: 13-16 digit sequences validated with Luhn algorithm
- [ ] Detected PANs replaced with `[REDACTED-PAN]` in stored output
- [ ] Security event logged: SECURITY_EVENT:PAN_DETECTED
- [ ] CI includes form images with valid PANs in wrong fields (test vectors)
- [ ] Zero PANs survive to DB in any CI test run

#### Estimation
- Complexity: M
- Dependencies: EPIC-04-001

---

### [EPIC-04-003] Emergency Detection from Parsed Form

**As a** System  
**I want** to automatically detect emergency conditions from parsed intake form data  
**So that** alerts are triggered without requiring manual triage

#### Acceptance Criteria
- [ ] Emergency score (0.00–1.00) computed for each form
- [ ] Score > 0.75 → `is_emergency = TRUE` → alert creation triggered automatically
- [ ] Low OCR confidence (< 0.60) → `requires_review = TRUE` → human review queue
- [ ] Emergency detection model tested against labeled test set with ≥ 90% recall

#### Estimation
- Complexity: XL
- Dependencies: EPIC-04-002

---

## EPIC-05: Admin Web Dashboard

### [EPIC-05-001] Patient Flow View (Live Kanban)

**As an** Admin  
**I want** to see the real-time status of all patients (Waiting / Being Attended / Discharged)  
**So that** I can manage clinic capacity and identify bottlenecks

#### Acceptance Criteria
- [ ] Three-column kanban: Waiting, Being Attended, Discharged Today
- [ ] Patient cards show: name, ID, urgency badge, arrival time
- [ ] Real-time updates via Socket.io (no page refresh required)
- [ ] Design matches approved mockup (deep blue + white palette)

#### Estimation
- Complexity: L
- Dependencies: EPIC-01-001, EPIC-02-001

---

### [EPIC-05-002] Billing Status Display (Square Integration)

**As an** Admin  
**I want** to see the billing status for each patient from Square  
**So that** I can track revenue and follow up on pending payments without leaving the dashboard

#### Acceptance Criteria
- [ ] Shows per-patient billing status: Pending / Paid / Rejected
- [ ] Data pulled from `billing_display_cache` (refreshed every 5 minutes from Square)
- [ ] Aggregate stats displayed: total count by status
- [ ] No Square API credentials exposed to frontend

#### Estimation
- Complexity: M
- Dependencies: EPIC-05-001

---

## EPIC-06: HIPAA Audit Log

### [EPIC-06-001] Audit Log Service — Append-Only Writer

**As a** Compliance Officer  
**I want** every access to patient records to be logged immutably  
**So that** we meet HIPAA §164.312(b) audit control requirements

#### Acceptance Criteria
- [ ] Audit event written for: every patient read, write, alert create, alert acknowledge
- [ ] Log includes: actor_user_id, role, action, target_id, IP, timestamp
- [ ] No UPDATE or DELETE operations possible on audit_logs (rules enforced at DB level)
- [ ] Periodic export to CloudWatch Logs with KMS encryption
- [ ] Admin UI shows audit log query results (filtered by date range, user, action type)

#### Estimation
- Complexity: L
- Dependencies: EPIC-01-001

---

## EPIC-07: Billing Display (Square Integration)

### [EPIC-07-001] Square API Sync Service

**As a** System  
**I want** to automatically refresh billing status from Square every 5 minutes  
**So that** the admin dashboard always shows current payment status

#### Acceptance Criteria
- [ ] BullMQ scheduled job: runs every 5 minutes per active clinic
- [ ] Calls Square Payments API (read-only scope only)
- [ ] Updates `billing_display_cache` table
- [ ] Handles Square API rate limits gracefully
- [ ] No payment processing logic — display only

#### Estimation
- Complexity: M
- Dependencies: EPIC-01-001

---

## Won't Have (This Release)

| Feature | Reason |
|---------|--------|
| Appointment Scheduling (EPIC-09) | Out of MVP scope; post-launch |
| Multi-Clinic Corporate Full Detail View (EPIC-08 drill-down to patient level) | Aggregate only in MVP |
| Telemedicine / Video | Not requested |
| Patient-facing mobile app | Not requested |
