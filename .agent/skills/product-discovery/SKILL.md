---
name: product-discovery
description: How to conduct a product discovery interview and produce a Product Vision document
---

# Product Discovery

Skill for discovering and documenting a product's vision through structured interviews.

## Input
- A product idea from the user (can be text, audio, video, images, or conversation)

## Output
- Complete `PRODUCT_VISION.md` document (use template in `templates/`)

## Process

### Phase 1: Required Questions
Ask these questions **one at a time**, do not dump them all at once. Wait for an answer before continuing.

**Problem Block:**
1. What problem does this app/feature solve?
2. Who will use it? (type of user)
3. What happens if this app does NOT exist? How do they solve it today?

**Functionality Block:**
4. What are the 3 MOST IMPORTANT things it must do?
5. Do you have any flows or screens in mind? (request screenshots/mockups)
6. Is there a similar app you like? What would you copy from it?

**Context Block:**
7. Is it mobile, web, or both?
8. Does it need login/users?
9. Does it need to store data? Where? (local, cloud)
10. Are there external integrations? (APIs, payments, notifications)

**Scope Block:**
11. What is the MINIMUM needed to consider it useful? (MVP)
12. Is there a deadline?
13. Who else will work on this?

**User Experience Block:**
14. Walk me through step by step: user opens the app, what do they see first? What do they do next?
15. What are the 2-3 most critical screens or pages?
16. Do you have design preferences? (dark/light mode, colors, minimal/rich, existing brand assets)

**Data & Business Block:**
17. What is the most important data in this app? (orders, users, products, messages...)
18. How will you know the app is successful? (key metrics, KPIs, user goals)
19. Is there an existing system this replaces or connects to? (spreadsheet, old app, paper)

**Edge Cases Block:**
20. What should happen when there's no internet?
21. What happens when the user makes a mistake? (undo, validation, confirmation)

### Phase 2: Material Analysis
If the user provides screenshots, mockups, audio, or video:
1. Describe what you see/hear
2. Confirm your interpretation with the user
3. Identify implicit features not mentioned

### Phase 3: Final Review
Before delivering the document, make an executive summary:
- "Based on what we've discussed, the product is [summary]. Is anything missing?"
- Confirm that EVERY feature mentioned is documented
- Verify there are no unanswered questions

## Completeness Checklist
- □ All required questions have an answer?
- □ Features listed without ambiguity?
- □ User flows documented (step-by-step walkthrough)?
- □ Design preferences captured?
- □ Key data model identified?
- □ Success metrics defined?
- □ Edge cases addressed?
- □ User confirmed nothing is missing?
- □ Screenshots/references included if they exist?
- □ Minimum MVP identified?

## Rules
1. **NEVER** assume features the user didn't mention
2. **NEVER** talk about technology or architecture — product only
3. **ALWAYS** confirm your understanding before documenting
4. If info is missing → ask. If no response → document as ⚠️ pending
5. **NEVER** proceed to Phase 3 if fewer than 10 questions have been answered with substantive detail. If the user provides single-sentence answers, probe deeper before accepting.
6. **NEVER** allow downstream skills (tech-analysis, ui-design-preview) to start from a vision document that contains unresolved ⚠️ items in critical sections (features, user flows, or MVP).
