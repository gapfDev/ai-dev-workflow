---
name: gh-pr-closeout
description: Standardize PR closure workflow for GitHub tickets with required linkage, test evidence, and issue close-out comments. Use when finishing implementation and preparing to close a ticket.
---

# GitHub PR Closeout

Close ticket work cleanly by enforcing PR linkage, verification evidence, and closure protocol.

## Input
- Ticket number.
- Final branch and PR URL.
- Test outputs and validation notes.
- **Constraint**: PR must include closure keyword for the ticket.

## Output
- PR linked to issue with deterministic close behavior.
- Final issue comment with implementation and test evidence.
- Ticket closed in a traceable and auditable way.

---

## Process

### Phase 1: Prepare PR Contract
1. Ensure PR body includes `Closes #<ticket>`.
2. Confirm scope matches issue AC/DoD.
3. Confirm tests relevant to the ticket passed.

### Phase 2: Merge Readiness
1. Verify no unresolved review blockers remain.
2. Ensure branch title/body are consistent with issue intent.
3. Merge using project policy.

### Phase 3: Ticket Closure Evidence
1. Post closure comment with PR link and test summary.
2. Mark ticket as closed.
3. If partial scope was merged, keep issue open and create follow-up issue.

---

## Completeness Checklist
- □ PR contains `Closes #<ticket>`.
- □ Test evidence is posted in issue or PR.
- □ Ticket is closed only after merge.

## Rules
1. **ALWAYS** use explicit issue-closing linkage in PR text.
2. **ALWAYS** leave final evidence comment before/at closure.
3. **NEVER** close issue while PR is still open.
4. **NEVER** hide failed tests in closeout notes.
