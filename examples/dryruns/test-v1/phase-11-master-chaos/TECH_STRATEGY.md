# TECH_STRATEGY.md
# NexaCore Platform — Technical Architecture Strategy

> **Workflow Step:** 2 / 7  
> **Roles:** Architect Agent + Security Agent  
> **Input:** PRODUCT_VISION.md  
> **Date:** 2026-02-21

---

## 🗣️ Tech Context Interview Log

🤖 **Manager (Arch Agent):** Does your team have experience with mobile (iOS/Android) and web development?

👤 **Humano (Auto-simulado):** Sí, 4 desarrolladores senior. No especificaron stack preferido — confían en nuestra recomendación técnica.

🤖 **Manager (Arch Agent):** Is there existing code or a codebase to integrate with?

👤 **Humano (Auto-simulado):** No. Todo nuevo, greenfield.

🤖 **Manager (Arch Agent):** Architecture preferences? Scale expectations?

👤 **Humano (Auto-simulado):** 50 clínicas, potencialmente cientos de doctores concurrentes. Quiero que escale. Sin preferencia de arquitectura — confían en el agente.

🤖 **Manager (Arch Agent):** CI/CD already set up?

👤 **Humano (Auto-simulado):** No, lo necesitamos desde cero.

---

## 🏗️ Architecture Overview

### Architecture Pattern: **Cloud-Native Multi-Tenant Microservices**

