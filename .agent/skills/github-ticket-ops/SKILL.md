---
name: github-ticket-ops
description: DEPRECATED skill. Keep for backward compatibility only. Use dedicated skills instead: `github-epic-manager`, `github-milestone-manager`, `github-ticket-writer`, `github-board-ops`, and `github-triage-rhythm`.
---

# GitHub Ticket Ops

Deprecated. Do not use this combined skill for new work.

## Input
- Backward-compatibility calls only.
- **Constraint**: Redirect new usage to dedicated per-element skills.

## Output
- Delegation guidance to per-element skills.

---

## Process

### Phase 1: Redirect
1. Route epic tasks to `github-epic-manager`.
2. Route milestone tasks to `github-milestone-manager`.
3. Route ticket authoring tasks to `github-ticket-writer`.
4. Route board operations to `github-board-ops`.
5. Route cadence/triage to `github-triage-rhythm`.

### Phase 2: Confirm Split Usage
1. Verify requested work was split by element.
2. Ensure no new combined-flow tickets depend on this skill.

---

## Completeness Checklist
- □ Request is redirected to dedicated per-element skills.
- □ No new work is executed using this deprecated combined skill.

## Rules
1. **ALWAYS** redirect users to per-element skills for new work.
2. **ALWAYS** preserve this file only for backward compatibility.
3. **NEVER** run new planning workflows from this combined skill.
4. **NEVER** duplicate logic already owned by per-element skills.
