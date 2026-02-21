# PRODUCT VISION

## 1. Project Type
- **Brownfield** project (Adding parallel modules to existing E-commerce).

## 2. Core Features & Scope
- Cart Module (add/remove items).
- Checkout Flow (payment form, order confirmation).
- User Profile (edit name, address, avatar upload).

## 3. Workflows
- Checkout relies on Cart module state. Both touch `OrderService.ts`.

## 4. Uncovered Constraints & Blindspots
- Parallel development constraints map to multi-agent coordination.
