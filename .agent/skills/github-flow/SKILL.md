---
name: github-flow
description: How to detect GitHub CLI and set up a full GitHub-based development workflow
---

# GitHub Flow

Skill for detecting `gh` CLI availability, setting up GitHub Projects, and managing the full development lifecycle through GitHub Issues, branches, and PRs.

## Input
- A repository (local, already initialized)
- A backlog of tickets to create as issues (optional — can be used standalone)
- **Constraint**: All content (Issues, PRs, Comments, Epics) MUST be in English.

## Output
- GitHub Project board configured with labels and columns
- Issue and PR templates installed in the repo
- Full workflow from issue creation → merge → auto-close

---

## Phase 0: Detect GitHub CLI

Run this check **first**, before anything else:

```bash
# Check if gh is installed
gh --version

# Check if authenticated
gh auth status
```

| Result | Action |
|--------|--------|
| `gh` not installed | Inform user: "GitHub CLI not found. Install with `brew install gh` or skip GitHub integration." |
| `gh` installed but not authenticated | Run `gh auth login` with user |
| `gh` installed and authenticated | ✅ Proceed — ask user if they want GitHub integration |

### Ask the User

```
GitHub CLI detected ✅
Would you like to use GitHub for project management?

If yes, I will set up:
  □ Project board with columns (Backlog → Ready → In Progress → Review → Done)
  □ Labels for priority, type, and complexity
  □ Issue template (auto-filled from backlog tickets)
  □ PR template (linked to issues)
  □ Branch naming convention: codex/<ticket-id>-<short-name>

Proceed? [yes/no]
```

---

## Phase 1: Set Up Project Board

### Create GitHub Project

```bash
# Create a new project (v2 — table/board)
gh project create --title "[PROJECT_NAME] Board" --owner @me
```

### Columns (Status Field)

| Column | When |
|--------|------|
| **Backlog** | Ticket created, not yet planned |
| **Ready** | Planned for current sprint, ready to pick up |
| **In Progress** | Developer is actively working on it |
| **In Review** | PR opened, waiting for review |
| **Done** | PR merged, issue closed |

### Labels

Create these labels in the repo:

```bash
# Priority labels
gh label create "priority: must"   --color "B60205" --description "MVP - Required"
gh label create "priority: should" --color "D93F0B" --description "Important, not blocking"
gh label create "priority: could"  --color "FBCA04" --description "Nice to have"

# Type labels
gh label create "type: feature"    --color "0E8A16" --description "New feature"
gh label create "type: bug"        --color "D73A4A" --description "Bug fix"
gh label create "type: chore"      --color "E4E669" --description "Maintenance / config"
gh label create "type: docs"       --color "0075CA" --description "Documentation"

# Complexity labels
gh label create "size: S"  --color "C2E0C6" --description "~2-4 hours"
gh label create "size: M"  --color "BFD4F2" --description "~4-8 hours"
gh label create "size: L"  --color "D4C5F9" --description "~1-2 days"
gh label create "size: XL" --color "F9D0C4" --description "~2-4 days (consider splitting)"

# Status labels
gh label create "status: blocked"    --color "000000" --description "Blocked by dependency"
gh label create "status: ready"      --color "0E8A16" --description "Ready to pick up"
```

---

## Phase 2: Install Templates

Copy the templates from `templates/` into the repo:

```bash
# Create template directories
mkdir -p .github/ISSUE_TEMPLATE
mkdir -p .github

# Copy templates
cp templates/ISSUE_TEMPLATE.md .github/ISSUE_TEMPLATE/feature.md
cp templates/PULL_REQUEST_TEMPLATE.md .github/PULL_REQUEST_TEMPLATE.md
```

---

## Phase 3: Create Issues from Backlog

For each ticket in the backlog:

```bash
gh issue create \
  --title "[EPIC-XX] Ticket Title" \
  --body "$(cat <<'EOF'
## User Story
**As a** [user] **I want** [action] **so that** [benefit]

## Acceptance Criteria
- [ ] Given ___, when ___, then ___
- [ ] Given ___, when ___, then ___

## Definition of Done
- [ ] Code implemented
- [ ] Unit tests written and passing
- [ ] No lint warnings/errors
- [ ] PR approved and merged

## Technical Notes
[notes from backlog]

## Dependencies
Blocked by: #XX (if applicable)
EOF
)" \
  --label "priority: must,type: feature,size: M"
```

---

## Phase 4: Development Workflow (per ticket)

The full lifecycle of a single ticket:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. PICK     │────▶│  2. BRANCH   │────▶│  3. CODE     │
│  Move issue  │     │  Create from │     │  Implement   │
│  → Ready     │     │  main        │     │  with TDD    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
┌─────────────┐     ┌─────────────┐     ┌──────▼──────┐
│  6. MERGE    │◀────│  5. REVIEW   │◀────│  4. PR       │
│  Squash      │     │  1 approval  │     │  Open linked │
│  Auto-close  │     │  Checks pass │     │  to issue    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Step 1: Pick Issue
```bash
# Move to In Progress (if using project board)
# Assign to yourself
gh issue edit <NUMBER> --add-assignee @me
```

