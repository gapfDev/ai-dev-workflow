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
│  🔍 Lead Dev    = Tech Lead            🔕 Silent = Auto-execute (Delegate mode) │
│  ✅ QA Agent    = Quality Assurance                                             │
│                                        SYMBOLS:                                 │
│  CONTRACTS:                            ⛔ = FORBIDDEN at this step              │
│  📥 = Input (from previous step)       📄 = Required deliverable                │
│  📤 = Output (to next step)            🎯 = Goal / Objective of step            │
│  👉 = Mandatory action                 🔀 = Role change / Handoff               │
│  🛫 = Pre-flight setup actions         ⚙️ = Circuit Breaker (Halt if 3 errors)  │
│  🚫 GLOBAL RULE — BLOCKED:                                                      │
│  If info missing → 1. Ask the human                                             │
│                    2. If no response → Document assumption + mark ⚠️             │
│                    3. NEVER invent data                                          │
│                                                                                 │
│  🧠 GLOBAL RULE — THE ILLEGIBILITY RULE & PERSONA PREFIXING:                    │
│  If it's not in the repo, it doesn't exist. All chat decisions MUST be          │
│  written to docs/ or .agent/. Never rely on chat memory for architecture.       │
│  When logging decisions in a shared doc (like MANAGER_LOG.md), ALWAYS           │
│  prefix with your persona (e.g., "🤖 [QA Agent]:", "🤖 [Security Agent]:").     │
│                                                                                 │
│  🔒 GLOBAL RULE — USER DATA:                                                    │
│  When analyzing security, ALWAYS consider ALL user-provided                      │
│  data vectors (text, images, files, location). Not just                          │
│  API endpoints.                                                                  │
│                                                                                 │
│  📛 GLOBAL RULE — STRICT FILENAME ENFORCEMENT:                                  │
│  Artifact filenames are STATED PROTOCOL. NEVER abbreviate or change them.       │
│  Examples: `VALIDATION_REPORT.md` must never be `VALIDATION_REP.md`.            │
│  `SECURITY_RELEASE_SIGNOFF.md` must never be `SECURITY_SIGNOFF.md`.             │
│                                                                                 │
│  🪂 GLOBAL RULE — EXPLICIT FALLBACKS (LOCAL TRIAGE):                            │
│  If a core tool (like `gh` CLI) is unavailable, DO NOT perform a silent         │
│  fallback. You MUST create a local sub-ticket (e.g., .agent/issues/ERR-001.md)  │
│  documenting the issue. In Step 4 (Sprint Planner), convert all local issues    │
│  into `BACKLOG.md` tasks or actual GitHub issues.                               │
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
│  We'll go step-by-step, but you'll only need to explicitly approve the          │
│  major milestones (Gates 1, 4, and 7). I will execute intermediate steps        │
│  autonomously unless you ask me to pause.                                       │
│                                                                                 │
│  First up: Step 1/7 — Product Discovery & Strategy                              │
│  • I will act as a 'Relentless Architect', asking an exhaustive number          │
│    of questions to extract every assumption and blind spot before we build.     │
│  • Output: PRODUCT_VISION.md (or REVERSE_ENGINEERING_REPORT.md)                 │
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
│  Show after EACH phase completion (specifically at Gates 1, 4, and 7):          │
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
│  "📍 STEP 1/7: Product Discovery & Strategy                                     │
│                                                                                 │
│  What we'll do:                                                                 │
│  • Determine if this is a Greenfield (New) or Brownfield (Legacy) project.      │
│  • Check Platform Constraints (e.g., App Store Guidelines).                     │
│  • I will act as a 'Relentless Architect', asking an absurd amount of           │
│    questions to extract every assumption and blind spot before we build.        │
│  • Create PRODUCT_VISION.md (or REVERSE_ENGINEERING_REPORT.md for legacy).      │
│                                                                                 │
│  Ready to proceed with Step 1?"                                                 │
│                                                                                 │
│  ⏸️ WAIT for user confirmation (Yes/No/Wait/Modify)                             │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌───────────────────────┐
  │  STEP 1                │
  │  👤 ROLE: Relentless PM│
  │  🗣️ TALK: High         │
  │  💡 PRODUCT DISCOVERY  │
  │                        │
  │  📥 Input:             │
  │  User's idea           │
  │                        │
  │  • Greenfield/Brownfield│
  │    Check.              │
  │  • Platform Constraints.│
  │  • Interrogate idea    │
  │    ruthlessly. Leave no│
  │    stone unturned.     │
  │  ⛔ CODE/ARCHITECTURE  │
  │  🎯 Goal: Zero unknown │
  │     assumptions.       │
  │  👉 FINAL REVIEW       │
  │     (Wait for human OK)│
  │                        │
  │  📤 Output:            │
  │  📄 PRODUCT_VISION.md  │
  │  (or REVERSE_ENG.md)   │
  └──────────┬────────────┘
             │
