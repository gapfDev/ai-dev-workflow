# Bakery Ops Board (MVP)

Internal bakery operations system built with Google Apps Script + Google Sheets.

## Live Project
- Web App: [Bakery Ops Board](https://script.google.com/macros/s/AKfycby-tdJdLaJQg7jX8M5JkD2L3DpQf7_FhmsnETS3kFu7ttAKbWEgQ5gRIU3SfCeIJUgE/exec)
- URL to open in browser: `https://script.google.com/macros/s/AKfycby-tdJdLaJQg7jX8M5JkD2L3DpQf7_FhmsnETS3kFu7ttAKbWEgQ5gRIU3SfCeIJUgE/exec`
- Latest deployed version: `@73` (2026-02-18)

MVP goals:
- Fast order capture (phone, Facebook, manual, and gradual Square replacement).
- Visual Kanban board optimized for tablet workflow.
- Strict FIFO prioritization by capture time.
- Friendly daily folio numbering.

## Operational Roles
- Order taker
- Cook
- Organizer/Packing
- Dispatch

## Main Features
- Fast order capture with minimum required validation.
- Product selection popup grouped by family with visual color cues.
- Per-line item comments (`details`) in capture with duplicate-row support.
- JSON item comment aliases on import: `details` > `notes` > `comment`.
- Product menu fallback for resiliency (menu remains visible if API products load slowly).
- Product catalog imported from source sheet (`gid=0`) and merged into active menu.
- Kanban ticket comment preview (one-line) with expand/collapse full text.
- Kanban statuses:
  - `Pending`
  - `Working`
  - `Baked`
  - `Delivered`
  - `Cancelled`
- Business rules:
  - `Delivered` is only allowed from `Baked`.
  - `Delivered` cannot be edited (including item comments/line details).
  - `Cancelled` can be reverted only with confirmation.
- Periodic refresh and basic concurrency handling.

## Architecture
- Frontend: `apps-script/Index.html`
- Backend API: `apps-script/Code.gs`
- Admin/operations: `apps-script/Admin.gs`
- Data store: Google Sheets (`Orders`, `Products`, `Expenses`)

## Repository Structure
- `apps-script/`: MVP application code.
- `images/`: reference images.
- `.agent/`: workflow and skills support material.

## Agent Skills
- Single source of truth: `.agent/skills`.
- Bridge script: `.agent/scripts/sync-skills-bridge.sh`.
- Agent standard: `AGENTS.md`.
- Multi-agent GitHub delivery skills:
  - `.agent/skills/gh-dependency-orchestrator`
  - `.agent/skills/gh-ticket-runner`
  - `.agent/skills/git-worktree-runner`
  - `.agent/skills/gh-pr-closeout`
  - `.agent/skills/qa-release-gate`
  - `.agent/skills/milestone-watchdog`
  - `.agent/skills/status-reporter`

Sync for Codex:
```bash
bash .agent/scripts/sync-skills-bridge.sh --mode link --prune
```

Sync for other LLM runtimes (copy mode):
```bash
bash .agent/scripts/sync-skills-bridge.sh --mode copy --prune --dest "<llm_skills_dir>"
```

## Quick Start
1. Open your Apps Script project and load files from `apps-script/`.
2. Set `SPREADSHEET_ID` in Script Properties.
3. Run `adminSetSpreadsheetIdProperty({ spreadsheet_id: "<sheet_id>" })`.
4. Run `adminPrepareEnvironment()`.
5. Run `adminSeedDemoProductsIfEmpty()`.
6. Run `adminRunSmokeTests()`.
7. Publish the Web App (`/exec`) with access set to `Anyone with the link`.

---

## 🚀 Quick Start (Workflow)

### For Developers (First Time)

This workflow guides AI Manager Agents through a 7-step process. Here's what happens:

**When It Starts:**
The AI will announce: *"🎬 Starting AI Development Workflow (Step 1 of 7)"*

**What You'll Do:**
- Answer ~21 questions about your vision (Step 1)
- Discuss tech stack & architecture (Step 2)
- Approve backlog tickets (Gates 1 & 2)
- Review sprint priorities (Step 4)
- Approve code changes (Step 6)
- Validate QA results (Step 7)

**Timeline:**
- **Small feature:** 30-60 min (Steps 1-3 only)
- **Medium feature:** 2-4 hours (All 7 steps)
- **Large project:** Multiple days (Multiple sprints)

**How to Track Progress:**
Ask your AI: *"What step are we on?"* or *"Show me the workflow status"*

---

### For AI Manager Agents

**Before starting, use this kickoff announcement:**

```
🎬 WORKFLOW KICKOFF

I'll guide you through a 7-step development process.

We'll go step-by-step, and you'll approve each step before we proceed.
You can modify, skip, or pause anytime.

First up: Step 1/7 — Product Discovery
• I'll ask ~21 questions about your vision
• Takes ~15-20 minutes
• Output: PRODUCT_VISION.md

Timeline estimate: [Small/Medium/Large] = [30-60min / 2-4hrs / Multiple days]

Ready to begin Step 1?
```

**IMPORTANT:** Show full 7-step plan ONLY if user asks. Otherwise, reveal steps progressively.

**User Control Commands (Recognize These):**

| User Says | Action |
|-----------|--------|
| "Yes" / "Proceed" / "OK" | Continue to next step |
| "No" / "Wait" | Pause, ask what to change |
| "Modify" / "Change" | Allow edits to current step |
| "Skip" | Mark step as skipped, proceed |
| "What step?" / "Status?" | Show progress tracker |
| "Show plan" / "All steps" | Display full 7-step overview |

**After EACH step, show progress tracker:**

```
Progress: [####------] 4/7

✅ Step 1: Product Discovery (Done)
✅ Step 2: Tech Analysis (Done)  
✅ Step 3: Setup & Backlog (Done)
🔄 Step 4: Sprint Planning (Current)
⏸️ Step 5-7: Pending

Next: Sprint Planning → [Brief description]
Ready to continue? [Yes/No/Modify]
```

**Wait for user confirmation before proceeding.**

---

## 📊 How to Track Progress

When working with a Manager Agent, you'll always have visibility into what's being done:

**Tracking Options:**
- **BACKLOG.md** (always created) — Source of truth for all tickets and epics
- **GitHub Issues** (if `gh` CLI available) — Visual board with project management
- **manager-log.md** (always created) — Decision history and status tracking

**What You'll See:**
- 📍 Current step announcements: "Step 3/7: Setup & Backlog"
- 📊 Progress tracker after each step: `[####------] 4/7`
- ✅ Work summaries showing what was accomplished
- 🎫 List of all tickets/epics with acceptance criteria
- 📝 Key decisions logged in `.agent/temp/manager-log.md`

**To Check Status Anytime:**
- Ask: "What step are we on?"
- Ask: "Show me the tickets"
- Ask: "What decisions were made?"
- Read: `.agent/temp/manager-log.md`
- View: `BACKLOG.md` or GitHub Issues board

**Mandatory Tracking:**
The workflow enforces tracking at each step. The Manager Agent cannot proceed without:
- Creating visible deliverables
- Showing work summaries
- Updating the manager log
- Providing clear next steps

**GitHub Gate (Step 3.5):**
Before any code is written, the workflow requires:
- Issues created for all functional blocks
- Each issue has Definition of Done (DoD)
- Branches created and linked to issues
- Issue moved to "In Progress"

**Rule:** If someone says "implement the plan," the Manager will create issues + branches FIRST, then code.

You'll never be left wondering what was done or what's next.

---

## 📖 Full Documentation

Detailed docs:
- `apps-script/README.md`
- `apps-script/DEPLOYMENT_CHECKLIST.md`
- `docs/standards.md`
- `docs/api-contract.md`
- `docs/adr/ADR-001-modular-architecture.md`
- `docs/dod.md`
- `docs/runbooks/deploy-rollback.md`
- `docs/runbooks/incident-triage.md`
- `docs/ownership/module-owners.md`
- `docs/templates/ticket-template.md`
- `docs/performance/README.md`
- `docs/performance/execution-order.md`
- `docs/performance/phases/`
- `docs/performance/contracts/`
- `docs/performance/benchmarks/`
- `docs/performance/rollout/`
- `docs/performance/final-handoff.md`

## Automated QA
From `apps-script/`:
```bash
python3 qa_e2e.py --api-base "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec" --local-dir "$(pwd)"
```

Latest verified run:
- Passed: `25`
- Failed: `0`

Loading UX release gate (Milestone 4):
- Decision date: `2026-02-17`
- Decision: `NO-GO`
- Blocking finding: `LUX-BLOCKER-001` (board interaction degraded by near-continuous busy overlay under polling)
- Evidence: `docs/qa/issue-57-loading-ux-qa-report.md`

Item comments release validation:
- Decision date: `2026-02-17`
- Decision: `GO`
- Evidence: `docs/qa/issue-73-item-comments-qa-report.md`

Catalog sync status:
- Source: `18hvcTtVil8Yc9hO9NYanGo6-qJVJ1iPf9gFXGcyFoII` (`gid=0`)
- Products active in menu: `15`

## Security
- Do not commit hardcoded IDs or tokens.
- Keep secrets only in Script Properties or git-ignored local files.
- Local template: `apps-script/private.local.json.example`.
