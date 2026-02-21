# TECHNICAL STRATEGY

## 1. Architecture
- **Paradigm**: Visual QA (Golden Master) + component tests.
- **Frontend**: React.js with Vite.
- **Styling**: Tailwind CSS (for dark mode classes and blue themes).
- **Charting**: Chart.js / react-chartjs-2.

## 2. Mitigations
- Theme context will be used to enforce dark mode.

## 3. Testing
- React Testing Library for component rendering.
- Visual regression checks (manual or Playwright) for the dashboard layout.
