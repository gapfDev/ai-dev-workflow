# AI DEVELOPMENT FLOW — VISUAL PLAN

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        AI DEVELOPMENT FLOW (7 STEPS)                             │
│                                                                                 │
│  📌 Use for: New features or complete projects                                  │
│  ⏱️ Scope:                                                                      │
│     Small feature  → May skip Step 4                                            │
│     Medium feature → All steps                                                  │
│     Large project  → All steps + more sprints                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌── LEGEND ───────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  ROLES:                              HUMAN INTERACTION (🗣️ TALK):              │
│  👤 PM Agent    = Product Manager      High = Active questions to human         │
│  🏗️ Arch Agent  = Architect            Med  = Confirm / Adjust                 │
│  ⚙️ DevOps Agt  = DevOps               Low  = Execute autonomously             │
│  💻 Dev Agent   = Developer            Gate = Approval only (yes/no)            │
│  🔍 Lead Dev    = Tech Lead                                                     │
│  ✅ QA Agent    = Quality Assurance   SYMBOLS:                                  │
│                                        ⛔ = FORBIDDEN at this step              │
│  CONTRACTS:                            📄 = Required deliverable                │
│  📥 = Input (from previous step)       🎯 = Goal / Objective of step            │
│  📤 = Output (to next step)            👉 = Mandatory action                    │
│                                        🛫 = Pre-flight setup actions            │
│                                        🔀 = Handoff point (role change)         │
│  🚫 GLOBAL RULE — BLOCKED:                                                      │
│  If info missing → 1. Ask the human                                             │
│                    2. If no response → Document assumption + mark ⚠️             │
│                    3. NEVER invent data                                          │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─── ⚠️ MANAGER AGENT: WORKFLOW KICKOFF REQUIRED ─────────────────────────────────┐
│                                                                                 │
│  BEFORE starting, announce to the user:                                         │
│                                                                                 │
│  "🎬 WORKFLOW KICKOFF                                                           │
│                                                                                 │
│  I'll guide you through a 7-step development process.                           │
│                                                                                 │
│  We'll go step-by-step, and you'll approve each step before we proceed.         │
│  You can modify, skip, or pause anytime.                                        │
│                                                                                 │
│  First up: Step 1/7 — Product Discovery                                         │
│  • I'll ask ~21 questions about your vision                                     │
│  • Takes ~15-20 minutes                                                         │
│  • Output: PRODUCT_VISION.md                                                    │
│                                                                                 │
│  Timeline estimate: [Small/Medium/Large] = [30-60min / 2-4hrs / Multiple days]  │
│                                                                                 │
│  Ready to begin Step 1?"                                                        │
│                                                                                 │
│  ✅ Wait for user confirmation before proceeding.                               │
│                                                                                 │
│  NOTE: Show full 7-step plan ONLY if user asks "Show me all steps"              │
│  Otherwise, reveal steps progressively (one at a time).                         │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─── USER CONTROL COMMANDS ───────────────────────────────────────────────────────┐
│                                                                                 │
│  Manager Agent MUST recognize these user commands:                              │
│                                                                                 │
│  • "Yes" / "Proceed" / "OK" → Continue to next step                             │
│  • "No" / "Wait" → Pause, ask what to change                                    │
│  • "Modify" / "Change" → Allow edits to current step                            │
│  • "Skip" → Mark step as skipped, proceed to next                               │
│  • "What step?" / "Status?" → Show progress tracker                             │
│  • "Show plan" / "All steps" → Display full 7-step overview                     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─── PROGRESS TRACKER TEMPLATE ───────────────────────────────────────────────────┐
│                                                                                 │
│  Show after EACH step completion:                                               │
│                                                                                 │
│  Progress: [####------] 4/7                                                     │
│                                                                                 │
│  ✅ Step 1: Product Discovery (Done)                                            │
│  ✅ Step 2: Tech Analysis (Done)                                                │
│  ✅ Step 3: Setup & Backlog (Done)                                              │
│  🔄 Step 4: Sprint Planning (Current)                                           │
│  ⏸️ Step 5: Implementation (Pending)                                            │
│  ⏸️ Step 6: Code Review (Pending)                                               │
│  ⏸️ Step 7: QA Validation (Pending)                                             │
│                                                                                 │
│  Next: Sprint Planning → Prioritize tickets with MoSCoW                         │
│  Ready to continue? [Yes/No/Modify]                                             │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─── 📍 STEP TRANSITION: STEP 1 ──────────────────────────────────────────────────┐
│                                                                                 │
│  Manager Agent MUST announce:                                                   │
│                                                                                 │
│  "📍 STEP 1/7: Product Discovery                                                │
│                                                                                 │
│  What we'll do:                                                                 │
│  • Ask 21 structured questions about your vision                                │
│  • Understand features, user flows, and business goals                          │
│  • Create PRODUCT_VISION.md document                                            │
│                                                                                 │
│  Estimated time: 15-20 minutes                                                  │
│                                                                                 │
│  Ready to proceed with Step 1?"                                                 │
│                                                                                 │
│  ⏸️ WAIT for user confirmation (Yes/No/Wait/Modify)                             │
│                                                                                 │
│  AFTER completing Step 1, show:                                                 │
│                                                                                 │
│  "✅ STEP 1/7 COMPLETE: Product Discovery                                       │
│                                                                                 │
│  Summary:                                                                       │
│  - Captured 21 answers about your vision                                        │
│  - Created PRODUCT_VISION.md                                                    │
│  - Identified [X] core features                                                 │
│                                                                                 │
│  Progress: [##--------] 1/7                                                     │
│                                                                                 │
│  Next: Step 2/7 — Tech Analysis                                                 │
│  • Discuss architecture \u0026 tech stack (~10-15 min)                              │
│  • Output: TECH_STRATEGY.md                                                     │
│                                                                                 │
│  Ready to proceed to Step 2? [Yes/No/Modify]"                                   │
│                                                                                 │
│  ⏸️ WAIT for user confirmation before starting Step 2                           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌───────────────────────┐
  │  STEP 1                │
  │  👤 ROLE: PM Agent     │
  │  🗣️ TALK: High         │
  │  💡 VISION / IDEA      │
  │                        │
  │  📥 Input:             │
  │  User's idea           │
  │  (Audio/Video/Img/Txt) │
  │                        │
  │  • Understand features │
  │    and product         │
  │  • Ask a lot           │
  │  • Request A/V/Img     │
  │  ⛔ CODE/ARCHITECTURE  │
  │  🎯 Goal: EVERYTHING   │
  │     ready for Backlog  │
  │  👉 FINAL REVIEW       │
  │     (Nothing missing)  │
  │                        │
  │  📤 Output:            │
  │  📄 PRODUCT_VISION.md  │
  └──────────┬────────────┘
             │
┌────────────▼────────────────────────────────────────────────────────────────┐
│  ✅ STEP 1 COMPLETE — MANDATORY WORK SUMMARY                                │
│                                                                             │
│  Manager Agent MUST show:                                                   │
│                                                                             │
│  "✅ STEP 1/7 COMPLETE: Product Discovery                                   │
│                                                                             │
│  📋 Deliverables Created:                                                   │
│  • PRODUCT_VISION.md (21 questions answered)                                │
│  • [X] core features identified                                             │
│  • [X] user flows documented                                                │
│                                                                             │
│  🎯 Key Features:                                                           │
│  1. [Feature name]                                                          │
│  2. [Feature name]                                                          │
│  3. [etc...]                                                                │
│                                                                             │
│  📝 Key Insights:                                                           │
│  • [Critical requirement, e.g., 'Offline-first required']                  │
│  • [User need, e.g., 'Mobile-optimized UI essential']                      │
│                                                                             │
│  📊 Progress: [##--------] 1/7                                              │
│                                                                             │
│  Next: Step 2/7 — Tech Analysis                                             │
│  • Discuss architecture & tech stack (~10-15 min)                           │
│  • Output: TECH_STRATEGY.md                                                 │
│                                                                             │
│  Ready to proceed to Step 2? [Yes/No/Modify]"                               │
│                                                                             │
│  ⏸️ WAIT for user confirmation before proceeding to Gate 1                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
             │
       ┌─────▼──────────┐
       │ ✅ GATE 1       │
       │ □ Features      │
       │   complete?     │
       │ □ No pending    │
       │   questions?    │
       │ □ User flows    │
       │   documented?   │
       │ □ Design prefs  │
       │   captured?     │
       │ □ Success       │
       │   metrics?      │
       │ □ References/   │
       │   screenshots   │
       │   included?     │
       │                 │
       │ TRACKING:       │
       │ □ manager-log   │
       │   updated?      │
       │ □ User saw work │
       │   summary?      │──── ❌ Missing → 🔄 Back to Step 1
       │ All ✅?         │
       └─────┬──────────┘
             │ ✅ Yes
  ┌──────────▼────────────┐
  │  STEP 2                │
  │  🏗️ ROLE: Arch Agent   │
  │  🗣️ TALK: Med          │
  │  TECHNICAL ANALYSIS    │
  │                        │
  │  📥 Input:             │
  │  PRODUCT_VISION.md     │
  │                        │
  │  • Features -> TECH    │
  │  • How to build it?    │
  │  • Stack defined       │
  │  • Libs/APIs           │
  │  ⛔ CONFIG/REPO        │
  │                        │
  │  📤 Output:            │
  │  📄 TECH_STRATEGY.md   │
  └──────────┬────────────┘
             │
       ┌─────▼──────────┐
       │ ✅ GATE 2       │
       │ □ Stack viable? │
       │ □ Every feature │
       │   has a tech    │
       │   solution?     │
       │ □ Team exp      │
       │   assessed?     │
       │ □ Existing code  │
       │   analyzed?     │
       │ □ Arch pattern   │
       │   chosen?       │──── ❌ Changes ──→ 🔄 Back to Step 2
       │ All ✅?         │
       └─────┬──────────┘
             │ ✅ Yes
  ┌──────────▼────────────┐
  │  STEP 3                │
  │  ⚙️ ROLE: DevOps+PM    │
  │  🗣️ TALK: Med          │
  │  SETUP & BACKLOG       │
  │                        │
  │  📥 Input:             │
  │  PRODUCT_VISION.md     │
  │  + TECH_STRATEGY.md    │
  │                        │
  │  🛫 PRE-FLIGHT:        │
  │  □ Check gh --version  │
  │  □ Check gh auth status│
  │  □ Ask: tracking sys?  │
  │    (GH Issues/Local/   │
  │     Jira/Hybrid)       │
  │  □ Create repo (if new)│
  │  □ Init stack/IDE      │
  │  □ Verify project      │
  │    compiles/runs       │
  │                        │
  │  • Create Tickets      │
  │  • Prioritize          │
  │                        │
  │  📤 Output:            │
  │  Initialized repo      │
  │  + 📄 BACKLOG.md       │
  └──────────┬────────────┘
             │
       ┌─────▼──────────┐
       │ ✅ GATE 3       │
       │ □ Repo compiles?│
       │ □ Tracking sys  │
       │   agreed?       │
       │ □ Tickets have  │
       │   DoD?          │
       │ □ Prioritization│
       │   approved?     │──── ❌ Changes ──→ 🔄 Back to Step 3
       │ All ✅?         │
       └─────┬──────────┘
             │ ✅ Yes
  ┌──────────▼────────────┐
  │  STEP 4                │
  │  📅 ROLE: PM Agent     │
  │  🗣️ TALK: Med          │
  │  PLAN MODE             │
  │                        │
  │  📥 Input:             │
  │  BACKLOG.md            │
  │                        │
  │  • Prioritization      │
  │    (MoSCoW)            │
  │  • Sprints/phases      │
  │  • Dependencies        │
  │  • MVP defined         │
  │                        │
  │  📤 Output:            │
  │  📄 IMPLEMENTATION_    │
  │  PLAN.md               │
  └──────────┬────────────┘
             │
       ┌─────▼──────────┐
       │ ✅ GATE 4       │
       │ □ MVP defined?  │
       │ □ Sprints       │
       │   reasonable?   │
       │ □ Dependencies  │
       │   clear?        │──── ❌ Changes ──→ 🔄 Back to Step 4
       │ All ✅?         │
       └─────┬──────────┘
             │ ✅ Yes

┌─── 🚪 GITHUB GATE (Step 3.5) — MANDATORY BEFORE CODING ─────────────────────┐
│                                                                             │
│  Manager Agent MUST complete BEFORE Step 5 (Implementation):                │
│                                                                             │
│  1. Verify BACKLOG.md + Roadmap exists                                      │
│  2. Create GitHub issues (if gh CLI available):                             │
│     □ 1 issue per functional block                                          │
│     □ Each issue has DoD (Definition of Done)                               │
│     □ Issues labeled (priority/type/size)                                   │
│  3. Create branches:                                                        │
│     □ Format: codex/[issue-#]-[short-name]                                  │
│     □ Link branch to issue                                                  │
│  4. Move first issue to "In Progress"                                       │
│                                                                             │
│  ⚠️ RULE: "implement the plan" = issues + branches FIRST, code SECOND       │
│                                                                             │
│  SHOW: "🚪 GitHub Gate ✅: [X] issues ready, starting #[Y]"                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────▼────────────┐
  │  STEP 5                │
  │  💻 ROLE: Dev Agent    │
  │  🗣️ TALK: Low          │
  │                        │
  │  ┌─ 5a ─────────────┐ │
  │  │ 🤝 WORKFLOW       │ │
  │  │    AGREEMENT      │ │
  │  │ • 1 or N agents?  │ │
  │  │ • Parallel/Tree?  │ │
  │  │ 🗣️ TALK: Med      │ │
  │  └──────────────────┘ │
  │                        │
  │  ┌─ 5b ─────────────┐ │
  │  │ 💻 IMPLEMENT      │ │
  │  │                   │ │
  │  │ 🛫 PRE-FLIGHT:    │ │
  │  │ □ Create branch   │ │
  │  │   codex/<id>-name │ │
  │  │ □ Move issue →    │ │
  │  │   In Progress     │ │
  │  │ □ Verify build OK │ │
  │  │                   │ │
  │  │ • DoD = TDD       │ │
  │  │ > 1 Ticket =      │ │
  │  │   Code + Tests <  │ │
  │  │ 🗣️ TALK: Low      │ │
  │  └──────────────────┘ │
  │                        │
  │  📥 Input:             │
  │  IMPL_PLAN.md          │
  │  + Current ticket      │
  │                        │
  │  📤 Output:            │
  │  Tested Feature        │
  │  (No separate tests)   │
  └──────────┬────────────┘
             │
       ┌─────▼──────────┐
       │ ✅ GATE 5       │
       │ □ Tests pass?   │
       │ □ Meets ticket  │
       │   DoD?          │
       │ □ TDD respected │
       │   (same ticket) │──── ❌ Fails TDD ──→ 🔄 Fix
       │ All ✅?         │
       └─────┬──────────┘
             │ ✅ Yes
  ┌──────────▼────────────┐
  │  STEP 6                │
  │  🔍 ROLE: Lead Dev     │
  │  🗣️ TALK: Gate         │
  │  CODE REVIEW           │
  │                        │
  │  📥 Input:             │
  │  Feature + Tests       │
  │  (code from Step 5)    │
  │                        │
  │  🛫 PRE-FLIGHT:        │
  │  □ PR created and      │
  │    linked (Closes #XX) │
  │  □ CI checks pass      │
  │    (build/tests/lint)  │
  │  □ Branch up to date   │
  │    with main           │
  │                        │
  │  • Code smells         │
  │  • Refactoring         │
  │  • Security            │
  │                        │
  │  📤 Output:            │
  │  Code Approved         │
  │  + Tests Passing       │
  └──────────┬────────────┘
             │
       ┌─────▼──────────┐
       │ ✅ GATE 6       │
       │ □ Tests 100%    │
       │   passing?      │
       │ □ No critical   │
       │   code smells?  │
       │ □ Security OK?  │──── ❌ Issues ──→ 🔄 Back to Step 5/6
       │ All ✅?         │
       └─────┬──────────┘
             │ ✅ Yes
  ┌──────────▼────────────┐
  │  STEP 7                │
  │  ✅ ROLE: QA Agent     │
  │  🗣️ TALK: Med          │
  │  VALIDATION            │
  │                        │
  │  📥 Input:             │
  │  Deployable feature    │
  │  (approved in Step 6)  │
  │                        │
  │  🛫 PRE-FLIGHT:        │
  │  □ Feature builds/runs │
  │    without errors      │
  │  □ Test environment    │
  │    ready (device/emu/  │
  │    browser)            │
  │  □ Latest code merged  │
  │    or branch available │
  │                        │
  │  • Test user flows     │
  │  • Edge cases          │
  │  • Bug report          │
  │                        │
  │  📤 Output:            │
  │  📄 VALIDATION_        │
  │  REPORT.md             │
  └──────────┬────────────┘
             │
       ┌─────▼──────────┐
       │ ✅ GATE 7       │
       │ □ Flows OK?     │
       │ □ Edge cases    │
       │   covered?      │
       │ □ 0 critical    │
       │   bugs?         │──── ❌ Bugs ──→ 🔄 Back to Step 5
       │ All ✅?         │
       └─────┬──────────┘
             │ ✅ Yes
       ┌─────▼─────┐
       │            │
       │  🎉 DONE!  │
       │  Feature   │
       │  Complete  │
       │            │
       └────────────┘
```

## Quick Summary

| Step | Agent Role | Human | 📥 Input | Key Task | 📤 Output |
|------|------------|-------|----------|----------|-----------|
| 1 | 👤 **PM Agent** | 🗣️ High | Idea (A/V/Img/Txt) | Vision + Final Review | `PRODUCT_VISION.md` |
| 2 | 🏗️ **Arch Agent** | 🗣️ Med | `PRODUCT_VISION.md` | Feat → Tech | `TECH_STRATEGY.md` |
| 3 | ⚙️ **DevOps+PM** | 🗣️ Med | Vision + Tech | Tracking + Setup + Tickets | Repo + `BACKLOG.md` |
| 4 | 📅 **PM Agent** | 🗣️ Med | `BACKLOG.md` | Sprints + MVP | `IMPL_PLAN.md` |
| 5a | 💻 **Dev Agent** | 🗣️ Med | `IMPL_PLAN.md` | Agree on agent workflow | Agreement |
| 5b | 💻 **Dev Agent** | 🗣️ Low | Current ticket | TDD: Code + Tests | Tested Feature |
| 6 | 🔍 **Lead Dev** | 🗣️ Gate | Feature + Tests | Code Review + Run Tests | Approved Code |
| 7 | ✅ **QA Agent** | 🗣️ Med | Deployable feature | Functional Validation | `VALIDATION_RPT.md` |

## Skills Reference

Each step has an independent skill with detailed instructions and templates.
Skills are reusable outside this workflow.

| Step | Skill | Location |
|------|-------|----------|
| 1 | Product Discovery | `.agent/skills/product-discovery/` |
| 2 | Tech Analysis | `.agent/skills/tech-analysis/` |
| 3 (Setup) | Project Scaffold | `.agent/skills/project-scaffold/` |
| 3 (Backlog) | Backlog Builder | `.agent/skills/backlog-builder/` |
| 4 | Sprint Planner | `.agent/skills/sprint-planner/` |
| 5 | TDD Workflow | `.agent/skills/tdd-workflow/` |
| 6 | Code Review Checklist | `.agent/skills/code-review-checklist/` |
| 7 | QA Validation | `.agent/skills/qa-validation/` |
| All | Visual Summary | `.agent/skills/visual-summary/` |
| All | GitHub Flow | `.agent/skills/github-flow/` |
| All | Agent Handoff | `.agent/skills/agent-handoff/` |
| All | External Tracking | `.agent/skills/external-tracking/` |
