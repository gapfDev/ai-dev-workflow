# PRODUCT VISION

## 1. Project Type
- **Greenfield** project.

## 2. Core Features & Scope
- Python CLI tool to convert temperatures.
- Supports Celsius, Fahrenheit, and Kelvin.
- Validates that values are not below Absolute Zero.
- Outputs values formatted to 2 decimal places with unit symbols (e.g., `212.00 °F`).

## 3. Workflows
- User inputs command `temp-convert <value> <source> <target>`.
- System parses and validates inputs.
- System calculates and returns result.

## 4. Uncovered Constraints & Blindspots
- Edge case: Input values below absolute zero (e.g., < -273.15 C) must be rejected with clear error messages.