```
┌─────────────────────────────────────────────────────────────────┐
│                     NexaCore Platform                           │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐    │
│  │ Doctor App   │   │ Admin Web    │   │ Admission Web    │    │
│  │ (Mobile)     │   │ Dashboard    │   │ Form Reader      │    │
│  │ React Native │   │ Next.js/React│   │ Next.js          │    │
│  └──────┬───────┘   └──────┬───────┘   └────────┬─────────┘    │
│         │                  │                     │              │
│         └──────────────────┴─────────────────────┘             │
│                            │                                    │
│                     ┌──────▼──────┐                            │
│                     │   API GW    │                            │
│                     │  (Kong/     │                            │
│                     │   Nginx)    │                            │
│                     └──────┬──────┘                            │
│                            │                                    │
│      ┌─────────────────────┼────────────────────────┐          │
│      │                     │                        │          │
│  ┌───▼───────┐  ┌──────────▼──────┐  ┌─────────────▼──┐       │
│  │ Alert     │  │ Patient/Admin   │  │ Intake/OCR      │       │
│  │ Service   │  │ Service         │  │ Service         │       │
│  │ (Node.js) │  │ (Node.js/NestJS)│  │ (Python/FastAPI)│       │
│  └───┬───────┘  └──────────┬──────┘  └─────────────┬──┘       │
│      │                     │                        │          │
│  ┌───▼───────┐  ┌──────────▼──────┐  ┌─────────────▼──┐       │
│  │  FCM +    │  │ PostgreSQL DB    │  │ Google Document │       │
│  │  Twilio   │  │ (Multi-tenant   │  │ AI / Tesseract  │       │
│  │  SMS      │  │  RLS)           │  │ + PAN Scrubber  │       │
│  └───────────┘  └─────────────────┘  └────────────────┘       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Audit Log Service (Write-only, encrypted)        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Feature → Tech Mapping

### Feature 1: Real-Time Urgency Alert System

| Question | Decision |
|----------|----------|
| Component | Alert Service (Node.js / NestJS) |
| Libraries | Firebase Cloud Messaging (FCM) for push, Twilio SDK for SMS |
| Persistence | PostgreSQL: `alerts` table, `alert_status` per doctor |
| Networking | WebSocket (Socket.io) for real-time dashboard sync; FCM for mobile push |
| UI | React Native mobile app (cross-platform iOS + Android) |
| Offline | React Native + Redux Offline + WatermelonDB (local SQLite sync) |

**Why React Native?** Cross-platform (iOS + Android) with a single codebase. 4-person team cannot maintain two separate native codebases in 3 months.  
**Offline Strategy:** WatermelonDB (SQLite-backed React Native DB) stores pending actions. Background sync when connectivity restored. SMS via Twilio is the redundant channel.

---

### Feature 2: AI-Powered Intake Form Reader

| Question | Decision |
|----------|----------|
| Component | Intake/OCR Service (Python / FastAPI) |
| Libraries | Google Document AI (handwriting + printed OCR), or fallback to Tesseract v5 |
| PAN Scrubber | `luhn` algorithm + regex pre-processing BEFORE any data touches the DB |
| Emergency Detection | Fine-tuned classification model on admission keywords (fever +pain level + vitals) |
| Persistence | Raw form stored encrypted (AES-256); only parsed, PAN-scrubbed version stored in patient record |
| Networking | Async job queue (BullMQ / Redis) — form processing is async, not blocking |

**Why Python FastAPI for OCR?** Python has the richest ML/OCR ecosystem. NestJS handles orchestration and delegates to FastAPI for inference.  
**PAN Scrubbing Rule:** Zero-tolerance. Credit card pattern detection runs BEFORE Luhn validation. Any PAN-like sequence is replaced with `[REDACTED-PAN]` and logged as a security event.

---

### Feature 3: Admin Web Dashboard

| Question | Decision |
|----------|----------|
| Component | Admin Service + Web App |
| Framework | Next.js 14 (App Router) + React |
| Real-time | Socket.io for live patient flow updates |
| Billing | Square API read-only (display only — no payments processed here) |
| Multi-tenant | Row-Level Security (RLS) in PostgreSQL per `clinic_id` |
| Corporate view | Separate role: `CORPORATE_ADMIN` bypasses RLS for aggregate queries |

---

### Feature 4: HIPAA Audit Log

| Question | Decision |
|----------|----------|
| Component | Audit Log Service (write-only microservice) |
| Storage | Separate encrypted PostgreSQL schema OR AWS CloudWatch Logs with KMS encryption |
| Access Pattern | Append-only. No service can DELETE or UPDATE audit events. |
| Triggers | Every read/write on `patients`, `diagnoses`, `prescriptions`, `alerts` tables |
| Compliance | Meets HIPAA §164.312(b): hardware/software activity in info systems containing e-PHI |

---

## 🏛️ QA Paradigm Selected: **TDD (Test-Driven Development)**

- Every ticket implementation uses Red-Green-Refactor cycle
- Unit tests: Jest (Node.js services), Pytest (Python OCR service)
- Integration tests: Supertest (API endpoints)
- E2E: Detox (React Native mobile), Playwright (Next.js web)

---

## 🛠️ Tech Stack Summary

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Mobile App | React Native + Expo | Cross-platform, offline-capable |
| Web Dashboard | Next.js 14 + React | SSR for SEO, fast loads, App Router |
| API Gateway | Kong (or Nginx + rate limiting) | Central auth, rate limiting, routing |
| Backend Services | Node.js / NestJS | TypeScript, scalable, familiar ecosystem |
| OCR Service | Python / FastAPI | Best ML ecosystem |
| Database | PostgreSQL 16 + RLS | Multi-tenant, transactional, HIPAA-ready |
| Cache / Queue | Redis + BullMQ | Async job processing |
| Push Notifications | Firebase Cloud Messaging | Industry standard for mobile push |
| SMS | Twilio | Proven, reliable, HIPAA-compliant plan |
| Billing Display | Square API (read-only) | Client requirement, no migration |
| OCR Engine | Google Document AI | Best handwriting recognition accuracy |
| Auth | Auth0 or Supabase Auth | RBAC, MFA support, HIPAA BAA available |
| CI/CD | GitHub Actions | Standard, integrates with all tools |
| Infra | AWS (ECS Fargate or Railway) | HIPAA-eligible AWS infrastructure |
| Monitoring | Datadog or AWS CloudWatch | Alerting, uptime, log aggregation |

---

## ⚖️ Technical Trade-offs Documented

### Decision 1: Multi-tenant RLS vs. Separate DB per clinic
- **Choice:** Single PostgreSQL DB with Row-Level Security per `clinic_id`
- **Why:** 50 clinics → 50 separate DBs is operationally costly (50x migrations, 50x backups, 50x credentials to manage)
- **Risk:** RLS policy bug could expose cross-clinic data
- **Mitigation:** RLS policies audited via automated test suite that MUST query across clinic boundaries and verify denial
- **Alternative if RLS fails:** Separate schemas within one Postgres instance (still one DB, isolated namespaces)

### Decision 2: React Native vs. Native (Swift/Kotlin)
- **Choice:** React Native + WatermelonDB for offline
- **Why:** 3-month budget, 4 devs, cross-platform needed. Native would halve the team.
- **Risk:** React Native limitations for complex background sync
- **Mitigation:** WatermelonDB is proven for offline-first patterns in React Native

### Decision 3: Google Document AI vs. self-hosted Tesseract
- **Choice:** Google Document AI (primary), Tesseract (fallback)
- **Why:** Best accuracy for mixed handwriting/printed forms. HIPAA-eligible via Google Cloud BAA.
- **Risk:** Vendor dependency, per-page cost
- **Mitigation:** Tesseract as fallback. All form data stays within HIPAA BAA boundary.

---

## ⚠️ Technical Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| PAN slip through to DB if scrubber has edge case | P0 | Defense-in-depth: regex + Luhn + DB-level column encryption |
| RLS misconfiguration leaks clinic data | P0 | Automated cross-tenant access tests in CI |
| Doctor app fails offline (critical alert miss) | P1 | SMS fallback via Twilio is always active regardless of app state |
| Google Document AI cost at scale | P2 | Set monthly budget cap; auto-fallback to Tesseract at threshold |
| Auth0 HIPAA BAA not signed | P1 | Block deployment until BAA confirmed signed |

---

## 📊 Progress: [####------] 2/7

**Gate 2 Auto-Check:**
- ✅ Stack viable for 4-dev team in 3-month timeline
- ✅ Every feature has an assigned tech solution
- ✅ Team experience assessed (greenfield, trust agent's recommendation)
- ✅ Architecture pattern chosen and justified (cloud-native multi-tenant)
- ✅ Threat model: see SECURITY_MODEL.md
- ✅ Risks ranked P0–P2

**Next:** Security Gate A verification → Step 3
