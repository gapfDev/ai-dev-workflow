---
name: status-reporter
description: Produce concise operational status reports for multi-agent delivery including done/open/blocked counts, dependency bottlenecks, and immediate next actions. Use for periodic stakeholder updates during milestone execution.
---

# Status Reporter

Generate a short and actionable execution report for stakeholders and orchestration agents.

## Input
- Milestone ticket list and states.
- Dependency map and current bottlenecks.
- Latest PR and issue activity.
- **Constraint**: Keep report concise and action-first.

## Output
- Current progress snapshot.
- Bottleneck and blocker summary.
- Immediate next actions by agent.

---

## Process

### Phase 1: Gather Current State
1. Count closed/open/blocked tickets.
2. Identify recently changed tickets and PRs.
3. Detect dependency bottlenecks.

### Phase 2: Build Action Report
1. Summarize progress in one block.
2. Highlight who is waiting on what.
3. List next actions in dependency order.

### Phase 3: Publish and Follow-up
1. Post or share the status update.
2. Include time of snapshot and scope.
3. Trigger follow-up when blockers persist.

---

## Completeness Checklist
- □ Report includes done/open/blocked numbers.
- □ Report identifies current bottleneck ticket(s).
- □ Report lists concrete next actions per agent.

## Rules
1. **ALWAYS** include timestamp and scope in each report.
2. **ALWAYS** connect blockers to exact dependency tickets.
3. **NEVER** publish narrative-only reports without actions.
4. **NEVER** mix historical and current status without clear separation.
