# TECHNICAL STRATEGY

## 1. Architecture
- **Paradigm**: TDD (Test-Driven Development).
- **Backend**: Node.js v18 (updated from v20 per Human request during build failure).
- **Frontend**: React Native (Mobile), React.js (Web).
- **Database**: PostgreSQL with Row-Level Security (RLS) for tenant isolation.
- **Microservices**: Billing Service (Stripe), Auth Service (Firebase Auth), Notification Worker.

## 2. Mitigations
- Circular dependencies in Node services resolved by breaking the dependency graph manually (per Human advice).
- Zero reliance on GitHub CLI (`gh`) due to environment constraints.

## 3. Testing
- Unit tests required for all core functions.
- E2E tests for tenant isolation.
