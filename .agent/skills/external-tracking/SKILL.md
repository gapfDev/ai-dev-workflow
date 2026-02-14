---
name: external-tracking
description: How to support non-GitHub tracking systems (Jira, Linear, Trello, Asana) via manual sync
---

# External Tracking

Skill for integrating with external project management tools (Jira, Linear, Trello, Asana) where the agent cannot directly manipulate the board via CLI.

## Input
- A project tracked in an external system
- A local `BACKLOG.md` that mirrors the current sprint

## Output
- Correctly named branches and PRs linking to external tickets
- Manual sync instructions for the human user

---

## The "Manual Sync" Pattern

Since the agent cannot click buttons in Jira/Linear/Trello, it relies on **Ticket IDs** and **Human Sync**.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  EXTERNAL    │    │   LOCAL     │     │   AGENT     │
│  SYSTEM      │◀──▶│  BACKLOG.md │◀──▶│   WORK      │
│ (Source of   │    │ (Mirror)    │     │ (Execution) │
│  Truth ID)   │    │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Phase 1: Setup

1. **Get the Ticket ID format:**
   - Jira: `PROJ-123`
   - Linear: `LIN-123`
   - Trello: `#123` (card number)

2. **Update `BACKLOG.md`:**
   Ensure every item in local backlog has the **External ID**.

   ```markdown
   ## Sprint 1
   - [ ] [PROJ-101] User Login
   - [ ] [PROJ-102] Dashboard
   ```

## Phase 2: Execution Workflow

### Step 1: Start Work
1. **Agent:** Reads `BACKLOG.md`, picks `[PROJ-101] User Login`.
2. **Agent:** Creates branch `codex/PROJ-101-user-login`.
3. **Agent:** Asks user: *"I am starting PROJ-101. Please move it to **In Progress** in [Jira/Linear]."*

### Step 2: Implementation
- **Agent:** Implements code + tests (TDD).
- **Agent:** Commits with ID in message: `feat: [PROJ-101] implemented login logic`.

### Step 3: Pull Request
- **Agent:** Opens PR in GitHub (for code review).
- **PR Title:** `[PROJ-101] User Login Implementation`.
- **PR Description:**
  ```markdown
  ## Ticket
  [Link to Jira/Linear ticket]

  ## Summary
  ...
  ```

### Step 4: Finish
1. **Agent:** Asks user: *"PR #5 created. Please move PROJ-101 to **Review/QA** in [Jira/Linear]."*
2. **Human:** Reviews PR, merges, and updates external ticket to **Done**.

---

## Platform Specifics

### Jira
- **Branch:** `feature/PROJ-123-brief-description`
- **Commit:** `[PROJ-123] message`
- **Smart Commits:** If enabled, use `PROJ-123 #comment task done` in commit message (optional).

### Linear
- **Branch:** `linear/prom-123-feature-name` (Linear can auto-link this)
- **PR:** Include `Closes LINEAR-123` in description if integration enabled.

### Trello
- **Link:** Paste Trello card URL in PR description.
- **Power-Up:** If GitHub Power-Up enabled, attach PR to card manually.

---

## Rules
1. **ALWAYS** use the External ID in branch names and commit messages
2. **ALWAYS** ask the human to update the external status (Don't assume integration exists)
3. **NEVER** invent a fake ID — if missing, ask the user
4. **NEVER** mix multiple external tickets in one branch (unless clearly stated)
