# SECURITY MODEL

## 1. Threat Model
1. **P2: SQL Injection (SQLi)** - Mitigated by strict use of parameterized queries via node-postgres (`pg`).

## 2. Security Gates
- Gate B (Review): SQLi static analysis passed.
