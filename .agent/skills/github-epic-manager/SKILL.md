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

---

## Process

### Phase 1: Define Outcome and Scope
1. Write the epic objective in one outcome-focused statement.
2. Define success criteria that can be measured.
3. Define in-scope and out-of-scope boundaries.

### Phase 2: Decompose and Link Work
1. Split implementation into child tickets (sub-issues).
2. Add each child ticket as a checklist item or sub-issue link.
3. Identify blocking and blocked-by relationships.

### Phase 3: Control and Close
1. Document major risks and mitigations.
2. Set closure condition: epic closes only when all children are done.
3. Review weekly and adjust decomposition if tickets are too large.

---

## Completeness Checklist
- □ Epic has objective, success criteria, and scope boundaries.
- □ Epic has child tickets covering all in-scope work.
- □ Dependencies and risks are explicitly documented.

## Rules
1. **ALWAYS** keep epic language outcome-focused, not implementation-heavy.
2. **ALWAYS** maintain child ticket links inside the epic body.
3. **NEVER** close an epic while child tickets remain open.
4. **NEVER** mix unrelated initiatives inside one epic.
