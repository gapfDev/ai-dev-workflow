---
name: github-milestone-manager
description: Plan and manage GitHub milestones with due dates, realistic scope, and outcome-based delivery targets. Use when preparing sprint/release slices, balancing capacity, or recalibrating timeline commitments.
---

# GitHub Milestone Manager

Convert delivery windows into realistic milestone commitments that can be tracked and completed.

## Input
- Delivery window or sprint dates.
- Team capacity assumptions.
- Candidate tickets and priorities.
- **Constraint**: Every active milestone must have a due date.

## Output
- Milestone definition with name, due date, and expected outcome.
- Scoped ticket set aligned to team capacity.
- Milestone health notes (risk and overflow candidates).

---

## Process

### Phase 1: Define Milestone Frame
1. Name milestone with `YYYY-MM Sprint N - Goal` format.
2. Set due date and delivery objective.
3. Confirm timeline assumptions with team constraints.

### Phase 2: Scope by Capacity
1. Prioritize candidate tickets by value and dependency.
2. Fit tickets to realistic capacity.
3. Mark overflow tickets for next milestone.

### Phase 3: Operate and Recalibrate
1. Monitor progress and blocked work during execution.
2. Rebalance scope if due date risk appears.
3. Close milestone only when committed objective is met.

---

## Completeness Checklist
- □ Milestone has a due date and measurable objective.
- □ Scoped tickets match estimated team capacity.
- □ Overflow and risk items are identified explicitly.

## Rules
1. **ALWAYS** keep milestone goal outcome-focused and measurable.
2. **ALWAYS** assign planned tickets to exactly one active milestone.
3. **NEVER** keep active milestones without due dates.
4. **NEVER** overload a milestone beyond realistic capacity.
