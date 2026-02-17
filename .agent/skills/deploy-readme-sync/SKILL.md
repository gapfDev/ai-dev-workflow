---
name: deploy-readme-sync
description: Default deployment documentation gate for Apps Script/web-app projects. Use automatically on every deploy/redeploy task and whenever deployment URL/version references may change.
---

# Deploy README Sync

Ensure deployment outputs and documentation stay in sync in the same change cycle.

## Input
- Final deployment URL and version/deployment ID.
- Target docs to update (at minimum root `README.md` and app-specific README files).
- Environment context (`staging`, `production`, or both).
- **Constraint**: Do not close deployment work until doc sync is complete.

## Output
- Updated README links and deployment version references.
- Confirmation of files changed.
- Confirmation that stale deployment links were searched and resolved.

---

## Process

### Phase 1: Discover Deployment Data
1. Capture canonical URL and deployment version.
2. Identify docs that expose live links.
3. Confirm which environment link should be shown as default.

### Phase 2: Update Documentation
1. Replace outdated URLs and deployment versions.
2. Keep one canonical live link per environment.
3. Mark historical links explicitly if intentionally preserved.

### Phase 3: Verify Consistency
1. Search docs for stale links with:
```bash
rg -n "script.google.com/macros/s|/exec|deployment|live" README.md apps-script/README.md
```
2. Confirm changed docs reference the same active URL/version.
3. Report final URL, version, and touched files.

---

## Completeness Checklist
- □ Live URL in README files matches the deployed target.
- □ Deployment version/id in docs matches latest deploy.
- □ No stale active links remain without explicit historical note.

## Rules
1. **ALWAYS** update documentation in the same workflow as deployment.
2. **ALWAYS** verify links with a repo-wide search before finishing.
3. **ALWAYS** treat this as default for Apps Script `/exec` deployment work (unless user explicitly opts out).
4. **NEVER** leave placeholder URLs for production references.
5. **NEVER** mark deployment complete when docs are out of sync.
