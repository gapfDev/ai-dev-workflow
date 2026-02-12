---
description: How to prioritize backlog tickets and organize them into sprints using MoSCoW
---

# Sprint Planner

Skill for prioritizing a ticket backlog and organizing them into executable sprints with a defined MVP.

## Input
- A backlog of tickets (with user stories, acceptance criteria, and estimations)
- **Constraint**: All content (Plans, Sprints, Deliverables) MUST be in English.

## Output
- `IMPLEMENTATION_PLAN.md` document with ordered sprints and defined MVP

## Process

### Phase 1: Analyze Backlog
1. Read all available tickets
2. Note dependencies between tickets
3. Identify tickets that are prerequisites for others

### Phase 2: Apply MoSCoW

| Category | Key Question | Example |
|----------|-------------|---------|
| **Must** | Does the MVP work WITHOUT this? → No | Login, main screen |
| **Should** | Important but we survive? → Yes | Filters, search |
| **Could** | Nice-to-have? → Yes | Dark mode, animations |
| **Won't** | Out of scope? → Post-MVP | Multi-language |

### Phase 3: Define MVP
MVP = ALL **Must** tickets.
Validate with the user: "With these tickets, do you already have something useful?"

### Phase 4: Organize Sprints
Rules for building sprints:
1. Sprint 1 = Setup + Must tickets without dependencies
2. Respect dependencies: if B depends on A, A goes first
3. Maximum 5-7 tickets per sprint
4. Each sprint must produce something demonstrable

### Phase 5: Estimate Duration
Based on ticket complexity:
- **S** = ~2-4 hours
- **M** = ~4-8 hours
- **L** = ~1-2 days
- **XL** = ~2-4 days (consider splitting)

## Suggested Deliverable

```markdown
# Implementation Plan

## MVP Definition
Included tickets: [list]
Expected result: [what the user can do]

## Sprint 1: [Name]
| Ticket | Complexity | Deps | Est. |
|--------|-----------|------|------|
| EPIC1-01 | S | - | 2h |

## Sprint 2: [Name]
...

## Timeline
Sprint 1: [start date] → [end date]

## Risks
| Risk | Mitigation |
|------|-----------|
```

## Completeness Checklist
- □ All tickets have MoSCoW priority?
- □ MVP defined and validated?
- □ Sprints respect dependencies?
- □ Each sprint produces something demonstrable?

## Rules
1. **NEVER** put dependent tickets in the same sprint without resolving order
2. **ALWAYS** validate the MVP with the user before continuing
3. **ALWAYS** leave room for surprises (~20% buffer)
4. **ALWAYS** use English for all planning documents.
