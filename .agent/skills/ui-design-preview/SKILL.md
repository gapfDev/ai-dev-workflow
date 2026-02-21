---
name: ui-design-preview
description: Generate visual UI mockups from product vision for human review before development begins
---

# UI Design Preview

Optional skill to generate visual mockups of a product's key screens before technical analysis begins. Eliminates the gap between "approved text" and "implemented screens."

## When to Use

Execute this skill **only when all of these are true**:
1. The product has a visual interface for end users (web, mobile, desktop)
2. The PRODUCT_VISION.md contains screen descriptions, user flows, or design preferences
3. No existing mockups or designs were provided by the user

**Do NOT execute** for CLIs, libraries, APIs without UI, IoT daemons, smart contracts, batch jobs, or any project where the end user does not interact with a visual screen.

## Input
- Completed `PRODUCT_VISION.md` with screen flows and design preferences

## Output
- Generated mockup images of key screens
- Human approval to proceed

## Process

### Phase 0: Input Validation
Before generating any mockup, verify the PRODUCT_VISION.md contains at minimum:
1. Explicit screen or page descriptions (not just feature names)
2. At least one user flow with step-by-step walkthrough
3. Design preferences (colors, mode, style) or a stated willingness to accept defaults

If any of these are missing or vague (single-sentence descriptions with no detail), **HALT** and request the Manager to return to `product-discovery` for deeper requirements before proceeding.

### Phase 1: Extract Screens
1. Read the PRODUCT_VISION.md
2. Identify every screen or page mentioned (explicit or implicit)
3. List them with a one-line description each
4. Prioritize: pick the 2-4 most critical screens

### Phase 2: Generate Mockups
For each critical screen, generate a visual mockup that reflects:
- The layout and elements described in the vision
- Design preferences stated by the user (colors, mode, style)
- The type of users and their context

If no design preferences were stated, use a clean, modern, professional aesthetic.

### Phase 3: Present for Review
Present all mockups to the user with these questions:
1. Does the visual style match what you imagined?
2. Do these screens cover the main flows you described?
3. What would you change before we continue?

### Phase 4: Iterate or Approve
- If the user requests changes → regenerate affected mockups and present again
- If the user approves → proceed to the next workflow step
- Document the approval in the PRODUCT_VISION.md as an addendum

## Completeness Checklist
- □ All critical screens identified from the vision?
- □ Mockups reflect the user's stated design preferences?
- □ User has reviewed and approved (or iterated)?
- □ Approval documented?

## Rules
1. **NEVER** generate mockups for projects without visual UI
2. **NEVER** proceed to Tech Analysis without user approval of the designs
3. **ALWAYS** use the design preferences from the PRODUCT_VISION.md — do not invent a style the user didn't request
4. **ALWAYS** present mockups one conversation turn at a time — do not dump 10 images at once
5. If the user provides their own mockups/screenshots → skip generation, use theirs as the design source
6. **ALWAYS** compare new feedback against the previous 2 iterations during Phase 4. If feedback directly contradicts a prior revision (e.g., "make it darker" after "make it lighter"), HALT iteration and present the contradiction to the user for resolution before generating another mockup.
7. **NEVER** iterate more than 3 times on the same screen without escalating to the Manager for a design decision.
