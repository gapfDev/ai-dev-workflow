# SCHEMA.md
# NexaCore Platform — Database Schema & API Contracts

> **Workflow Step:** 2 / 7  
> **Role:** Architect Agent  
> **Input:** PRODUCT_VISION.md + TECH_STRATEGY.md  
> **Date:** 2026-02-21

---

## Database: PostgreSQL 16 (Multi-tenant with Row-Level Security)

### Multi-Tenant Strategy

All tables below include a `clinic_id` column (UUID) as the tenant discriminator.  
RLS policies are defined per table; ALL queries must pass through authenticated role with `clinic_id` set in `app.current_clinic_id` session variable.

```sql
-- Enable RLS enforcement per session
SET app.current_clinic_id = '<uuid>';
SET app.current_role = '<DOCTOR|ADMIN|CORPORATE_ADMIN>';
```

---

### Core Tables

#### `clinics`
```sql
CREATE TABLE clinics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  country       TEXT NOT NULL,
  timezone      TEXT NOT NULL DEFAULT 'America/Bogota',
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### `users`
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id     UUID NOT NULL REFERENCES clinics(id),
  auth_id       TEXT NOT NULL UNIQUE,   -- Auth0 / Supabase external ID
  role          TEXT NOT NULL CHECK (role IN ('DOCTOR', 'ADMIN', 'ADMISSIONS', 'CORPORATE_ADMIN')),
  full_name     TEXT NOT NULL,
  phone_e164    TEXT,                   -- For Twilio SMS (encrypted at column level)
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_clinic_isolation ON users
  USING (
    clinic_id = current_setting('app.current_clinic_id')::UUID
    OR current_setting('app.current_role') = 'CORPORATE_ADMIN'
  );
```

#### `patients`
```sql
CREATE TABLE patients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       UUID NOT NULL REFERENCES clinics(id),
  -- PHI Fields — all encrypted at column level (pgcrypto)
  full_name       BYTEA NOT NULL,             -- encrypted
  date_of_birth   BYTEA,                      -- encrypted
  ssn_hash        TEXT,                       -- SHA-256 of SSN — never stored plaintext
  insurance_id    BYTEA,                      -- encrypted
  status          TEXT NOT NULL CHECK (
                    status IN ('WAITING', 'BEING_ATTENDED', 'DISCHARGED')
                  ) DEFAULT 'WAITING',
  arrived_at      TIMESTAMPTZ DEFAULT NOW(),
  discharged_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY patients_clinic_isolation ON patients
  USING (
    clinic_id = current_setting('app.current_clinic_id')::UUID
    OR current_setting('app.current_role') = 'CORPORATE_ADMIN'
  );
```

#### `intake_forms`
```sql
CREATE TABLE intake_forms (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id         UUID NOT NULL REFERENCES clinics(id),
  patient_id        UUID REFERENCES patients(id),
  raw_form_s3_key   TEXT,                 -- pointer to encrypted S3 file, NEVER raw content
  parsed_json       JSONB,               -- PAN-scrubbed parsed result only
  pan_detected      BOOLEAN DEFAULT FALSE,
  pan_redacted      BOOLEAN DEFAULT FALSE,
  emergency_score   NUMERIC(3,2),        -- 0.00 to 1.00
  is_emergency      BOOLEAN DEFAULT FALSE,
  ocr_confidence    NUMERIC(3,2),
  requires_review   BOOLEAN DEFAULT FALSE, -- low confidence → human review
  processed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

#### `alerts`
```sql
CREATE TABLE alerts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       UUID NOT NULL REFERENCES clinics(id),
  patient_id      UUID NOT NULL REFERENCES patients(id),
  assigned_to     UUID REFERENCES users(id),   -- doctor
  urgency_level   TEXT NOT NULL CHECK (urgency_level IN ('LOW', 'MODERATE', 'URGENT', 'CRITICAL')),
  room_number     TEXT,
  reason          TEXT,                        -- NOT PHI — internal triage note
  status          TEXT NOT NULL CHECK (
                    status IN ('PENDING', 'DELIVERED', 'ACKNOWLEDGED', 'ESCALATED', 'CLOSED')
                  ) DEFAULT 'PENDING',
  push_sent_at    TIMESTAMPTZ,
  sms_sent_at     TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ,
  escalated_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY alerts_clinic_isolation ON alerts
  USING (clinic_id = current_setting('app.current_clinic_id')::UUID);
