---
name: git-worktree-runner
description: Run parallel development safely using Git worktrees with one isolated branch per ticket. Use when multiple agents need to work concurrently in the same repository without branch conflicts.
---

# Git Worktree Runner

Use isolated worktrees to execute multiple tickets in parallel from the same repository.

## Input
- Ticket id and short slug.
- Repo root path.
- Base branch (typically `main`).
- **Constraint**: Branch names must use `codex/<ticket-id>-<slug>`.

## Output
- Dedicated worktree folder per ticket.
- Isolated branch context for each agent.
- Clean teardown steps after merge.

---

## Process

### Phase 1: Provision Worktree
1. Fetch latest remote state.
2. Create branch: `codex/<ticket-id>-<slug>`.
3. Create worktree path (for example: `../wt-<ticket-id>`).

### Phase 2: Work in Isolation
1. Run implementation and tests inside the worktree path.
2. Commit only files related to the ticket.
3. Push branch and open PR.

### Phase 3: Teardown
1. After merge, remove worktree directory.
2. Delete local branch if no longer needed.
3. Prune stale worktree metadata.

---

## Useful Commands
```bash
git fetch --all --prune
git worktree add ../wt-35 -b codex/35-b5-auto-unarchive main
cd ../wt-35
# ... work, commit, push, PR ...
cd -
git worktree remove ../wt-35
git branch -d codex/35-b5-auto-unarchive
git worktree prune
```

## Completeness Checklist
- □ Worktree path maps one-to-one with one ticket.
- □ Branch naming matches convention.
- □ Worktree is removed after merge.

## Rules
1. **ALWAYS** keep one ticket per worktree.
2. **ALWAYS** run commands from the intended worktree directory.
3. **NEVER** mix unrelated ticket commits in one worktree branch.
4. **NEVER** leave stale worktrees after ticket merge.
