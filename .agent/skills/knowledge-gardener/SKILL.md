---
name: knowledge-gardener
description: How to automatically audit the docs/ directory and remove/archive outdated Markdown files to prevent agent context rot at the end of a sprint. Use during Step 7 (Release) or when finalizing a milestone.
---

# Knowledge Gardener

This skill represents the "Garbage Collection" methodology for AI agents. As a project evolves, early architectural decisions or execution plans become obsolete. If these old files remain in the `docs/` folder or in `.agent/temp`, future agents will read them and hallucinate requirements based on outdated facts. The Knowledge Gardener prevents this "context rot" by aggressively pruning stale knowledge.

## Input
- The current, verified state of the codebase (e.g., `package.json`, source files).
- The `docs/` directory and `.agent/temp/` directory containing all project context files.

## Output
- Deletion or archiving of obsolete `.md` files.
- Updates to `AGENTS.md` to remove dead links.
- A concise "Gardening Report" summarizing what was pruned.

## Process

### Phase 1: Context Audit
1. Read the most recent structural/schema files (e.g., database schema, main application routing, architecture diagram).
2. Scan the `docs/exec-plans/` or `.agent/temp/` directories for files older than the current sprint or files that deal with already merged features.

### Phase 2: Obsolescence Detection (Deterministic YAML Flags)
Unlike traditional LLM reviews, the Gardener now relies STRICTLY on YAML frontmatter flags to determine if a transactional file should be pruned. Do not guess. Read the file headers.

1. Scan files in `.agent/temp/`, `.agent/issues/`, or `docs/exec-plans/`.
2. Look for the following explicit YAML frontmatter:
   ```yaml
   ---
   type: ephemeral
   status: [active | ready_to_prune]
   ---
   ```
3. If a file lacks this frontmatter, it is considered a **Core Document** and is immune to automatic pruning.
4. Flag ONLY files containing `type: ephemeral` AND `status: ready_to_prune` for deletion/archiving.

### Phase 3: Pruning and Archiving
1. **Delete** or **Archive** all files flagged in Phase 2 (`status: ready_to_prune`).
2. Move them to `.agent/archive/` or delete them from the workspace.
3. If you encounter an "active" file (`status: active`) that is extremely old (e.g., from 3 sprints ago), DO NOT delete it, but alert the user that a stray active ticket remains.

### Phase 4: Map Update
1. Update `AGENTS.md` (the map) to ensure no links point to deleted or archived documents.

## Rules
1. **ALWAYS** respect the YAML flags. Never delete a file without `status: ready_to_prune`.
2. **NEVER** delete core architectural boundary files (`PRODUCT_VISION.md`, `ARCHITECTURE.md`, `SCHEMA.md`).
3. **ALWAYS** ensure `AGENTS.md` is updated if a file it links to is pruned (though ephemeral files shouldn't usually be linked there).
4. **NEVER** trust what a document says if the actual codebase logic contradicts it, but only modify core documents with explicit user consent.
