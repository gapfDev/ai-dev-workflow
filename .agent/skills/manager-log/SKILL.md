---
name: manager-log
description: How to maintain a lightweight work log for Manager Agents to track high-level decisions during project execution. Use when you need to document key choices, rationale, and project status manually throughout the workflow.
---

# Manager Log

Skill for maintaining an incremental work log that captures high-level decisions, rationale, and project status as the Manager Agent progresses through the workflow.

## Input
- Decision type (architecture, delegation, scope, tooling)
- Decision content (what was decided)
- Rationale (why this choice)
- Current workflow phase (Step 1-7)

## Output
- Work log file at `.agent/temp/manager-log.md`
- Structured history of decisions and project evolution
- Easy-to-reference audit trail for handoffs

---

## When to Use

Use this skill when:
- ✅ You make an **important architectural or technical decision**
- ✅ You **delegate work** to a Dev Agent (record what was assigned)
- ✅ You **change project scope** or priorities
- ✅ You **choose between alternatives** (document the reasoning)
- ✅ You need to **pass context** to another Manager Agent later

Do NOT use for:
- ❌ Every single file change (that's what commits are for)
- ❌ Individual code edits (that's what PRs document)
- ❌ Test results (that's in CI logs)
- ❌ Trivial choices (only high-level decisions)

---

## Process

### Phase 1: Initialize Log (First Use Only)

If `.agent/temp/manager-log.md` doesn't exist, create it:

1. Check: `ls .agent/temp/manager-log.md`
2. If missing, copy template: use `templates/LOG_TEMPLATE.md`
3. Fill in:
   - `{{PROJECT_NAME}}` → Actual project name
   - `{{START_DATE}}` → Current date
   - `{{OBJECTIVE}}` → High-level goal (from product vision)

### Phase 2: Log a Decision (Manual)

When you make an important decision:

1. Read current log: `cat .agent/temp/manager-log.md`
2. Add entry under the appropriate section:
   - **Architectural Decisions** → Tech stack, patterns, structure
   - **Delegation Log** → What work was assigned to which agent
   - **Scope Changes** → What was added/removed from the project
   - **Tool/Process Choices** → CI/CD, testing approach, etc.
3. Use this format:

```markdown
**[Date/Time] — [Decision Title]**
Decision: [What you chose]
Rationale: [Why you chose it]
Alternatives considered: [What you didn't choose and why]
```

**Example:**
```markdown
**2026-02-13 23:00 — Authentication Strategy**
Decision: Use OAuth 2.0 with Google/GitHub providers
Rationale: Product vision requires social logins. Team has OAuth experience.
Alternatives considered: JWT (rejected — no third-party login support)
```

### Phase 3: Update Status (At Gates)

After passing a workflow gate (Gate 1, 2, etc.):

1. Update the **Current Status** section
2. Mark completed phases with ✅
3. Mark in-progress phase with 🔄
4. List pending phases

**Example:**
```markdown
## Current Status
- ✅ Step 1: Product Discovery complete
- ✅ Step 2: Tech Analysis complete  
- ✅ Gate 1: Passed (vision approved)
- 🔄 Step 3: Backlog creation in progress
- ⏸️ Step 4: Sprint planning (pending)
```

### Phase 4: Convert to Walkthrough (Optional, End of Work)

When project is complete or conversation ends:

1. Read the full log
2. Create a `walkthrough.md` summary
3. Include:
   - Key decisions made (from log)
   - Final deliverables
   - What was validated
4. Archive log to `.agent/archive/manager-log-[DATE].md` (optional)

---

## Decision Types Guide

| Type | When to Log | Example |
|------|-------------|---------|
| **Architectural** | Choosing patterns, structure, frameworks | "MVVM over MVC because..." |
| **Delegation** | Assigning work to Dev Agents | "UI Dev: implement login screen" |
| **Scope** | Adding/removing features | "Removed offline mode (out of scope)" |
| **Tooling** | CI/CD, testing, deployment choices | "GitHub Actions for CI" |
| **Risk** | Identified risks or trade-offs | "Using beta library — may have bugs" |

---

## Log Structure

```markdown
# Manager Work Log

## Session Info
- Project: [Name]
- Started: [Date]
- Objective: [High-level goal]
- Current Phase: [Step X]

---

## Architectural Decisions

[Your decision entries here]

---

## Delegation Log

[Work assigned to Dev Agents]

---

## Scope Changes

[Features added/removed]

---

## Tool Choices

[CI/CD, testing, deployment decisions]

---

## Current Status

[Checklist of workflow progress]

---

## Blockers

[Current blockers, if any]

---

## Next Steps

[What's coming next]
```

---

## Completeness Checklist

- □ Log file exists at `.agent/temp/manager-log.md`?
- □ Session info (project, date, objective) filled in?
- □ At least 3 decisions documented with rationale?
- □ Current status reflects latest workflow phase?
- □ All delegations have agent name + task description?

---

## Rules

1. **ALWAYS** include rationale when logging a decision
2. **ALWAYS** timestamp your entries (date + time)
3. **ALWAYS** mention alternatives considered (shows thoughtful choice)
4. **NEVER** log trivial decisions — only high-level choices
5. **NEVER** duplicate what's in commits/PRs — log WHY, not WHAT
6. **ALWAYS** update Current Status after passing a gate
7. **ALWAYS** log delegations with agent identity + task
8. **ALWAYS** write in English for consistency
9. **NEVER** let the log exceed 300 lines — move old entries to archive

---

## Example Log

```markdown
# Manager Work Log

## Session Info
- Project: Order Management System
- Started: 2026-02-13
- Objective: Build offline-first bakery order tracking app
- Current Phase: Step 3 (Setup & Backlog)

---

## Architectural Decisions

**2026-02-13 10:15 — Local Storage Strategy**
Decision: Use Room database for offline-first approach
Rationale: Product vision requires offline operation. Room well-supported on Android.
Alternatives considered: SQLite directly (rejected — too low-level), Realm (rejected — deprecated)

**2026-02-13 14:00 — UI Framework**
Decision: Jetpack Compose for UI
Rationale: Modern, declarative, team wants to learn it
Alternatives considered: XML layouts (rejected — legacy approach)

---

## Delegation Log

**2026-02-13 15:00 — UI Dev (Thread #abc123)**
Task: Implement login screen with MVVM pattern + StateFlow
Deliverable: PR with login UI + ViewModel + unit tests

**2026-02-13 16:00 — Backend Dev (Thread #def456)**
Task: Set up Room database schema + DAOs
Deliverable: PR with entities, DAOs, migration scripts

---

## Scope Changes

**2026-02-13 12:00 — Removed Real-Time Sync**
Reason: Out of scope for MVP. Focus on offline-first core functionality.

---

## Tool Choices

**2026-02-13 11:00 — CI/CD**
Decision: GitHub Actions for automated testing
Rationale: Free for public repos, easy GitHub integration

---

## Current Status
- ✅ Step 1: Product Discovery complete
- ✅ Step 2: Tech Analysis complete
- ✅ Gate 1: Passed (vision approved)
- ✅ Gate 2: Passed (tech strategy approved)
- 🔄 Step 3: Backlog creation in progress (8/12 tickets created)
- ⏸️ Step 4: Sprint planning (pending backlog completion)

---

## Blockers

None currently

---

## Next Steps
1. Finish remaining 4 backlog tickets
2. Review UI Dev's login screen PR
3. Plan Sprint 1 with MoSCoW prioritization
```

---

## Integration with Workflow

**When to update the log during the 7-step workflow:**

| Workflow Step | When to Log |
|---------------|-------------|
| **Step 1: Product Discovery** | Log key insights from user (critical features, must-haves) |
| **Step 2: Tech Analysis** | Log architectural decisions, tech stack choices |
| **Step 3: Setup & Backlog** | Log project structure decisions, tooling choices |
| **Step 4: Sprint Planning** | Log scope changes, priority shifts |
| **Step 5: Implementation** | Log delegation to Dev Agents, design pattern choices |
| **Step 6: Code Review** | Log quality trade-offs, technical debt decisions |
| **Step 7: QA Validation** | Log deployment decisions, release criteria |

**Tip:** Update the log AFTER each gate pass to maintain an accurate Current Status.