┌────────────▼────────────────────────────────────────────────────────────────┐
│  ✅ STEP 1 COMPLETE — MANDATORY WORK SUMMARY                                │
│                                                                             │
│  Manager Agent MUST show:                                                   │
│                                                                             │
│  "✅ STEP 1/7 COMPLETE: Product Discovery & Strategy                        │
│                                                                             │
│  📋 Deliverables Created:                                                   │
│  • PRODUCT_VISION.md (or REVERSE_ENG.md) completed after interrogation      │
│  • [X] core features identified                                             │
│  • [X] workflows or boundaries documented                                   │
│                                                                             │
│  🎯 Key Elements:                                                           │
│  1. [Element name]                                                          │
│  2. [Element name]                                                          │
│  3. [etc...]                                                                │
│                                                                             │
│  📝 Key Insights/Blindspots Uncovered:                                      │
│  • [Critical constraint or assumption corrected]                            │
│  • [Platform limitation acknowledged]                                       │
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
       │ □ If UI project:│
       │   Design mockups│
       │   approved and  │
       │   locked?       │
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
  │  🛡️ + Security Agent   │
  │  🗣️ TALK: Med          │
  │  TECH ANALYSIS         │
  │                        │
  │  📥 Input:             │
  │  PRODUCT_VISION.md     │
  │                        │
  │  • Act as Architect.   │
  │  • Select QA Paradigm: │
  │    (TDD, Evals, Golden │
  │     Master).           │
  │  • STRUCTURAL GATE:    │
  │    Define DB Schema &  │
  │    API Contracts NOW.  │
  │  • Threat model + LLM  │
  │    OWASP check.        │
  │  ⛔ CONFIG/REPO        │
  │                        │
  │  📤 Output:            │
  │  📄 TECH_STRATEGY.md   │
  │  + 📄 SCHEMA.md        │
  │  + 📄 SECURITY_MODEL.md│
  └──────────┬────────────┘
             │
       ┌─────▼──────────┐
       │ ✅ GATE 2 (Auto) │
       │ □ Stack viable? │
       │ □ Every feature │
       │   has a tech    │
       │   solution?     │
       │ □ Team exp      │
       │   assessed?     │
       │ □ Existing code  │
       │   analyzed?     │
       │ □ Arch pattern   │
       │   chosen?       │
       │ □ Threat model  │
       │   complete?     │
       │ □ Risks ranked  │
       │   P0-P3?        │──── ❌ Changes ──→ 🔄 Back to Step 2
       │ All ✅? Proceed │
       └─────┬──────────┘
             │ ✅ Yes
             │
┌─── 🛡️ SECURITY GATE A (After Step 2) ───────────────────────────────────────┐
│                                                                             │
│  Required before entering Step 3:                                           │
│  □ Attack surface documented                                                 │
│  □ Sensitive data paths identified                                           │
│  □ Mitigations defined for critical/high risks                               │
│                                                                             │
│  If not complete: return to Step 2.                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────▼────────────┐
  │  STEP 3                │
  │  ⚙️ ROLE: DevOps+PM    │
  │  🗣️ TALK: Med          │
  │  SCAFFOLD & BACKLOG    │
  │                        │
  │  📥 Input:             │
  │  VISION + STRATEGY +   │
  │  SECURITY_MODEL        │
  │                        │
  │  🛫 PRE-FLIGHT:        │
  │  • Scaffold project    │
  │    (Init repo, isolate │
  │    secrets & envs).    │
  │                        │
  │  • Create Tickets      │
  │  • Create security     │
  │    backlog tickets     │
  │                        │
  │  📤 Output:            │
  │  Bootstrapped Repo     │
  │  + 📄 AGENTS.md        │
  │    (via generator)     │
  │  + 📄 BACKLOG.md       │
  │  + 📄 SECURITY_        │
  │    BACKLOG.md          │
  └──────────┬────────────┘
             │
       ┌─────▼──────────┐
       │ ✅ GATE 3 (Auto) │
       │ □ Repo compiles?│
       │ □ Tracking sys  │
       │   agreed?       │
       │ □ Tickets have  │
       │   DoD?          │
       │ □ Security      │
       │   tickets ready?│
       │ □ Prioritization│
       │   approved?     │──── ❌ Changes ──→ 🔄 Back to Step 3
       │ All ✅? Proceed │
       └─────┬──────────┘
             │ ✅ Yes
  ┌──────────▼────────────┐
  │  STEP 4                │
  │  📅 ROLE: PM Agent     │
  │  🗣️ TALK: Med          │
  │  SPRINT PLANNER        │
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
       │ All ✅? WAIT HD │
       │ (Human Direct)  │
       └─────┬──────────┘
             │ ✅ Yes
             │
