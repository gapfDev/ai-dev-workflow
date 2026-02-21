---
name: qa-release-gate
description: Enforce QA final gate for milestone release with dependency verification, full matrix execution, and sign-off reporting. Use when QA must wait for implementation tickets to close before validating release readiness.
---

# QA Release Gate

Run QA as a hard gate after dependency completion, then publish go/no-go decision.

## Input
- QA ticket and dependency ticket list.
- Test matrix and regression checklist.
- Staging target and release candidate revision.
- **Constraint**: Final sign-off cannot start while dependency tickets are open.

## Output
- QA execution report with pass/fail evidence.
- Blocker list (if any) with severity.
- Go/no-go release recommendation.

---

## Process

### Phase 1: Dependency Gate Check
1. Verify required implementation tickets are closed.
2. If any dependency is open, mark QA as blocked with reason.
3. Prepare test report scaffold while waiting.

### Phase 1.5: Independent Coverage Validation
1. Read the PRODUCT_VISION.md and independently generate a list of 5-10 critical functional scenarios that a user would encounter.
2. Compare these scenarios against the existing test suite.
3. If any scenario is NOT covered by an existing test, report it as a coverage gap.
4. Coverage gaps in critical user flows are blockers; gaps in secondary flows are warnings.

### Phase 2: Execute Validation Matrix
1. Run mandatory scenario matrix.
2. Run regression checks for unaffected core flows.
3. Log failures with reproducible steps.

### Phase 3: Sign-off
1. Publish QA report with evidence links.
2. Declare `GO` or `NO-GO` with rationale.
3. Close QA ticket only after sign-off is published.

---

## Completeness Checklist
- □ Dependency gate is explicitly verified.
- □ Mandatory matrix and regression checks are executed.
- □ Final sign-off decision is documented in GitHub.

## Rules
1. **ALWAYS** enforce dependency closure before final QA execution.
2. **ALWAYS** include reproducible evidence for failed checks.
3. **NEVER** issue a release sign-off with open P0 blockers.
4. **NEVER** skip regression validation without documented approval.
