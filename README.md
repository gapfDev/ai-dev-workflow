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

**Before starting Step 1, use this kickoff announcement:**

```
🎬 WORKFLOW KICKOFF

I'm starting the AI Development Workflow for your [project type].

We'll go through 7 steps:
1. Product Discovery (~21 questions about your vision)
2. Tech Analysis (architecture decisions)
3. Setup & Backlog (create tickets)
4. Sprint Planning (prioritization)
5. Implementation (coding by Dev Agents)
6. Code Review (quality validation)
7. QA Validation (testing)

Timeline estimate: [Small/Medium/Large] = [30-60min / 2-4hrs / Multiple days]

I'll pause at Gates for your approval before major transitions.

Ready to begin with Step 1: Product Discovery?
```

**Wait for user confirmation before proceeding.**

---

## 📖 Full Documentation

1. Review the workflow: `.agent/workflows/ai-dev-flow-plan.md`
2. Use skills as needed for each step
3. Follow the gates to ensure quality at each phase

## 📖 Documentation

All documentation is in English to ensure consistency across teams and AI agents.

## 🤝 Contributing

This framework is designed to evolve. Contributions and improvements are welcome.