┌─── 🚪 GITHUB GATE (Step 3.5) — MANDATORY BEFORE CODING ─────────────────────┐
│                                                                             │
│  Manager Agent MUST complete BEFORE Step 5 (Implementation):                │
│                                                                             │
│  1. Create structured backlog tickets.                                      │
│  2. Execute coding tickets (create branch, write code, run TDD).            │
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
  │ 🤝 WORKFLOW       │ │
  │    AGREEMENT      │ │
  │ • Coordinate      │ │
  │   communication   │ │
  │   between agents  │ │
  │   if > 1 active.  │ │
  │ 🗣️ TALK: Low      │ │
  └──────────────────┘ │
  │                        │
  │  ┌─ 5b ─────────────┐ │
  │  │ 💻 GH TICKET      │ │
  │  │    RUNNER        │ │
  │  │ 🛫 PRE-FLIGHT:    │ │
  │  │ □ Create branch   │ │
  │  │   codex/<id>-name │ │
  │  │ □ Move issue →    │ │
  │  │   In Progress     │ │
  │  │ □ Verify build OK │ │
  │  │ □ Apply security  │ │
  │  │   checklist       │ │
  │  │                   │ │
  │  │ • DoD = TDD       │ │
  │  │ • Auto-fix tests  │ │
  │  │   locally before  │ │
  │  │   PR review.      │ │
  │  │ 🗣️ TALK: 🔕 Silent│ │
  │  └──────────────────┘ │
  │                        │
  │  📥 Input:             │
  │  IMPLEMENTATION_PLAN.md│
  │  + Current ticket      │
  │                        │
  │  📤 Output:            │
  │  Tested Feature        │
  │  (No separate tests)   │
  └──────────┬────────────┘
             │
       ┌─────▼──────────┐
       │ ✅ GATE 5 (Auto) │
       │ □ Tests pass?   │
       │ □ Meets ticket  │
       │   DoD?          │
       │ □ TDD respected │
       │   (same ticket) │──── ❌ Fails TDD ──→ 🔄 Fix (⚙️ Halt after 3x)
       │ All ✅? Proceed │
       └─────┬──────────┘
             │ ✅ Yes
  ┌──────────▼────────────┐
  │  STEP 6                │
  │  🔍 ROLE: Lead Dev     │
  │  🛡️ + Security Agent   │
  │  🗣️ TALK: Gate         │
  │  CODE REVIEW CHECKLIST │
  │                        │
  │  📥 Input:             │
  │  Feature + Tests       │
  │  (code from Step 5)    │
  │                        │
  │  🛫 PRE-FLIGHT:        │
  │  • Execute code        │
  │    review checklist.   │
  │  • Verify CI pass      │
  │                        │
  │  • Security review     │
  │    requested/done      │
  │                        │
  │  📤 Output:            │
  │  Code Approved         │
  │  + Tests Passing       │
  │  + 📄 SECURITY_REVIEW_ │
  │    REPORT.md           │
  └──────────┬────────────┘
             │
       ┌─────▼──────────┐
       │ ✅ GATE 6 +     │
       │    SECURITY B   │
       │ □ Tests 100%    │
       │   passing?      │
       │ □ No critical   │
       │   code smells?  │
       │ □ No open P0/P1 │
       │   security risk?│
       │ □ Security OK?  │──── ❌ Issues ──→ 🔄 Back to Step 5/6
       │ All ✅? Wait HD │
       └─────┬──────────┘
             │ ✅ Yes
  ┌──────────▼────────────┐
  │  STEP 7                │
  │  ✅ ROLE: QA Agent     │
  │  🛡️ + Security Agent   │
  │  🗣️ TALK: Med          │
  │  QA VALIDATION & RELEASE
  │                        │
  │  📥 Input:             │
  │  Deployable feature    │
  │                        │
  │  🛫 PRE-FLIGHT:        │
  │  □ Hardware/External   │
  │    Check? If yes →     │
  │    Pause for Human QA. │
  │  □ Env ready           │
  │                        │
  │  • Run Chosen Paradigm │
  │    (TDD/Evals/Golden)  │
  │  • Security regression │
  │  • Explicit Deployment │
  │    Strategy (BlueGreen/│
  │    DarkLaunch/Stores)  │
  │                        │
  │  • Prune obsolete docs │
  │    and clean workspace.│
  │                        │
  │  📤 Output:            │
  │  📄 VALIDATION_REP.md  │
  │  + 📄 SECURITY_SIGNOFF │
  └──────────┬────────────┘
             │
       ┌─────▼──────────┐
       │ ✅ GATE 7 +     │
       │    SECURITY C   │
       │ □ Flows OK?     │
       │ □ Edge cases    │
       │   covered?      │
       │ □ 0 critical    │
       │   bugs?         │
       │ □ Security      │
       │   sign-off GO?  │──── ❌ Bugs/Risk ──→ 🔄 Back to Step 5
       │ All ✅? WAIT HD │
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
| 1 | 👤 **Relentless PM** | 🗣️ High | Idea | Greenfield/Brownfield check + Interrogate ruthlessly to extract blind spots | `PRODUCT_VISION.md` / `REVERSE_ENG.md` |
| 2 | 🏗️ **Arch Agent + Security Agent** | 🗣️ Med | `PRODUCT_VISION.md` | Select QA Paradigm + Define DB Schema/Contract + Threat Model | `TECH_STRATEGY.md` + `SCHEMA.md` + `SECURITY_MODEL.md` |
| 3 | ⚙️ **DevOps+PM (+Security input)** | 🗣️ Low | Vision + Tech + Security model | Isolate metaprojects + Env Bootstrap + Issue Tracking | Repo + `BACKLOG.md` + `SECURITY_BACKLOG.md` |
| 4 | 📅 **PM Agent** | 🗣️ Gate | `BACKLOG.md` | Sprints + MVP | `IMPLEMENTATION_PLAN.md` |
| 5a | 💻 **Dev Agent** | 🗣️ Low | `IMPLEMENTATION_PLAN.md` | Agree on agent workflow | Agreement |
| 5b | 💻 **Dev Agent** | 🗣️ 🔕 Silent | Current ticket | Selected QA Paradigm Execution (TDD/Evals/Master) | Tested Feature |
| 6 | 🔍 **Lead Dev + Security Agent** | 🗣️ Low | Feature + Tests | Code Review + Security Review | Approved Code + `SECURITY_REVIEW_REPORT.md` |
| 7 | ✅ **QA Agent + Security Agent** | 🗣️ Gate | Deployable feature | Functional + Human QA + Explicit Deployment Strategy | `VALIDATION_REPORT.md` + `SECURITY_RELEASE_SIGNOFF.md` |

