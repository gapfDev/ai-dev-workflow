---
name: milestone-watchdog
description: Monitor milestone execution health by detecting stale tickets, blocked queues, missing ownership signals, and timeline risk. Use during active delivery windows to keep work moving and escalate risks early.
---

# Milestone Watchdog

Continuously monitor milestone flow and escalate coordination issues before they become delivery risk.

## Input
- Milestone id/name.
- Active issue list with labels and updated timestamps.
- Risk thresholds (stale minutes/hours, blocked timeout).
  - **Defaults if not configured**: `STALE_TICKET_HOURS = 4`, `BLOCKED_ESCALATION_HOURS = 2`
- **Constraint**: Escalate objective risk before due date slippage occurs.

## Output
- Milestone health snapshot.
- Escalation list for blocked/stale tickets.
- Action recommendations by agent and priority.

---

## Process

### Phase 1: Collect Health Signals
1. List open issues in milestone.
2. Detect missing operational comments (`STARTED`, `BLOCKED`, `DONE`).
3. Detect stale tickets beyond threshold.

### Phase 2: Classify Risk
1. Mark blocking tickets that gate multiple children.
2. Mark tickets with no owner signals.
3. Mark due-date risk based on remaining open critical tickets.

### Phase 3: Escalate and Track
1. Publish concise escalation comment/report.
2. Request explicit next action from blocked owners.
3. Re-check on next interval and compare trend.

---

## Completeness Checklist
- □ Stale and blocked tickets are identified with thresholds.
- □ Escalation actions are assigned to specific owners.
- □ Risk trend is updated at each check.

## Rules
1. **ALWAYS** escalate blockers with explicit owner and next step.
2. **ALWAYS** separate operational risk from implementation detail.
3. **NEVER** wait for due-date breach before warning.
4. **NEVER** report status without actionable next steps.
