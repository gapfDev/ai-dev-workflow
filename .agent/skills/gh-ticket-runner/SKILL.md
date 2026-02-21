---
name: gh-ticket-runner
description: Execute one GitHub ticket end-to-end with a consistent operational contract (STARTED, BLOCKED, DONE), evidence posting, and closure hygiene. Use when an agent picks up a specific issue for implementation.
---

# GitHub Ticket Runner

Run one ticket with consistent execution and reporting behavior.

## Input
- Ticket number and link.
- Acceptance criteria, DoD, and test plan from the issue body.
- Assigned dependency preconditions.
- **Constraint**: Do not begin coding until the ticket is dependency-unblocked.

## Output
- Ticket-level execution trail in comments.
- PR and verification evidence linked to the issue.
- Ticket closed with complete closure notes.

---

## Process

### Phase 1: Claim and Start
1. Confirm all dependency tickets are closed.
2. Add a comment: `STARTED by <agent> | ETA: <time>`.
3. Confirm scope and non-scope directly from the issue body.
4. **Create a branch** using the format: `codex/[issue-#]-[short-name]`.

### Phase 2: Execute and Validate
1. Implement only what is required by AC and DoD.
2. Run required tests and capture outcomes.
3. If blocked for more than 15 minutes, add: `BLOCKED | reason: ... | waiting_on: #...`.

### Phase 3: Close with Evidence
1. Open PR linked with closure keyword (`Closes #<ticket>`).
2. Post closure comment with PR link, tests, and key outcomes.
3. Close issue only after merge and evidence is posted.
4. **LOCAL TRIAGE RULE:** If you were working on a local fallback ticket (`.agent/issues/ERR-001.md`), instead of closing a GitHub issue, you MUST edit the file and change the YAML frontmatter from `status: active` to `status: ready_to_prune`. This signals the Knowledge Gardener to clean it up.

---

## Completeness Checklist
- □ `STARTED` comment exists.
- □ AC + DoD + tests are explicitly addressed.
- □ `DONE` evidence comment exists with PR and results.

## Rules
1. **ALWAYS** use explicit `STARTED`, `BLOCKED`, and `DONE` operational comments.
2. **ALWAYS** attach test evidence in the issue before closure.
3. **NEVER** close a ticket without merged PR linkage.
4. **NEVER** scope-creep outside the issue contract without a documented change.
