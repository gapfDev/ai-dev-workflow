# Cross-Platform Skill Compatibility Guide

Reference for deploying skills across AI coding agent ecosystems.

> This document is loaded on-demand (Tier 3) — not included in the agent's context unless needed.

---

## The Open Standard: agentskills.io

The [Agent Skills specification](https://agentskills.io/specification) is an open format originally developed by Anthropic and now adopted across the industry. It defines:

- **`SKILL.md`** as the universal instruction file
- **YAML frontmatter** with `name` + `description` as the minimum required metadata
- **Progressive disclosure** (3 tiers) for efficient context management
- **Optional directories** (`scripts/`, `references/`, `assets/`) for resources

---

## Platform Comparison

### Skill Locations

| Platform | Project-level | User-level (global) |
|----------|--------------|-------------------|
| Claude Code | `.claude/skills/<name>/` | `~/.claude/skills/<name>/` |
| OpenAI Codex | `.codex/skills/<name>/` | `~/.codex/skills/<name>/` |
| Gemini CLI | `.gemini/skills/<name>/` | `~/.gemini/skills/<name>/` |
| Cursor | `.cursor/skills/<name>/` | `~/.cursor/skills/<name>/` |
| Windsurf | `.windsurf/skills/<name>/` | `~/.codeium/windsurf/skills/<name>/` |
| OpenSkills | `.agent/skills/<name>/` | — (universal format) |

### Context / System Files

Each platform has its own project-level context file (equivalent to a system prompt):

| Platform | Context File | Purpose |
|----------|-------------|---------|
| Claude Code | `CLAUDE.md` | Project instructions, conventions |
| OpenAI Codex | `AGENTS.md` | Agent guidance, setup commands, style |
| Gemini CLI | `GEMINI.md` | High-level instructions, persona |
| Cursor | `.cursorrules` | Project rules and conventions |
| Windsurf | Cascade Rules | Behavioral configuration |

### Discovery & Activation

All platforms use the same 3-tier progressive disclosure model:

```
1. DISCOVERY   → Agent reads name + description of all skills (~100 tokens each)
2. ACTIVATION  → Agent loads full SKILL.md when task matches description
3. EXECUTION   → Agent loads scripts/, references/, assets/ only as needed
```

**Key implication**: The `description` field is the most critical piece of metadata. It must clearly state:
- **What** the skill does
- **When** to use it (trigger keywords)

### Skill Invocation

| Platform | Explicit | Implicit |
|----------|---------|---------|
| Claude Code | `/skills` command, `$skill-name` | Auto-matches from description |
| OpenAI Codex | `/skills` command, `$skill-name` | Auto-matches from description |
| Gemini CLI | `/skills` command | Auto-matches, asks for consent |
| Cursor | Agent Skills import | Auto-matches from description |
| Windsurf | `@skill-name` in Cascade | Auto-matches from description |

---

## Portability Rules

To ensure a skill works across all platforms:

1. **Use only `name` and `description` in frontmatter** — these are universally supported
2. **Keep `SKILL.md` under 500 lines** — all platforms recommend this
3. **Use relative paths** for file references within the skill
4. **Don't reference platform-specific features** in the skill body
5. **Scripts should be self-contained** — handle dependencies gracefully
6. **Test the skill in at least 2 platforms** if cross-platform use is intended

---

## Migration Cheat Sheet

To deploy a skill from `.agent/skills/` to another platform:

```bash
# Claude Code
cp -r .agent/skills/my-skill .claude/skills/my-skill

# OpenAI Codex
cp -r .agent/skills/my-skill .codex/skills/my-skill

# Gemini CLI
cp -r .agent/skills/my-skill .gemini/skills/my-skill

# Cursor (via Agent Skills standard)
cp -r .agent/skills/my-skill .cursor/skills/my-skill

# Windsurf
cp -r .agent/skills/my-skill .windsurf/skills/my-skill
```

No file modifications needed — the format is identical across all platforms.
