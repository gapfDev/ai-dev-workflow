# SECURITY MODEL

## 1. Threat Model
1. **P2: Outdated Dependencies** - React and Express might have CVEs.
2. **P3: CORS configuration** - ensure localhost proxying is secure if making it public.

## 2. Security Gates
- Gate B: `npm audit` needs to pass or risk accepted.
