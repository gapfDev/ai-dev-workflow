---
name: github-epic-manager
description: Create and manage GitHub epics as parent issues with clear outcomes, sub-issue decomposition, dependency mapping, and closure criteria. Use when defining a new initiative, restructuring epic scope, or reviewing epic health.
---

# GitHub Epic Manager

Define epics as outcome-based parent issues and keep execution traceable through sub-issues and dependencies.

## Input
- Initiative objective and business outcome.
- Candidate capabilities or features to include.
- Known constraints, risks, and dependencies.
- **Constraint**: Keep epic focused on one measurable outcome.

## Output
- Epic draft ready for GitHub issue creation.
- Child ticket decomposition map.
- Dependency and risk summary for execution.
- Kickoff execution comment with dependency gates and wave order.

---

## Process

### Phase 0: Governance Preflight
1. Verify target repository is correct before creating or editing the epic.
2. Verify required labels exist (`track:*`, `agent:*`, `area:*`, `priority:*`, `kind:*`).
3. Verify milestone exists (or create it first via milestone workflow).
4. Verify ticket tracking mode for this epic:
   - Use linked child issues (`- [ ] #123`) for visible progress in GitHub.
   - Do not use plain text checklist items without issue numbers.

### Phase 1: Define Outcome and Scope
1. Write the epic objective in one outcome-focused statement.
2. Define success criteria that can be measured.
3. Define in-scope and out-of-scope boundaries.

### Phase 2: Decompose and Link Work
1. Split implementation into child tickets (sub-issues).
2. Add each child ticket to epic body as linked checklist item (`- [ ] #<issue>`).
3. Add dependency contract for each child issue (`blocked by #...`) and initial status.
4. Ensure each child has owner labels (`agent:*`) and one active milestone.

### Phase 3: Launch Execution
1. Post kickoff comment on epic with:
   - Wave order
   - Hard gate policy (no start on blocked tickets)
   - Required operational comments (`STARTED`, `BLOCKED`, `DONE`)
2. Mark governance gate ticket ready first.
3. Unblock the next wave only after dependency tickets are done.

### Phase 4: Control and Close
1. Document major risks and mitigations.
2. Set closure condition: epic closes only when all children are done.
3. Review weekly and adjust decomposition if tickets are too large.

---

## Completeness Checklist
- □ Preflight passed (repo, labels, milestone, tracking mode).
- □ Epic has objective, success criteria, and scope boundaries.
- □ Epic has linked child tickets (`#issue`) covering all in-scope work.
- □ Child tickets have owner labels and dependency comments.
- □ Kickoff comment with wave/gates is posted.
- □ Dependencies and risks are explicitly documented.

## Rules
1. **ALWAYS** keep epic language outcome-focused, not implementation-heavy.
2. **ALWAYS** maintain linked child ticket references (`#issue`) inside the epic body.
3. **ALWAYS** publish a kickoff comment with dependency gates before implementation starts.
4. **NEVER** close an epic while child tickets remain open.
5. **NEVER** use plain-text child checklists when progress visibility is required.
6. **NEVER** mix unrelated initiatives inside one epic.
