---
name: ralph-wiggum-loop
description: How to enforce local self-correction (linting, compiling, testing) before requesting peer review. Use when an agent finishes coding a feature and needs to validate it locally to ensure it is grammatically and syntactically flawless.
---

# Ralph Wiggum Loop (Self-Correction Execution)

The "Ralph Wiggum Loop" is an Agent-First paradigm where the AI developer autonomously runs validation loops before escalating an issue to a human or QA agent. Waiting for human code-review or CI pipeline validation is expensive. Code generation agents must attempt to compile, lint, and test their own changes locally, read the terminal output of those checks, and fix compilation bugs autonomously in a closed loop.

## Input
- Code changes made by the agent in an active git worktree or project workspace.
- The project's package manager or execution environment (e.g., `npm`, `cargo`, `python`, `gradle`).

## Output
- Locally validated, syntax-error-free code.
- A terminal output demonstrating that local validation checks pass.

## Process

### Phase 1: Identify Validation Commands
1. Read the `package.json`, `Makefile`, `build.gradle`, or equivalent project runner.
2. Identify the commands for linting (e.g., `npm run lint`), building (e.g., `npm run build`), and testing (e.g., `npm test`).

### Phase 2: Autonomous Loop Execution
1. Run the identified build/lint/test commands using the terminal execution tool.
2. If the terminal returns Exit Code `0` (Success): You verify the code is structurally sound and exit the loop.
3. If the terminal returns a non-zero exit code (Failure): 
   - Parse the error output in the terminal log.
   - Go to the exact file and line number failing.
   - Fix the code.
   - Immediately rerun the loop from Step 1.

### Phase 3: Resolution
1. Do not alert the user or mark the ticket as "Done" until Phase 2 completes successfully.
2. Once successful, document that "Local compilation and linting passed" before passing to QA/Review.

## Rules
1. **ALWAYS** attempt local compilation/validation before telling a human or QA agent that a task is finished.
2. **NEVER** give up after the first compilation failure. You must enter a self-correction loop and try to fix syntax/linter errors based on the terminal stack trace.
3. **ALWAYS** ask for human clarification if the compilation loop fails more than 3 consecutive times with the same error, signaling a deeper architectural blocker.
