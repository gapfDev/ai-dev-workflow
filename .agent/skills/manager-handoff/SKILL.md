---
name: Manager Handoff Protocol
description: Standardizes the creation of "Source of Truth" Markdown briefs in .agent/temp for assigning tasks to Developer Agents.
---

# Manager Handoff Protocol

This skill defines how the **Manager Agent** communicates tasks to **Developer Agents** (or other specialized roles) using a "Source of Truth" Markdown file.

## 1. The Channel
- **Directory**: `.agent/temp/`
- **Naming Convention**: `task_<ID>_<SHORT_NAME>.md`
  - Example: `.agent/temp/task_001_auth_setup.md`

## 2. The Format (Task Brief)
Every handoff file MUST follow this structure to ensure the receiving agent has 100% of the context needed to execute without asking questions.

```markdown
# Task: [Task Name]
**ID**: [Ticket-ID]
**Role**: [Target Role, e.g., Dev Agent]

## 1. Context
(Briefly explain *why* we are doing this. Link to Product Vision or Tech Strategy if needed.)

## 2. Requirements (The "What")
- [ ] Requirement 1
- [ ] Requirement 2

## 3. Technical Constraints (The "How")
- **File(s) to Modify**: `src/auth.py`
- **Style/Pattern**: Use the Repository Pattern.
- **Libraries**: Use `pydantic` for validation.

## 4. Deliverables
- Source Code: `[file_path]`
- Tests: `[test_path]`

## 5. Definition of Done (Verification)
- [ ] Code compiles.
- [ ] Unit tests pass.
- [ ] Linter is happy.
```

## 3. Workflow
1.  **Manager** creates the brief in `.agent/temp/`.
2.  **Manager** signals the **Developer** to read the specific file.
3.  **Developer** executes the task using the file as the absolute Source of Truth.
4.  **Developer** writes a completion report (or updates the task file) when done.

## 4. Maintenance
- These files are **ephemeral** but serve as the logs of specific task assignments.
- Do not commit `.agent/temp` to Git (it is in `.gitignore`).
- If a task changes significantly, update the Brief file first, then tell the Agent.
