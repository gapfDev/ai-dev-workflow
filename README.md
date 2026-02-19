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
- `apps-script/`: demo application used only as a workflow example.
- `images/`: workflow visuals and supporting screenshots.

## Example Folder: `apps-script/`
`apps-script/` is a demo of workflow application (Bakery Ops Board sample). It is reference material only, not the core purpose of this repository.

If you want product-specific setup details for that example, read:
- `apps-script/README.md`

## Contributing
See:
- `CONTRIBUTING.md`

Rules in short:
- Keep all workflow documentation in English.
- Open issues for workflow improvements before large changes.
- Submit changes through pull requests to `main`.
