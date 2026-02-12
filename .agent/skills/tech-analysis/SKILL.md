---
description: How to map product features to technical solutions and define a tech strategy
---

# Tech Analysis

Skill for analyzing product features and mapping them to concrete technical solutions.

## Input
- A product vision document or list of features to implement

## Output
- Complete `TECH_STRATEGY.md` document (use template in `templates/`)

## Process

### Phase 1: Extract Features
1. Read the input document
2. List ALL mentioned features
3. Identify required external integrations

### Phase 2: Context Interview (Proactive)
Before mapping features to tech, ask the user:

1. Do you (or your team) have experience with [platform] development?
2. Is there existing code or a codebase we need to integrate with or follow?
3. Do you have preferences for architecture patterns? (e.g., MVC, MVVM, Clean Arch — depends on platform)
4. How many users/records do you expect? (scale hint for infra decisions)
5. Do you have CI/CD set up already? (GitHub Actions, Bitrise, Jenkins, etc.)

### Phase 3: Map Feature → Tech
For each feature, answer:

| Question | Example |
|----------|---------|
| What component implements it? | (e.g., Screen, Page, Controller, API endpoint, Service) |
| What library/framework does it need? | (e.g., ORM, HTTP client, auth provider, UI framework) |
| Does it need persistence? | (e.g., local DB, key-value store, cloud storage) |
| Does it need networking? | REST API, WebSocket, GraphQL |
| Does it have UI? | Yes → (e.g., Screen/Page/Component). No → (e.g., Background job/Service) |

### Phase 4: Analyze Existing Code (if applicable)
If there is existing code:
1. Identify patterns already in use (architecture, state management)
2. List libraries/dependencies already included
3. Document conventions to follow (naming, packaging, module structure)
4. Note any tech debt or known issues

### Phase 5: Evaluate Stack
Decide the tech stack based on:
1. **Platform** defined in the input
2. **Team experience** (from Phase 2 interview)
3. **Project complexity** (don't over-engineer an MVP)
4. **Existing code patterns** (if any, follow them)

### Phase 6: Document Trade-offs
For each non-obvious technical decision:
- Why this option and not another?
- What risks does it have?
- What alternative exists if it fails?

## Completeness Checklist
- □ Every feature has an assigned technical solution?
- □ Team experience assessed?
- □ Existing code analyzed (if any)?
- □ Architecture pattern chosen and justified?
- □ Stack is viable for the team and project?
- □ Trade-offs documented?
- □ Technical risks identified?
- □ Scale/performance considered?

## Rules
1. **NEVER** configure repos, IDEs, or write code — analysis only
2. **NEVER** choose technology without justification
3. **ALWAYS** consider at least 1 alternative per important decision
4. If there's technical doubt → ask the user, don't assume
