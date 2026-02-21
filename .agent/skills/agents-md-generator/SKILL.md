---
name: agents-md-generator
description: How to generate a lightweight AGENTS.md table of contents file to provide progressive disclosure of the repository to other agents. Use when scaffolding a new project or updating core architectural boundaries.
---

# Agents.md Generator

This skill enables the core "Progressive Disclosure" strategy required for Agent-First development environments. Feeding monolithic documentation to AI coding agents results in context window exhaustion and hallucination. Instead, you must generate a lightweight `AGENTS.md` file (maximum ~100 lines) at the root of the repository. This file serves strictly as a Table of Contents (TOC) mapping directories to domains, teaching agents *where* to look next without giving them all knowledge up front.

## Input
- A complete scan of the `docs/`, `.agent/`, and `src/` directories.
- Any top-level structural files like `ARCHITECTURE.md` or `PRODUCT_VISION.md`.

## Output
- A single `AGENTS.md` file placed at the root of the project repository.

## Process

### Phase 1: Repository Discovery
1. Call `list_dir` on `docs/`, `docs/design`, `docs/exec-plans`, and any `.agent` directories.
2. Identify core domain boundaries (e.g., API boundaries, UI boundaries).
3. Identify where key development plans and issue trackers live.

### Phase 2: Index Generation
1. Map out the `AGENTS.md` structure in a hierarchical bullet-point tree.
2. For each key component, list the absolute or relative path to its source-of-truth markdown document.
3. Group paths logically (e.g., "Architecture", "Current Plans", "Frontend Guidelines").

### Phase 3: File Creation
1. Write the content to `./AGENTS.md`. 
2. Ensure the top of the file explicitly instructs other reading agents: *"Do not guess architecture. Read this TOC to find the correct deep-dive `.md` file, and use tools to read it before coding."*

## Rules
1. **NEVER** exceed 150 lines in `AGENTS.md`. It must remain lightweight.
2. **NEVER** summarize the actual rules or architectural choices inside this file. You must only provide the *path* to the file containing those choices.
3. **ALWAYS** use clear absolute paths or precise relative paths from root.
4. **ALWAYS** run this skill if the directory structure of the project's documentation changes significantly.
