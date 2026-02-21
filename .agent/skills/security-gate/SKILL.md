---
name: security-gate
description: Enforce Security Gates A/B/C across architecture, PR review, and release sign-off using severity-based blocking rules.
---

# Security Gate

Security control skill to prevent vulnerable architecture, unsafe merges, and risky releases.

## Input
- Product and technical artifacts (`PRODUCT_VISION.md`, `TECH_STRATEGY.md`).
- Backlog context for implementation planning.
- Ticket/PR context and test evidence.
- QA validation report and release candidate details.

## Output
- `SECURITY_THREAT_MODEL.md` (Step 2 / Gate A).
- `SECURITY_BACKLOG.md` (Step 3 planning handoff).
- `SECURITY_REVIEW_REPORT.md` (Step 6 / Gate B).
- `SECURITY_RELEASE_SIGNOFF.md` (Step 7 / Gate C).
- Severity-classified finding list (`P0` to `P3`).

## Process

### Phase 1: Security Gate A (Architecture)
1. Identify attack surface and trust boundaries.
2. Map sensitive data flows and storage points.
3. **Analyze all user-provided data vectors**: For each type of data the user can input (text, files, images, audio, video, location, metadata), evaluate:
   - Does it contain or could it expose PII (faces, addresses, plates, GPS coordinates)?
   - Does it require sanitization, stripping, or blurring before storage or display?
   - What regulatory frameworks apply (GDPR, CCPA, HIPAA)?
4. Rank risks by severity (`P0`-`P3`) and define mitigations.
5. Block progression to Step 3 if critical/high risks are undefined.

### Phase 1.5: Security Backlog Conversion (Planning)
1. Convert mitigations into security backlog tickets with clear acceptance criteria.
2. Ensure each accepted risk includes owner and due date.
3. Reject `P0/P1` risk acceptance at planning time.
4. Publish `SECURITY_BACKLOG.md` for Step 3 and sprint planning.

### Phase 2: Security Gate B (Pre-Merge)
1. Review PR changes for authz/authn, input validation, data handling, secrets, and dependency risk.
2. Verify security-relevant tests are present for new behavior.
3. Publish `SECURITY_REVIEW_REPORT.md` with findings and required fixes.
4. Block merge for any open `P0` or `P1` finding.

### Phase 3: Security Gate C (Release)
1. Confirm Gate B is fully resolved; risk acceptance is only allowed for `P2/P3` with owner and target date.
2. Re-check high-risk user flows and regression-sensitive paths.
3. Publish `SECURITY_RELEASE_SIGNOFF.md` with final `GO` / `NO-GO`.
4. Block release if `GO` is not explicitly documented.

## Templates
- `templates/SECURITY_THREAT_MODEL.md`
- `templates/SECURITY_BACKLOG.md`
- `templates/SECURITY_REVIEW_REPORT.md`
- `templates/SECURITY_RELEASE_SIGNOFF.md`

## Commands
```bash
bash .agent/scripts/validate-security-gates.sh --root .
bash .agent/scripts/validate-security-gates.sh --root . --threat-prefix THREAT- --finding-prefix FIND-
```

## Severity Policy

| Severity | Meaning | Gate Impact |
|----------|---------|-------------|
| `P0` | Active exploit path or severe data exposure | Block merge and release |
| `P1` | High-impact vulnerability with realistic exploitability | Block merge and release until fixed |
| `P2` | Medium risk with available mitigation | Allow with owner + due date |
| `P3` | Low-risk hardening improvement | Track in backlog |

## Completeness Checklist
- □ Gate A has documented attack surface, data flow, and mitigations.
- □ Gate B report exists and no open `P0/P1` remains.
- □ Gate C sign-off exists with explicit `GO` or `NO-GO`.
- □ All accepted risks include owner and target date.

## Rules
1. **ALWAYS** classify findings using `P0` to `P3`.
2. **ALWAYS** block merge when `P0` or `P1` findings are open.
3. **ALWAYS** block release when sign-off is missing or `NO-GO`.
4. **ALWAYS** require owner + due date for accepted `P2/P3` risks.
5. **NEVER** close a gate without written evidence artifacts.
