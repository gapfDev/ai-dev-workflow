# IMPLEMENTATION_PLAN.md
# NexaCore Platform — Sprint Implementation Plan

> **Workflow Step:** 4 / 7  
> **Role:** PM Agent  
> **Input:** BACKLOG.md + SECURITY_BACKLOG.md  
> **Prioritization:** MoSCoW  
> **Date:** 2026-02-21

---

## 🗣️ Gate 4 Interview Log

🤖 **Manager:** Based on the backlog, I've organized 3 sprints over 3 months. The MVP (doctor alert + mobile app) will be working by end of Sprint 1. Do you confirm this priority?

👤 **Humano (Auto-simulado):** Sí, el MVP es la alerta. Si algo tarda más de 3 días seguidos sin avance visible, me pongo nervioso y pregunto qué está pasando.

🤖 **Manager:** Documented. I'll add a daily progress signal to the workflow — if no visible progress for 3+ days, a status report is automatically generated for you.

---

## Timeline Overview

| Sprint | Duration | Focus | Agents |
|--------|----------|-------|--------|
| Sprint 1 | Weeks 1–4 | Infra foundation + Alert MVP + OCR core + HIPAA baseline | A, B, C, D (parallel) |
| Sprint 2 | Weeks 5–8 | Admin Dashboard + Billing display + Mobile polish + Security hardening | A, B, C, D |
| Sprint 3 | Weeks 9–12 | Corporate view + Scheduling MVP + Performance + Pre-launch QA | A, B |

---

## Agent Assignments

| Agent | Sprint 1 Focus | Sprint 2 Focus | Sprint 3 Focus |
|-------|---------------|----------------|----------------|
| **Agent D** | DB, Auth, Docker, CI | Security hardening | Monitoring, launch prep |
| **Agent A** | Alert Service, FCM, Twilio | Mobile UI polish | Doctor app E2E tests |
| **Agent B** | Patient Service | Admin Dashboard, Socket.io | Corporate view, scheduling |
| **Agent C** | OCR pipeline, PAN Scrubber | Emergency detection ML | Intake UX refinement |

---

## Sprint 1 — Foundation + Alert MVP (Weeks 1–4)

### Must Have

| Ticket | Title | Agent | Complexity | Security Req |
|--------|-------|-------|-----------|-------------|
| EPIC-01-001 | DB Schema & Migrations + RLS | D | L | SEC-002, SEC-004 |
| EPIC-01-002 | Auth0 JWT Middleware | D | M | SEC-006 |
| EPIC-01-003 | Docker Compose Dev Environment | D | M | — |
| EPIC-01-004 | GitHub Actions CI Pipeline | D | M | SEC-011 |
| EPIC-02-001 | Alert Creation API | A | M | EPIC-01-001 |
| EPIC-02-002 | FCM Push Notification Dispatch | A | M | — |
| EPIC-02-003 | Twilio SMS Dispatch | A | S | — |
| EPIC-04-001 | OCR Service — Form Upload Pipeline | C | L | — |
| EPIC-04-002 | **PAN Scrubber** | C | M | **SEC-001 (P0 Hard Blocker)** |
| EPIC-06-001 | HIPAA Audit Log Append-Only Writer | D | L | **SEC-002 (P0 Hard Blocker)** |
| SEC-004 | Cross-Tenant RLS Test Suite | D | M | P0 |
| SEC-006 | JWT Short Expiry + Refresh Rotation | D | S | P1 |

**Sprint 1 MVP Gate:**  
✅ When an urgent patient arrives → doctor receives push + SMS within 2 minutes, regardless of WiFi status.

**Sprint 1 Security Gate Hard Stops (must complete in Sprint 1):**
- SEC-001: PAN Scrubber
- SEC-002: Audit Log Append-Only
- SEC-004: RLS Test Suite
- SEC-006: JWT Rotation

---

### Should Have (Sprint 1 stretch goals)