```

#### `billing_display_cache`
```sql
-- Read-only cache from Square API. Never source of truth.
CREATE TABLE billing_display_cache (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       UUID NOT NULL REFERENCES clinics(id),
  patient_id      UUID REFERENCES patients(id),
  square_order_id TEXT UNIQUE,
  status          TEXT CHECK (status IN ('PENDING', 'PAID', 'REJECTED')),
  amount_cents    INT,
  currency        CHAR(3) DEFAULT 'USD',
  last_synced_at  TIMESTAMPTZ DEFAULT NOW()
);
```

#### `audit_logs`
```sql
-- HIPAA §164.312(b) Audit Control
-- Write-only. No UPDATE or DELETE ever allowed on this table.
CREATE TABLE audit_logs (
  id              BIGSERIAL PRIMARY KEY,
  clinic_id       UUID NOT NULL,
  actor_user_id   UUID,
  actor_role      TEXT,
  action          TEXT NOT NULL,  -- e.g., 'READ_PATIENT', 'UPDATE_PATIENT', 'ALERT_CREATED'
  target_table    TEXT,
  target_id       UUID,
  ip_address      INET,
  session_id      TEXT,
  logged_at       TIMESTAMPTZ DEFAULT NOW()
);

-- No RLS on audit_logs — only AUDIT_READER role and CORPORATE_ADMIN can query
-- Append-only enforced via trigger
CREATE RULE no_update_audit_logs AS ON UPDATE TO audit_logs DO INSTEAD NOTHING;
CREATE RULE no_delete_audit_logs AS ON DELETE TO audit_logs DO INSTEAD NOTHING;
```

---

## API Contracts (REST)

### Authentication
All endpoints require `Authorization: Bearer <JWT>` (Auth0).  
JWT claims include: `clinic_id`, `user_id`, `role`.

---

### Alert Service Endpoints

```
POST   /api/v1/alerts                   → Create alert (Admissions → triggered by OCR)
GET    /api/v1/alerts                   → List active alerts for authorized doctor/admin
GET    /api/v1/alerts/:id               → Get alert detail
PATCH  /api/v1/alerts/:id/acknowledge   → Doctor marks as attended
POST   /api/v1/alerts/:id/escalate      → Escalate to backup doctor
```

### Patient Service Endpoints

```
POST   /api/v1/patients                 → Register new patient (Admissions)
GET    /api/v1/patients                 → List patients by status (Admin dashboard)
GET    /api/v1/patients/:id             → Get patient detail (HIPAA: triggers audit log)
PATCH  /api/v1/patients/:id/status      → Update patient flow status
GET    /api/v1/patients/:id/billing     → Get billing status from Square cache
```

### Intake/OCR Service Endpoints

```
POST   /api/v1/intake/upload            → Upload form (multipart/form-data)
GET    /api/v1/intake/:id/status        → Poll processing status
GET    /api/v1/intake/review-queue      → List forms requiring human review (low OCR confidence)
PATCH  /api/v1/intake/:id/confirm       → Admissions staff confirms parsed data
```

### Admin Dashboard Endpoints

```
GET    /api/v1/dashboard/flow           → Live patient flow counts per status
GET    /api/v1/dashboard/billing-stats  → Aggregate billing status (Pending/Paid/Rejected counts)
GET    /api/v1/clinics/:id/stats        → Clinic-level stats (CORPORATE_ADMIN only)
GET    /api/v1/clinics/aggregate        → Multi-clinic aggregate (CORPORATE_ADMIN only)
```

### Audit Endpoints

```
GET    /api/v1/audit-logs               → Query audit logs (ADMIN / CORPORATE_ADMIN only)
```

---

## WebSocket Events (Socket.io)

| Event (Server → Client) | Payload | Consumer |
|--------------------------|---------|----------|
| `alert:new` | `{ alertId, urgencyLevel, room, patientName }` | Admin Dashboard |
| `alert:acknowledged` | `{ alertId, doctorId, timestamp }` | Admin Dashboard |
| `patient:status_changed` | `{ patientId, newStatus }` | Admin Dashboard |
| `intake:processed` | `{ formId, isEmergency, requiresReview }` | Admissions Web |

---

## Queue Jobs (BullMQ / Redis)

| Queue | Job | Trigger |
|-------|-----|---------|
| `ocr-processing` | Process uploaded intake form | POST /intake/upload |
| `pan-scrub` | Run PAN detection & redaction | After OCR parse, before DB write |
| `alert-dispatch` | Send FCM + Twilio SMS | Alert created/escalated |
| `square-sync` | Refresh billing cache from Square API | Every 5 minutes per clinic |
| `audit-flush` | Batch write audit events | Every 30 seconds |
