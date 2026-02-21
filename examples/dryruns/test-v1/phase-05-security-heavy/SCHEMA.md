# SCHEMA

## Required Sub-system Tables
- `transactions` (id, user_id, amount, status, tokenized_card, created_at, retained_until)
- `admin_users` (id, email, totp_secret, role)
