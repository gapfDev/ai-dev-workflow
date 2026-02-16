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

## Verification
List discoverable skills:
```bash
find .agent/skills -mindepth 1 -maxdepth 1 -type d | sort
find "${CODEX_HOME:-$HOME/.codex}/skills" -mindepth 1 -maxdepth 1 | sort
```
