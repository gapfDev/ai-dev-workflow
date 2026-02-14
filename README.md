# AI Development Workflow Framework

A comprehensive, platform-agnostic workflow framework for AI-assisted software development. This framework guides Manager Agents and human developers through a structured 7-step process from vision to validation.

## 🎯 Purpose

This is a **process framework**, not a technology framework. It works for any type of project:
- Mobile apps (Android, iOS)
- Web applications (React, Vue, etc.)
- Backend services (Python, Node, Go, etc.)
- Desktop applications
- CLI tools
- APIs

![Workflow Diagram](images/workflow-diagram.jpg)

## 📋 Workflow Overview

The framework consists of 7 steps with validation gates:

1. **Product Discovery** — Understand the vision and requirements
2. **Tech Analysis** — Map features to technical solutions
3. **Setup & Backlog** — Initialize project and create tickets
4. **Sprint Planning** — Prioritize and organize work
5. **Implementation** — Build features with TDD
6. **Code Review** — Validate quality and standards
7. **QA Validation** — Test user flows and edge cases

## 🛠️ Skills Library

The `.agent/skills/` directory contains reusable, independent skills:

- **product-discovery** — Structured interviews for product vision
- **tech-analysis** — Feature-to-tech mapping
- **backlog-builder** — Ticket creation from requirements
- **sprint-planner** — MoSCoW prioritization
- **project-scaffold** — Project structure setup
- **tdd-workflow** — Test-driven development guide
- **code-review-checklist** — Quality validation
- **qa-validation** — User flow testing
- **github-flow** — GitHub CLI integration
- **external-tracking** — Jira/Linear/Trello support
- **agent-handoff** — Manager-Worker delegation
- **agent-communication** — Multi-agent coordination via shared board
- **manager-log** — Decision tracking for Manager Agents
- **visual-summary** — ASCII art deliverable summaries

## 🚀 Quick Start

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

1. Review the workflow: `.agent/workflows/ai-dev-flow-plan.md`
2. Use skills as needed for each step
3. Follow the gates to ensure quality at each phase

## 📖 Documentation

All documentation is in English to ensure consistency across teams and AI agents.

## 🤝 Contributing

This framework is designed to evolve. Contributions and improvements are welcome.
