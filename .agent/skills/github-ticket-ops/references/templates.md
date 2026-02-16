# Templates

## Epic Template
```md
# Objective
[Business outcome this epic must deliver]

# Success Criteria
- [ ] Measurable outcome 1
- [ ] Measurable outcome 2

# Scope
- In scope:
- Out of scope:

# Child Tickets (Sub-Issues)
- [ ] #123
- [ ] #124
- [ ] #125

# Dependencies
- Blocked by:
- Blocks:

# Risks
- Risk:
- Mitigation:
```

## Ticket Template
```md
# Summary
[One-sentence change]

# Context
[Problem and why now]

# Scope
- In scope:
- Out of scope:

# Acceptance Criteria
- [ ] Behavior A
- [ ] Behavior B

# Test Plan
- [ ] Automated checks
- [ ] Manual QA scenario

# Dependencies
- Blocked by:
- Related:

# Metadata
- Epic: #
- Milestone: [name]
- Priority: [p0|p1|p2]
- Owner: @
- Area: [capture|kanban|api|infra]
```

## Milestone Convention
- Format: `YYYY-MM Sprint N - Goal`
- Example: `2026-02 Sprint 3 - Capture Speed`
- Rule: always set due date and clear expected outcome.

## Labels Convention
- Type: `type:feature`, `type:bug`, `type:chore`
- Priority: `priority:p0`, `priority:p1`, `priority:p2`
- Area: `area:capture`, `area:kanban`, `area:api`, `area:infra`
- Status helper (optional): `status:blocked`

## Board Policy
Columns:
1. `Backlog`
2. `Ready`
3. `In Progress`
4. `Review`
5. `Done`
6. `Blocked`

Rules:
- Move to `Ready` only if DoR is satisfied.
- Move to `In Progress` only if owner is assigned.
- Move to `Review` only with test evidence.
- Move to `Done` only after merge/close confirmation.
- Move to `Blocked` only with blocker owner and dependency link.

## DoR / DoD Checklist
Definition of Ready (DoR):
- [ ] Scope clear
- [ ] Acceptance criteria written
- [ ] Dependencies identified
- [ ] Owner assigned

Definition of Done (DoD):
- [ ] Code merged
- [ ] Checks/tests pass
- [ ] Deployment validated (if applicable)
- [ ] Issue closed and board updated

## Weekly Triage Checklist
- Re-rank top backlog items.
- Split oversized tickets.
- Remove stale unowned work.
- Validate milestone scope vs due date.
- Update epic progress and blockers.
