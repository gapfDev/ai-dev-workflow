# Agent Skills Standard

## Single Source of Truth
- All team skills live in: `.agent/skills`
- Every skill folder must include `SKILL.md`.
- Do not duplicate skill contents in multiple locations.

## Bridge to Local Agent Runtimes
Use the bridge script to expose repo skills into each runtime skill directory.

Script:
- `.agent/scripts/sync-skills-bridge.sh`

Default behavior:
- Source: `.agent/skills`
- Destination: `${CODEX_HOME:-$HOME/.codex}/skills`
- Mode: `link`

## Commands
Codex/local symlink mode (recommended when symlinks are supported):
```bash
bash .agent/scripts/sync-skills-bridge.sh --mode link --prune
```

Cross-LLM compatibility mode (copy skills instead of symlink):
```bash
bash .agent/scripts/sync-skills-bridge.sh --mode copy --prune --dest "<llm_skills_dir>"
```

Examples:
```bash
bash .agent/scripts/sync-skills-bridge.sh --mode copy --dest "$HOME/.another-llm/skills"
bash .agent/scripts/sync-skills-bridge.sh --mode link --dest "$HOME/.codex/skills"
```

## Operational Rules
1. Edit skills only under `.agent/skills`.
2. After adding/renaming/removing a skill, re-run bridge sync.
3. Restart agent runtime after sync so new skills are discovered.
4. If a runtime has issues with symlinks, switch to `--mode copy`.

## Default Deploy Rule (Apps Script Projects)
- For any deploy/redeploy task that affects a web app URL/version (`/exec`), use `deploy-readme-sync` by default.
- Deployment is not complete until `README.md` and `apps-script/README.md` are verified and synchronized (if needed) in the same flow.
- If no URL/version changed, explicitly report that README links were checked and left unchanged.

## Verification
List discoverable skills:
```bash
find .agent/skills -mindepth 1 -maxdepth 1 -type d | sort
find "${CODEX_HOME:-$HOME/.codex}/skills" -mindepth 1 -maxdepth 1 | sort
```

## Multi-Agent Delivery Skills
Use these skills for parallel GitHub execution with dependency gates and minimal human intervention:

- `gh-dependency-orchestrator`: Build dependency graph, enforce start gates, emit unblock instructions.
- `gh-ticket-runner`: Standard issue execution contract (`STARTED`, `BLOCKED`, `DONE`) with evidence.
- `git-worktree-runner`: Isolated branch/worktree per ticket for parallel coding.
- `gh-pr-closeout`: PR-to-issue closure hygiene with `Closes #ticket` and test evidence.
- `qa-release-gate`: Hard QA sign-off gate that starts final validation only after dependencies close.
- `milestone-watchdog`: Detect stale/blocked tickets and escalate by owner.
- `status-reporter`: Publish concise milestone status snapshots with bottlenecks and next actions.

### Recommended Orchestration Chain
1. Plan dependencies and gates with `gh-dependency-orchestrator`.
2. Execute ticket work with `gh-ticket-runner` + `git-worktree-runner`.
3. Close implementation with `gh-pr-closeout`.
4. Monitor health with `milestone-watchdog` and report via `status-reporter`.
5. Run final milestone validation with `qa-release-gate`.
