---
name: github-triage-rhythm
description: Run recurring backlog triage for GitHub issues and projects to keep priorities, scope, and blockers current. Use during weekly planning, release risk review, or backlog cleanup sessions.
---

# GitHub Triage Rhythm

Run a repeatable triage cadence that keeps backlog, milestones, and board health aligned.

## Input
- Current backlog and board snapshot.
- Active milestone status and deadlines.
- Open blockers and dependency list.
- **Constraint**: Prioritization decisions must be explicit and documented.

## Output
- Updated top-priority queue.
- List of split/closed/deferred tickets.
- Triage summary with risks, blockers, and next actions.

---

## Process

### Phase 1: Prepare Triage Snapshot
1. Pull open issues by priority, milestone, and status.
2. Identify stale items and oversized tickets.
3. Gather blockers and due-date risks.

### Phase 2: Reprioritize and Rescope
1. Re-rank backlog by value, urgency, and dependency risk.
2. Split oversized tickets into executable slices.
3. Move deferred items out of active milestone scope.

### Phase 3: Publish Decisions
1. Update board and issue metadata to match decisions.
2. Record triage summary and ownership changes.
3. Confirm next focus queue for execution.

---

## Completeness Checklist
- □ Top backlog queue is reprioritized and current.
- □ Stale/oversized tickets were split, deferred, or closed.
- □ Blockers and milestone risks are documented with owners.

## Rules
1. **ALWAYS** run triage on a fixed weekly cadence.
2. **ALWAYS** document rationale for priority changes.
3. **NEVER** leave stale in-progress work unresolved after triage.
4. **NEVER** keep milestone scope unchanged when deadline risk is clear.
