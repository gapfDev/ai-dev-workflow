---
name: tdd-workflow
description: How to implement features using Test Driven Development (Red-Green-Refactor)
---

# TDD Workflow

Skill for implementing features using the TDD cycle: Red → Green → Refactor.

## Input
- A ticket with User Story, Acceptance Criteria, and Definition of Done

## Output
- Production code + Tests that validate the acceptance criteria

## The TDD Cycle

```
┌─────────┐     ┌─────────┐     ┌──────────┐
│  🔴 RED  │────▶│ 🟢 GREEN│────▶│ 🔵 REFACT│
│ Write    │     │ Write    │     │ Clean    │
│ test that│     │ MINIMUM  │     │ code     │
│ FAILS    │     │ code to  │     │ without  │
│          │     │ pass     │     │ breaking │
│          │     │          │     │ tests    │
└─────────┘     └─────────┘     └──────┬───┘
     ▲                                 │
     └─────────────────────────────────┘
              Next test
```

## Process Per Ticket

### 1. Read the Ticket
- Read the **Acceptance Criteria** — each one is a test
- Read the technical notes — how to implement

### 2. Plan Tests
Before writing code, perform **Boundary Value Analysis** on each acceptance criterion. For every input, explicitly identify: minimum valid value, maximum valid value, zero/empty, negative (if numeric), null/undefined. Each boundary MUST have a corresponding test.

Then list the tests you need:

```markdown
Planned tests for [TICKET_ID]:
- [ ] Test 1: [Acceptance criterion 1]
- [ ] Test 2: [Acceptance criterion 2]
- [ ] Test 3: [Boundary: minimum value]
- [ ] Test 4: [Boundary: maximum value]
- [ ] Test 5: [Boundary: zero/empty]
- [ ] Test 6: [Boundary: negative/null]
- [ ] Test 7: [Edge case: invalid data]
```

### 3. Red-Green-Refactor Cycle
For each planned test:

**🔴 RED:**
```
1. Write the test
2. Run → MUST FAIL
3. If it passes without new code → test is useless, rewrite
```

**🟢 GREEN:**
```
1. Write MINIMUM code to make the test pass
2. Don't optimize, don't beautify
3. Run → MUST PASS
```

**🔵 REFACTOR:**
```
1. Clean code (naming, DRY, structure)
2. Run tests → MUST STILL PASS
3. If something breaks, revert and retry
```

### 4. Verify Completeness
After finishing all tests for the ticket:
- □ All acceptance criteria have a test
- □ Edge cases covered (nulls, empty, boundaries)
- □ All tests pass
- □ Code is clean (post-refactor)
- □ No lint warnings

## What to Test vs Not Test

| ✅ Test | ❌ Don't Test |
|---------|--------------|
| Business logic | Trivial getters/setters |
| Validations | Framework internals |
| Data transformations | UI layout |
| Edge cases | Third-party libraries |
| Error handling | Constants |

## Test Structure

```
src/
├── main/
│   └── feature/
│       └── FeatureClass.kt
└── test/
    └── feature/
        └── FeatureClassTest.kt    ← Test next to code
```

## Naming Convention

```
fun `should [expected behavior] when [condition]`()

// Examples:
fun `should return empty list when no items match filter`()
fun `should throw exception when input is null`()
fun `should calculate total with tax included`()
```

## Rules
1. **NEVER** write production code without a failing test first
2. **NEVER** create separate tickets or tasks for tests
3. **NEVER** skip tests to "save time"
4. **ALWAYS** run the full suite before marking as done
5. **ALWAYS** cover at least 1 happy path + 1 edge case per criterion
