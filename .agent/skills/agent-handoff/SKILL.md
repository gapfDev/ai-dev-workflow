---
name: agent-handoff
description: How to manage transitions between agent roles and generate handoff prompts for new threads
---

# Agent Handoff

Skill for managing transitions between different agent roles in a multi-step workflow. Detects when a role change is needed, asks the user how to proceed, and generates copy-paste handoff prompts for new threads.

## Input
- Current step just completed (and its deliverables)
- Next step to execute (and its expected agent role)

## Output
- Decision: continue in same thread OR switch to new thread
- If switching: a ready-to-paste handoff prompt for the new thread

---

## Role Transition Map

Every step has an assigned agent role. When the role changes between steps, a handoff decision is needed.

```
Step 1 (👤 PM Agent)
   │ 🔀 Role changes
Step 2 (🏗️ Arch Agent)
   │ 🔀 Role changes
Step 3 (⚙️ DevOps+PM)
   │ 🔀 Role changes
Step 4 (📅 PM Agent)
   │ 🔀 Role changes
Step 5 (💻 Dev Agent)
   │ 🔀 Role changes
Step 6 (🔍 Lead Dev)
   │ 🔀 Role changes
Step 7 (✅ QA Agent)
```

> Every gate in the workflow is a potential handoff point.

---

## Process

### Phase 1: Detect Transition

After a gate is approved, check if the next step uses a different agent role.

```
Gate approved → Check next step role
├── Same role as current → Continue (no handoff needed)
└── Different role → Trigger Phase 2
```

### Phase 2: Ask the User

Present this decision clearly:

```
╔══════════════════════════════════════════════════════════╗
║  🔀 AGENT TRANSITION                                     ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ✅ Completed: Step X — [Step Name]                      ║
║  ➡️  Next:      Step Y — [Step Name]                      ║
║                                                          ║
║  Role change: [Current Role] → [Next Role]               ║
║                                                          ║
║  How would you like to proceed?                          ║
║                                                          ║
║  [1] Continue here (same thread)                         ║
║      I'll switch roles and keep working.                 ║
║                                                          ║
║  [2] New thread (handoff)                                ║
║      I'll generate a handoff prompt you can paste        ║
║      into a fresh agent thread.                          ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

| User picks | Action |
|------------|--------|
| **Option 1** | Continue working in the same thread. Acknowledge the role change and proceed. |
| **Option 2** | Generate a handoff prompt (Phase 3) |

### Phase 3: Generate Handoff Prompt

If the user chooses a new thread, generate a **complete, self-contained handoff prompt** that the new agent can execute without any prior context.

The handoff prompt MUST include these sections:

---

#### Handoff Prompt Template

````markdown
## Handoff Prompt — Step [Y]: [Step Name]

### Working Directory
```
[absolute path to project root]
```

### Read First
Before doing anything, read these files in order:
1. `[path/to/latest deliverable from previous step]`
2. `[path/to/other key documents]`
3. `[path/to/README.md]`

### Role & Persona
- **Role:** [e.g. Senior Developer / UI Specialist / QA Engineer / Backend Engineer]
- **Focus:** [e.g. Pixel-perfect implementation / Robust error handling]
- **Language:** English (all communication and deliverables)

### Context
- **Project:** [1-line description]
- **Completed steps:** [list of completed steps with deliverables]
- **Current step:** Step [Y] — [Name] ([Role])
- **Your task:** [clear description of what to do]

### GitHub (if applicable)
- **Repo:** [URL]
- **Project board:** [URL]
- **Tracking:** [GH Issues / BACKLOG.md / Hybrid]

### Key Decisions Already Made
- [Decision 1: e.g., Stack is [language] + [framework] + [database]]
- [Decision 2: e.g., Tracking via GitHub Issues]
- [Decision 3: e.g., Branch naming: codex/<id>-<name>]

### Technical Context & Patterns (CRITICAL)
- **Architecture:** [e.g. project's chosen pattern]
- **Key Models:** [e.g. User, Order, Product]
- **Existing patterns to match:**
  - [Pattern 1: e.g. Repository pattern for data access]
  - [Pattern 2: e.g. state management approach for UI]
- **Gotchas:** [Specific implementation details to watch out for]

### What To Do
[Specific instructions for this step, e.g.:]
- Start Step 5 implementation from issue #1
- Continue in dependency order per IMPLEMENTATION_PLAN.md
- One issue = one branch = one PR

### Rules
- Branch: `codex/<issue-number>-<short-name>`
- PR must include `Closes #<issue-number>`
- Tests required for every ticket (TDD)
- Use squash merge
- Never commit/push `.agent/` (local-only workflow config)
- Update project board status as you work

### Skills Available
The following skills are available in `.agent/skills/`:
- [list relevant skills for this step]

### Deliverable
When done, produce: `[expected output file or artifact]`
Then ask the user to approve via Gate [Y].
````

---

## Handoff Prompt Requirements

The generated prompt must be:

| Requirement | Why |
|-------------|-----|
| **Self-contained** | New thread has zero prior context |
| **Copy-pasteable** | User drops it into a new chat, done |
| **Paths are absolute** | No ambiguity about file locations |
| **Decisions included** | Don't re-ask questions already answered |
| **Rules explicit** | Branch naming, merge strategy, etc. |
| **Skills referenced** | So the new agent knows what tools are available |

---

## Quick Decision Guide

```
Gate passed → Next step has different role?
├── No  → Continue working. No handoff needed.
└── Yes → Ask user: same thread or new thread?
     ├── Same thread → Switch role, keep going.
     └── New thread  → Generate handoff prompt.
                        Present as code block.
                        User copies → pastes in new chat.
```

---

## Manager Agent Pattern (Best Practice)

For complex execution steps (like Step 5: Implementation), use the **Manager-Worker** pattern:

1. **Manager Agent (Main Thread):**
   - Holds the high-level context (Vision, Plan, Backlog)
   - Does NOT write code or run tests
   - Delegates tasks via Handoff Prompts
   - Reviews work via `gh pr view` and `gh pr review`

2. **Worker Agent (New Thread):**
   - Receives a specific task (Handoff Prompt)
   - Writes code, runs tests, fixes bugs
   - Opens a PR when done
   - Closes the thread

> **Why?** This keeps the Manager's context clean and prevents "context window overflow" during long implementation phases.

> **CRITICAL:** The Manager MUST define a specific **Role & Persona** (e.g., "UI Specialist") and provide technical context to ensure high-quality, focused output.
> **CRITICAL:** The Manager MUST provide specific technical context (patterns, existing models, gotchas) in the handoff prompt to prevent the Worker from reinventing the wheel or breaking inconsistencies.

## Rules
1. **ALWAYS** ask before switching — never assume the user wants a new thread
2. **ALWAYS** include absolute paths in handoff prompts
3. **ALWAYS** include decisions already made (stack, tracking system, conventions)
4. **NEVER** omit the "Read First" section — it's critical for context
5. **NEVER** include conversational history — only structured context
6. **NEVER** assume the new thread knows anything — treat it as a blank slate
