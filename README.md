# AI Development Workflow

Repository focused on a guided AI delivery workflow for planning, executing, and tracking software work from discovery to QA.

This repo is workflow-first. The `apps-script/` folder is included only as a demo implementation of workflow usage.

## What This Repository Is
- A repeatable 7-step workflow for AI-assisted software delivery.
- A coordination model for Manager and Developer agents.
- A governance layer with progress checkpoints, tracking artifacts, and GitHub gates.

## What This Repository Is Not
- Not a product-specific monorepo.
- Not tied to Google Apps Script only.
- Not dependent on the `apps-script/` sample to run the workflow.
- Not the Bakery Ops product repository.

## Workflow Summary (7 Steps)
1. Product Discovery
2. Technical Analysis
3. Setup and Backlog Definition
4. Sprint Planning
5. Implementation Execution
6. Review and Merge
7. QA Validation and Release Decision

## Operating Rules
- Do not implement code before backlog and issue structure are ready.
- Every implementation unit must have acceptance criteria and Definition of Done.
- Use branch-per-ticket and PR-per-ticket.
- Use visible progress tracking after each step.

## Tracking Artifacts
- `BACKLOG.md`: source of truth for planned work.
- `.agent/temp/manager-log.md`: decision log and execution status.
- GitHub Issues/PRs (optional but recommended when `gh` is available).

## GitHub Workflow (Recommended)
If GitHub CLI is available:
- Create/maintain issues for each functional block.
- Link branches and PRs to issues.
- Use PR body references (`Closes #<issue>`).
- Merge with squash strategy.

## Repository Structure
- `.agent/`: workflow assets and agent support material.
- `.github/ISSUE_TEMPLATE/`: issue templates for bug reports and workflow improvements.
- `examples/`: demo applications and dry run outputs used to illustrate the workflow.
- `images/`: workflow visuals and supporting screenshots.

## Workflow Examples & Dry Runs
The `examples/` directory contains reference implementations of the AI Dev Workflow:

- **`examples/focus-timer-dryrun/`**: A "Dry Run" simulated execution of the workflow. It contains the generated artifacts (e.g., `PRODUCT_VISION.md`, `TECH_STRATEGY.md`, `BACKLOG.md`) for a mock web app project without actual code. Use this to understand the expected output format of each workflow phase.
- **`examples/apps-script-demo/`**: A fully functional demo application (Bakery Ops Board). It shows how the workflow and GitHub issues manifest in a real-world codebase. For specific setup details for this project, read `examples/apps-script-demo/README.md`.

## Contributing
See:
- `CONTRIBUTING.md`

Rules in short:
- Keep all workflow documentation in English.
- Open issues for workflow improvements before large changes.
- Submit changes through pull requests to `main`.
