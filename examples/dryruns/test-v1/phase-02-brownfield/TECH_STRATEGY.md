# TECHNICAL STRATEGY

## 1. Architecture
- **Paradigm**: TDD for existing bug fixes. We will write failing tests for the reported bugs first.
- **Backend**: Express.js (Node.js).
- **Frontend**: React.

## 2. Mitigations
- Code duplication will be addressed incrementally during bug fixes.
- Database connection (JSON or local SQLite) will be isolated to verify the "not saving" bug.

## 3. Testing
- Jest for frontend logic and backend API testing.
- React Testing Library for the filter component.
