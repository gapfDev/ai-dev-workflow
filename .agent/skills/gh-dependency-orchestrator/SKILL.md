---
name: gh-dependency-orchestrator
description: Orchestrate GitHub issue dependency execution across multiple agents with explicit start gates, unblock signals, and progress transitions. Use when a milestone has chained tickets and agents must start only after dependency tickets are closed.
---

# GitHub Dependency Orchestrator

Control multi-agent execution using issue dependency gates as the source of truth.

## Input
- Repo slug (for example: `owner/repo`).
- Ticket dependency map (`blocked by` relationships).
- Agent ownership map (`agent:*` labels).
- **Constraint**: Never start a ticket while any dependency is open.

## Output
- Ordered run plan by dependency wave.
- Start/unblock instructions per agent.
- Governance-safe state transitions (blocked -> ready -> in progress -> done).

---

## Process

### Phase 1: Build the Execution Graph
1. Collect the active milestone tickets.
2. Capture explicit dependency links for every ticket.
3. Validate there are no cycles in the dependency graph. Attempt to produce a topological ordering of the tickets. If a valid ordering cannot be produced, the graph contains a cycle. Report the cycle to the Manager and **HALT** execution until the cycle is resolved by restructuring the tickets.

### Phase 2: Gate and Unblock Execution
1. Mark tickets with open dependencies as blocked.
2. When dependencies close, mark the child ticket as ready.
3. Emit a short "UNBLOCKED: start now" instruction to the assigned agent.

### Phase 3: Maintain Run Integrity
1. Verify each in-progress ticket has a `STARTED` comment.
2. Detect stale blocked tickets and request an owner update.
3. Keep milestone-level summary up to date (done/open/blocked counts).

---

## Completeness Checklist
- □ Every active ticket has explicit dependency status.
- □ No agent is running a ticket with unresolved dependencies.
- □ Unblock messages and state transitions are visible in GitHub comments.

## Rules
1. **ALWAYS** treat dependency links as the execution gate.
2. **ALWAYS** notify the correct agent when a ticket becomes ready.
3. **NEVER** allow manual queue jumping that violates dependencies.
4. **NEVER** declare milestone ready for QA while prerequisite tickets are still open.
