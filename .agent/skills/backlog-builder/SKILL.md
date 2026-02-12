---
description: How to convert product requirements into executable backlog tickets with DoD
---

# Backlog Builder

Skill for transforming product requirements into executable tickets with acceptance criteria and Definition of Done.

## Input
- A product vision/requirements document (features, users, scope)
- A technical strategy document (optional, improves ticket quality)
- **Constraint**: All content (Epics, Tickets, User Stories) MUST be in English.

## Output
- `BACKLOG.md` document with tickets organized by epics (use template in `templates/`)

## Process

### Phase 0: Agree on Tracking System
Before creating any tickets, ask where they will live:

| Option | Best For | Notes |
|--------|----------|-------|
| **BACKLOG.md only** | Solo dev, AI-assisted | Agent reads/writes directly |
| **GitHub Issues** | Team collab, visual board | Needs API or manual sync |
| **Jira / Linear / Trello** | Enterprise, large teams | External tool, manual sync |
| **Hybrid (md → tool)** | Best of both | BACKLOG.md is source of truth, sync to tool |

> **Recommended for AI-assisted projects:** BACKLOG.md as source of truth.
> The agent can always read and update it. Sync to an external tool if you want a visual board.

### Phase 1: Extract Features
1. Read the requirements document
2. List ALL mentioned features
3. If a technical strategy is available, cross-reference each feature with its solution

### Phase 2: Create Epics
Group features into logical epics:
- **Epic = Functional module** (e.g., "Authentication", "Cart", "Dashboard")
- Each epic contains 2-8 tickets

### Phase 3: Write Tickets
Each ticket MUST follow this format:

```markdown
## [EPIC-XX] Ticket Title

**As a** [user type]
**I want** [action]
**So that** [benefit]

### Acceptance Criteria
- [ ] Given [context], when [action], then [result]
- [ ] Given [context], when [action], then [result]

### Definition of Done (DoD)
- [ ] Code implemented
- [ ] Unit tests written and passing
- [ ] No lint warnings/errors
- [ ] Documentation updated (if applicable)

### Technical Notes
<!-- Technical context relevant for implementation -->

### Estimation
- Complexity: [S/M/L/XL]
- Dependencies: [Ticket IDs or "None"]
```

### Phase 4: Prioritize
Assign priority to each ticket:
- **Must:** Without this the minimum product doesn't work
- **Should:** Important but survives without it
- **Could:** Nice to have
- **Won't:** Out of scope (document for the future)

## Completeness Checklist
- □ Every feature has at least 1 ticket?
- □ Every ticket has User Story + Acceptance Criteria + DoD?
- □ Dependencies between tickets documented?
- □ MoSCoW prioritization assigned?

## Rules
1. **NEVER** create a ticket without Acceptance Criteria
2. **NEVER** create a separate ticket for tests — tests go in the SAME ticket
3. **ALWAYS** include complexity estimation (S/M/L/XL)
4. **ALWAYS** document dependencies between tickets
5. **ALWAYS** use English for all backlog content.
