# PRODUCT VISION: Multi-Tenant SaaS Platform

## 1. Project Type
- **Greenfield** project.

## 2. Core Features & Scope
- Multi-tenant architecture (each tenant has an isolated workspace).
- Authentication with SSO (Firebase Auth selected based on human input).
- Billing integration with Stripe (Tiers: Free, Pro, Enterprise - assumed).
- Real-time and Push Notifications (via email and push).
- Multi-role access control: admin, editor, viewer.
- Platforms: Web Dashboard + Mobile App (React Native - iOS & Android assumed).

## 3. Workflows
- Tenant onboarding & subscription selection via Stripe.
- Role-based dashboard views.
- Cross-platform real-time data synchronization.

## 4. Uncovered Constraints & Blindspots
- Specific billing tiers and mobile platforms were not specified, assumptions were made and documented.
- "Auth0 o Firebase Auth" constraint resolved to Firebase Auth.
