# DATABASE SCHEMA (PostgreSQL)

## Tables
- `tenants` (id, name, stripe_customer_id, plan_type, created_at)
- `users` (id, tenant_id, firebase_uid, email, role, created_at)
- `workspaces` (id, tenant_id, data_payload)
- `notifications` (id, user_id, type, status, created_at)

*Note: All tables enforce Row-Level Security (RLS) on `tenant_id`.*
