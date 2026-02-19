---
name: github-board-ops
description: Operate GitHub Projects boards with clear status flow, entry/exit policies, field hygiene, and automation rules. Use when configuring a board, running daily execution, or fixing status drift across tickets.
---

# GitHub Board Ops

Use GitHub Project as the single operational source of truth for team execution.

## Input
- Project board context and current workflow.
- Active ticket list with current statuses.
- Team operation rules (roles, WIP expectations).
- **Constraint**: Board state must reflect real execution daily.

## Output
- Board operation policy with status transitions.
- Field standard (`Status`, `Priority`, `Size`, `Area`, `Iteration`).
- Daily update routine and blocker handling policy.

---

## Process

### Phase 1: Configure Board Structure
1. Define statuses: `Backlog`, `Ready`, `In Progress`, `Review`, `Done`, `Blocked`.
2. Configure core fields and views (Board, Table, Roadmap).
3. Add minimal automation to reduce manual status drift.

### Phase 2: Enforce Flow Rules
1. Move to `Ready` only when Definition of Ready is met.
2. Move to `In Progress` only when owner is assigned.
3. Move to `Done` only when merge/close criteria are verified.

### Phase 3: Maintain Execution Hygiene
1. Review in-progress and blocked lanes daily.
2. Ensure blocked items include dependency owner and ETA.
3. Archive or close stale items to keep board signal clean.

---

## Completeness Checklist
- □ Board has clear statuses and transition criteria.
- □ Core fields are present and populated for active items.
- □ Blocked lane has explicit owner + ETA on each item.

## Rules
1. **ALWAYS** keep statuses simple and actionable.
2. **ALWAYS** resolve status drift during daily sync.
3. **NEVER** treat board as optional compared to issue state.
4. **NEVER** keep blocked items without dependency context.
