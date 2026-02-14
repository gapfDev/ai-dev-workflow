---
name: qa-validation
description: How to validate features through functional testing and produce a validation report
---

# QA Validation

Skill for testing features as a real user, reporting bugs, and producing a validation report.

## Input
- Compiled/deployed feature ready for testing
- Acceptance criteria or functional requirements from the ticket

## Output
- `VALIDATION_REPORT.md` document with test results and bugs found

## Process

### Phase 1: Create Test Cases
Read the acceptance criteria and create test cases:

```markdown
### Test Case TC-001: [Name]
**Precondition:** [Required initial state]
**Steps:**
1. [User action]
2. [User action]
**Expected Result:** [What should happen]
**Actual Result:** ✅ Pass / ❌ Fail
```

### Phase 2: Types of Tests

| Type | What to test | Example |
|------|-------------|---------|
| **Happy Path** | Normal/expected flow | Login with correct credentials |
| **Edge Case** | Limits and extremes | Login with empty field |
| **Error Path** | Error handling | Login without internet |
| **Boundary** | Boundary values | Input with 999 characters |
| **Usability** | Is it intuitive? | Is the button visible? |

### Phase 3: Execute Tests
1. Compile/deploy the feature
2. Execute each test case in order
3. Document result (Pass/Fail)
4. If Fail → capture screenshot + steps to reproduce

### Phase 4: Report Bugs

```markdown
### 🐛 BUG-001: [Descriptive title]
**Severity:** Critical / Major / Minor / Cosmetic
**Steps to reproduce:**
1. [Step]
2. [Step]
**Expected:** [What should happen]
**Actual:** [What actually happens]
**Screenshot/Video:** [If applicable]
**Environment:** [Device, OS, version]
```

### Phase 5: Generate Report

```markdown
# Validation Report

## Feature: [Name]
## Date: [Date]

## Summary
| Total Tests | ✅ Pass | ❌ Fail | ⚠️ Blocked |
|-------------|---------|---------|------------|
| X | X | X | X |

## Test Results
| TC ID | Description | Result | Notes |
|-------|-------------|--------|-------|
| TC-001 | | ✅/❌ | |

## Bugs Found
| Bug ID | Severity | Description | Status |
|--------|----------|-------------|--------|
| BUG-001 | Major | | Open |

## Recommendation
- [ ] ✅ APPROVE — Ready for release
- [ ] ⚠️ APPROVE WITH CONDITIONS — Fix minor bugs first
- [ ] ❌ REJECT — Critical bugs found
```

## Completeness Checklist
- □ Every acceptance criterion has at least 1 test case?
- □ Edge cases tested?
- □ Bugs have steps to reproduce?
- □ Report has a clear recommendation?

## Rules
1. **NEVER** approve with Critical or Major severity bugs
2. **ALWAYS** test at least 1 happy path + 2 edge cases per criterion
3. **ALWAYS** include steps to reproduce in every bug report
4. If the user needs to test on their device → guide them step by step
