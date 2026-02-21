---
name: github-ticket-writer
description: Write execution-ready GitHub tickets with clear scope, acceptance criteria, test plan, metadata, and dependencies. Use when creating new issues from requirements, refining vague backlog items, or standardizing issue quality.
---

# GitHub Ticket Writer

Create tickets that are small, testable, and unambiguous for engineering execution.

## Input
- Requirement or change request.
- Linked epic and milestone context.
- Priority and dependency information.
- **Constraint**: Ticket should fit 1-2 working days whenever possible.

## Output
- Ticket draft ready for GitHub issue creation.
- Acceptance criteria and test plan.
- Required metadata (owner, priority, area, links).

---

## Process

### Phase 1: Clarify Scope
1. Write one-sentence summary of the change.
2. Define in-scope and out-of-scope boundaries.
3. Capture context and business reason.

### Phase 2: Define Execution Contract
1. Write acceptance criteria using observable behavior.
2. Define test plan (automated + manual where needed).
3. Add dependencies and related links.

### Phase 3: Add Metadata and Finalize
1. Link epic and milestone.
2. Assign owner, priority, and area.
3. Verify ticket size and split if oversized.

### Phase 4: Local Fallback (If `gh` CLI is unavailable)
If you cannot create the issue in GitHub:
1. Create a local markdown file in `.agent/issues/` (e.g., `.agent/issues/ERR-001.md`).
2. **CRITICAL:** You MUST include this exact YAML frontmatter at the top of the file:
   ```yaml
   ---
   type: ephemeral
   status: active
   ---
   ```
3. Write the ticket details below the frontmatter.

---

## Completeness Checklist
- □ Ticket includes scope, acceptance criteria, and test plan.
- □ Epic, milestone, owner, and priority are present.
- □ Dependencies are explicit and actionable.

## Rules
1. **ALWAYS** write acceptance criteria before starting implementation.
2. **ALWAYS** include a test plan in the same ticket.
3. **NEVER** create vague tickets without scope boundaries.
4. **NEVER** leave active tickets without owner or priority.