| Ticket | Title | Agent |
|--------|-------|-------|
| EPIC-03-001 | Doctor App — Alert List Screen (basic) | A |
| SEC-005 | MFA for Admin roles | D |

---

## Sprint 2 — Admin Dashboard + Polish (Weeks 5–8)

### Must Have

| Ticket | Title | Agent | Complexity |
|--------|-------|-------|-----------|
| EPIC-02-004 | Alert Escalation + Status Machine | A | L |
| EPIC-03-001 | Doctor App — Alert List (fully offline) | A | L |
| EPIC-03-002 | Doctor App — Alert Detail + Acknowledge | A | M |
| EPIC-04-003 | Emergency Detection ML | C | XL |
| EPIC-05-001 | Admin Dashboard — Patient Flow (Socket.io) | B | L |
| EPIC-05-002 | Admin Dashboard — Billing Display (Square) | B | M |
| EPIC-07-001 | Square API Sync Service | B | M |
| SEC-005 | MFA Enforcement for Admins | D | M |
| SEC-007 | Injection Protection for OCR Output | C | M |
| SEC-010 | Rate Limiting at API Gateway | D | S |

---

### Could Have (Sprint 2 stretch)

| Ticket | Title | Agent |
|--------|-------|-------|
| EPIC-08 | Corporate Multi-Clinic Aggregate View | B |

---

## Sprint 3 — Hardening + Launch (Weeks 9–12)

### Must Have

| Ticket | Title | Agent |
|--------|-------|-------|
| E2E Tests: Detox (mobile) | Full flow: alert → acknowledge | A |
| E2E Tests: Playwright (web) | Patient flow + billing | B |
| Security Pen Test (SEC-008) | Pre-launch external test | Human/CTO |
| SEC-009 | Column Encryption Audit | D |
| Performance Testing | Load: 50 clinics concurrent | D |
| Documentation Cleanup | knowledge-gardener: prune stale docs | D |

---

## MVP Definition (Locked)

> **MVP = Sprint 1 Gate:** Urgent patient arrives → on-duty doctor receives alert on phone within 2 minutes, WiFi or not.

**MVP includes:**
- Alert Creation API
- FCM + Twilio SMS dispatch
- Basic Doctor Alert List + Detail screens (React Native)
- HIPAA Audit Log
- PAN Scrubber (non-negotiable)

**MVP excludes:** Admin Dashboard, emergency auto-detection (manual trigger in MVP), appointment scheduling, billing display, corporate view.

---

## Dependencies Map

```
EPIC-01-001 (DB) ──► EPIC-01-002 (Auth) ──► EPIC-02-001 (Alert API)
                │                                    │
                │                            ┌───────┴──────────┐
                │                       EPIC-02-002         EPIC-02-003
                │                        (FCM Push)         (Twilio SMS)
                │                                    │
                │                            EPIC-02-004 (Escalation)
                │
                └──► EPIC-04-001 (OCR Upload) ──► EPIC-04-002 (PAN Scrubber)
                                                         │
                                                  EPIC-04-003 (Emergency Detection)
```

---

## Progress Monitoring (Client-Requested)

**Per the client's explicit requirement:** If no visible progress for 3+ consecutive days, the Manager Agent MUST auto-generate a `DAILY_STATUS_REPORT.md` and post it to the message board.

Format:
```
date: YYYY-MM-DD
days_without_visible_progress: N
open_blockers: [list]
last_completed_ticket: TICKET-ID
estimated_unblock_date: YYYY-MM-DD
```

---

## ✅ Gate 4 Checklist

- [x] MVP clearly defined
- [x] Sprints are realistic for 4-agent team in 3 months
- [x] Dependencies between tickets mapped
- [x] P0 security tickets integrated into Sprint 1
- [x] Client progress monitoring concern addressed
- [x] Tracking system: BACKLOG.md (source of truth, manual sync to client Jira)

**Gate 4: ✅ PASS**

📊 **Progress: [########--] 4/7**

**Next:** Step 5 — Implementation (TDD, per-ticket execution)