### Step 2: Create Branch
```bash
# Branch naming convention: codex/<ticket-id>-<short-name>
git checkout -b codex/EPIC1-01-order-entry main
```

### Step 3: Implement with TDD
Use the `tdd-workflow` skill. Code + tests in the same branch.

### Step 4: Open Pull Request
```bash
gh pr create \
  --title "[EPIC1-01] Order entry screen" \
  --body "$(cat <<'EOF'
## Summary
Brief description of what this PR implements.

## Related Issue
Closes #XX

## Changes
- [ ] Feature X implemented
- [ ] Tests written and passing
- [ ] No lint warnings

## Testing
How to test this PR:
1. Step 1
2. Step 2

## Screenshots
(if UI changes)
EOF
)" \
  --base main
```

### Step 5: Review & Checks

**For Worker Agents:**
```bash
# Check CI status
gh pr checks <NUMBER>

# Request review from Manager/Lead
gh pr review <NUMBER> --request
```

**For Manager Agents:**
```bash
# List open PRs
gh pr list

# View a specific PR (diff and body)
gh pr view <NUMBER>

# Approve changes (after reading diff)
gh pr review <NUMBER> --approve -b "Good job, checks passing."
```

| Check | Must Pass |
|-------|-----------|
| Build | ✅ |
| Tests | ✅ |
| Lint | ✅ |
| 1 approval | ✅ |

### Step 6: Merge
```bash
# Squash merge (clean history)
gh pr merge <NUMBER> --squash --delete-branch
```

The `Closes #XX` in the PR body will **auto-close** the issue and move it to **Done**.

---

## Phase 5: Project Board Management

Keep the board up to date so agents and humans know the status.

### Option A: Automation (Recommended)
Configure the Project Board workflows to move items automatically:
1. **To Todo:** When item is added to project
2. **To In Progress:** When issue is assigned or PR linked
3. **To Done:** When issue is closed or PR merged

### Option B: Manual CLI
If automation is not set up, use these commands:

```bash
# 1. List items to get ID
gh project item-list <PROJECT_NUMBER> --owner @me

# 2. Move item
gh project item-edit \
  --id <ITEM_ID> \
  --field-id <STATUS_FIELD_ID> \
  --single-select-option-id <OPTION_ID> \
  --project-id <PROJECT_ID>
```

> **Note:** The manual CLI for projects is verbose. **Prefer Option A** or simply update the issue status/labels, which usually syncs with the board visually.

---

## Quick Reference

```
╔══════════════════════════════════════════════════════════╗
║  🔄 GITHUB FLOW — QUICK REFERENCE                       ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Branch:  codex/<ticket-id>-<short-name>                 ║
║  PR body: Closes #<issue-number>                         ║
║  Merge:   Squash + delete branch                         ║
║                                                          ║
║  ┌─ LIFECYCLE ───────────────────────────────────────┐   ║
║  │                                                    │   ║
║  │  Backlog → Ready → In Progress → Review → Done    │   ║
║  │     │        │         │            │        │     │   ║
║  │   Create   Sprint    Branch +     Open PR   Merge  │   ║
║  │   Issue    Plan      Code+TDD    + Checks  Squash │   ║
║  │                                                    │   ║
║  └────────────────────────────────────────────────────┘   ║
║                                                          ║
║  Labels: priority:(must|should|could)                    ║
║          type:(feature|bug|chore|docs)                   ║
║          size:(S|M|L|XL)                                 ║
║          status:(blocked|ready)                          ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

---

## 6. Dev Agent Handoff Protocol (Post-Ticket)

When an AI Agent completes a ticket (Step 4/5/6), it MUST perform the following actions to signal completion:

1.  **Update the Task File** (if one exists in `.agent/temp/`):
    - Mark Requirements/DoD as completed `[x]`.
    - Add a "Completion Report" section at the end.

2.  **Create a Completion Signal**:
    - If no task file existed, create a new file: `.agent/temp/report_<TICKET_ID>_complete.md`
    - Content:
      ```markdown
      # Task Complete: [Ticket ID]
      - **PR**: [Link to PR]
      - **Status**: Ready for Review / Merged
      - **Next**: [Suggest next step or wait]
      ```

3.  **Stop & Notify**:
    - The agent should stop execution and allow the Manager Agent (or Human) to review the report and assign the next task.

---

## Rules
1. **ALWAYS** check `gh --version` and `gh auth status` before any GitHub operation
2. **ALWAYS** link PRs to issues with `Closes #XX`
3. **ALWAYS** use squash merge for clean history
4. **ALWAYS** use branch naming: `codex/<ticket-id>-<short-name>`
5. **NEVER** push directly to `main` — always through PRs
6. **NEVER** merge without passing checks (build + tests + lint)
7. If `gh` is not available → fall back to `BACKLOG.md` only workflow
8. **ALWAYS** use English for all GitHub content (Issues, PRs, Epics, Milestones, Comments).