### Security Enforcement Rules

- No merge is allowed with open `P0` or `P1` findings (Security Gate B).
- No release is allowed without explicit `GO` in `SECURITY_RELEASE_SIGNOFF.md` (Security Gate C).
- Risk acceptance is allowed only for `P2`/`P3`, with explicit owner and target date.
- Local validation command (recommended): `bash .agent/scripts/validate-security-gates.sh --root .`

### 🤖 Tech Delegate Mode (Batched Execution & Flow Continuity)

If you are running this flow autonomously as a Manager Agent without human micro-management:
1. **Interactive Requirements:** You MUST stop and explicitly ask for human approval at **Gate 1** (Vision Complete), **Gate 4** (Sprint Plan finalized), and **Gate 7** (Release ready). Do not bypass these.
2. **Batched Execution Phase (Steps 2-3 & 5-6):** Do not interrupt the user after Step 2, Step 3, Step 5, and Step 6 to ask for permission to proceed unless you encounter unresolvable ambiguity. You should move seamlessly from `TECH_STRATEGY` to `BACKLOG`, and seamlessly execute code and PRs. Simply report your progress as a batch.
3. **⚙️ Circuit Breaker:** If a CI/CD build, ticket execution, or lint step fails **3 times in a row**, the Agent MUST halt and drop back to human interaction: *"⚠️ I need help. Sticking on an error in branch X."* You MUST persist the error count to a file `.agent/state/circuit.json` to avoid resetting the count upon context loss.
