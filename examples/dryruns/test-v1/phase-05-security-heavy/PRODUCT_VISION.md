# PRODUCT VISION

## 1. Project Type
- **Greenfield** project.

## 2. Core Features & Scope
- E-commerce Payment API.
- Credit card processing & transaction history (7 years retention config).
- Admin portal for reports.
- PCI-DSS Compliance strictly enforced.
- 2FA implemented with TOTP (Authenticator app, no SMS).

## 3. Workflows
- Process card payment.
- Admin login and view transaction reports.

## 4. Uncovered Constraints & Blindspots
- SMS factored out for TOTP based on human input.
- GDPR ignored initially, PCI-DSS is the sole focus.
