# TECHNICAL STRATEGY

## 1. Architecture
- **Paradigm**: TDD (Test-Driven Development).
- **Language**: Python 3.10+
- **Libraries**: `argparse` (standard library) for CLI parsing.
- **Design Pattern**: Functional core, imperative shell.

## 2. Mitigations
- Isolated conversion logic to allow easy unit testing without calling the CLI.

## 3. Testing
- `pytest` for unit testing conversion formulas and absolute zero boundaries.
