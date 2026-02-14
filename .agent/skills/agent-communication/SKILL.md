---
name: agent-communication
description: How to coordinate between multiple AI agents working simultaneously on the same project through a shared message board. Use when agents need to post status updates, log decisions, ask questions, or report blockers.
---

# Agent Communication

Skill for enabling real-time bidirectional communication between multiple AI agents working on the same project through a structured message board.

## Input
- Agent identity (who is posting — e.g., "Manager", "UI Dev", "Backend Dev")
- Message type (status, decision, question, blocker)
- Message content

## Output
- Shared board file at `.agent/temp/board.md` with structured messages
- Message history for audit trail and coordination

---

## When to Use

Use this skill instead of `agent-handoff` when:
- ✅ Multiple agents are working **simultaneously** on the same codebase
- ✅ Agents need to **coordinate decisions** without blocking each other
- ✅ Manager Agent needs **real-time visibility** into worker progress
- ✅ Agents need to **ask questions** and get answers asynchronously

Use `agent-handoff` when:
- Agent A finishes → hands off **complete work** to Agent B (one-way delegation)

---

## Process

### Phase 1: Initialize Board

If `.agent/temp/board.md` doesn't exist, create it from the template:

1. Check if file exists: `ls .agent/temp/board.md`
2. If missing, copy template: use `templates/BOARD_TEMPLATE.md`
3. Replace `{{PROJECT_NAME}}` with actual project name
4. Replace `{{DATE}}` with current date

### Phase 2: Post Message

When you have something to communicate:

1. Read current board state
2. Add your message under the appropriate section:
   - **Status Updates** → When you complete a task or start new work
   - **Decision Log** → When you make an architectural or design choice
   - **Questions** → When you need input from another agent
   - **Blockers** → When you can't proceed without something
3. Use this format:

```markdown
**[Agent Name] — [Time]**
[Your message here]
```

Example:
```markdown
**UI Dev — 2026-02-13 14:30**
✅ Completed login screen. Used MVVM pattern with StateFlow as discussed.
```

### Phase 3: Read Board

Before starting work, check for relevant messages:

1. Read the entire board
2. Look for:
   - Questions addressed to you
   - Blockers that affect your work
   - Decisions that change your approach
3. Respond to questions by posting in the same section
4. Update status if you resolve a blocker

### Phase 4: Archive (Optional)

When work is complete:

1. Move board to `.agent/archive/board-[DATE].md` (for historical reference)
2. Or delete if not needed for audit trail

---

## Message Type Guide

| Type | When to Use | Example |
|------|-------------|---------|
| **Status** | Task complete, starting new work | "✅ Data layer done. Starting UI next." |
| **Decision** | Architectural choice made | "Chose Repository pattern because we need offline support" |
| **Question** | Need input from another agent | "Q for Backend Dev: What's the error handling strategy?" |
| **Blocker** | Can't proceed | "🚫 Blocked: Need API keys before I can test auth flow" |

---

## Completeness Checklist

- □ Board file exists at `.agent/temp/board.md`?
- □ Messages are timestamped and attributed to an agent?
- □ All questions have been answered or acknowledged?
- □ No unresolved blockers remain?
- □ Decision log captures key architectural choices?

---

## Rules

1. **ALWAYS** identify yourself when posting (use your agent role, e.g., "Manager", "UI Dev")
2. **ALWAYS** include a timestamp with your message
3. **ALWAYS** read the board before starting work to check for updates
4. **ALWAYS** respond to questions addressed to you
5. **NEVER** delete other agents' messages — only append
6. **NEVER** use the board for code — use PRs/commits for that
7. **ALWAYS** mark completed tasks with ✅ and blockers with 🚫
8. **ALWAYS** write in English for consistency

---

## Example Board

```markdown
# Agent Communication Board
**Project:** Order Management System
**Started:** 2026-02-13

---

## Status Updates

**Manager — 2026-02-13 10:00**
🚀 Project started. UI Dev: implement login. Backend Dev: set up database.

**UI Dev — 2026-02-13 14:30**
✅ Login screen complete. Used MVVM + StateFlow.

**Backend Dev — 2026-02-13 15:00**
✅ Database schema ready. Repository pattern implemented.

---

## Decision Log

**Manager — 2026-02-13 10:15**
Decision: Use Room for local storage (offline-first requirement).

**UI Dev — 2026-02-13 12:00**
Decision: Dark mode will be default. Light mode in phase 2.

---

## Questions

**UI Dev — 2026-02-13 11:00**
Q for Backend Dev: What's the error format for failed logins?

**Backend Dev — 2026-02-13 11:30**
A: Use `Result<User, AuthError>` wrapper. See `models/Result.kt`.

---

## Blockers

**Backend Dev — 2026-02-13 16:00**
🚫 Blocked: Need Firebase API key to test authentication.

**Manager — 2026-02-13 16:15**
✅ Unblocked: API key sent via Slack. Check `.env` file.
```
