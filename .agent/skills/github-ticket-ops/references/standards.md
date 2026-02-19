# GitHub Standards Reference

## Purpose
Use these standards when applying `Epic`, `Milestone`, `Ticket`, and `Board` practices in GitHub.

## Epic Standards
- Use sub-issues for decomposition and progress tracking.
- Keep parent issue outcome-focused; keep implementation in child tickets.
- Use issue dependencies to represent blocked-by relationships.

Practical constraints from GitHub Docs:
- A parent issue can have up to 100 direct sub-issues.
- A hierarchy can go up to 8 levels deep.

## Milestone Standards
- Every milestone must have a due date and a measurable goal.
- Use milestone progress to track completion of scoped issues/PRs.
- Keep work scoped to realistic team capacity for the timebox.

## Ticket Standards
- Use issue forms/templates to enforce consistent required data.
- Required minimum fields:
  - Problem/context
  - Scope in/out
  - Acceptance criteria
  - Test plan
  - Priority
  - Owner
  - Epic link
  - Milestone
- Link PRs to issues so merges can close tickets automatically.

## Board (Projects) Standards
- Treat GitHub Project as source of truth for operational status.
- Recommended baseline fields:
  - `Status`
  - `Priority`
  - `Size`
  - `Area`
  - `Iteration`
- Keep statuses minimal and actionable.
- Use built-in workflows to automate routine moves and reduce stale states.
- Use Board + Roadmap + Table views for execution, planning, and triage.

Known GitHub project limits to keep in mind:
- Up to 50 fields per project.
- Up to 20 repositories connected to one project.
- Up to 25,000 items in one project.

## Cadence Standard
Weekly triage:
1. Re-rank top backlog by priority and dependency risk.
2. Remove or split stale oversized tickets.
3. Update blockers with owners and ETA.
4. Validate milestone scope against due date.
5. Update epic risk/progress summary.

## Source Links
- GitHub Projects best practices: https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/best-practices-for-projects
- About Projects: https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects
- Projects quickstart: https://docs.github.com/en/issues/planning-and-tracking-with-projects/creating-projects/quickstart-for-projects
- Milestones: https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-milestones
- Sub-issues: https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues
- Issue dependencies: https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies
- Issue templates/forms: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests
- Linking PRs to issues: https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue
