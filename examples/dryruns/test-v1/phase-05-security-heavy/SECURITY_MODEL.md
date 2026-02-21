# SECURITY MODEL

## 1. Threat Model
1. **P0: Credit Card Leak** - High Impact. Mitigated by strictly tokenizing and never storing raw PANs.
2. **P1: Admin Portal Bypass** - Mitigated by mandatory TOTP 2FA.

## 2. Security Gates
- Gate A (Design): Approved. PCI isolation architecture active.
- Gate B (Review): Checked for weak cipher suites.
