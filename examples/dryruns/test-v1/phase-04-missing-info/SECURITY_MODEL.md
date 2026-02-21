# SECURITY MODEL

## 1. Threat Model
1. **P1: PII Leak (GPS Data)** - Must ensure location data is only accessible to the authenticated user.
2. **P2: OAuth Token Theft** - Mitigation via secure Android Keystore for token persistence.

## 2. Security Gates
- Gate A (Design): User privacy design approved.
- Gate B (Review): Checked location permission rationales.
