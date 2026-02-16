# Bakery Ops Board (MVP)

Internal bakery operations system built with Google Apps Script + Google Sheets.

## Live Project
- Web App: [Bakery Ops Board](https://script.google.com/macros/s/AKfycbxCDxwqXmy61qKIiOAa9fbZTzCGFFnpwG1aJwreVc1fnEs1ZxcRBcZqLZretCyxMKjYUg/exec)
- URL to open in browser: `https://script.google.com/macros/s/AKfycbxCDxwqXmy61qKIiOAa9fbZTzCGFFnpwG1aJwreVc1fnEs1ZxcRBcZqLZretCyxMKjYUg/exec`

MVP goals:
- Fast order capture (phone, Facebook, manual, and gradual Square replacement).
- Visual Kanban board optimized for tablet workflow.
- Strict FIFO prioritization by capture time.
- Friendly daily folio numbering.

## Operational Roles
- Order taker
- Cook
- Organizer/Packing
- Dispatch

## Main Features
- Fast order capture with minimum required validation.
- Product selection popup grouped by family/category.
- Kanban statuses:
  - `Pending`
  - `Working`
  - `Baked`
  - `Delivered`
  - `Cancelled`
- Business rules:
  - `Delivered` is only allowed from `Baked`.
  - `Delivered` cannot be edited.
  - `Cancelled` can be reverted only with confirmation.
- Periodic refresh and basic concurrency handling.

## Architecture
- Frontend: `apps-script/Index.html`
- Backend API: `apps-script/Code.gs`
- Admin/operations: `apps-script/Admin.gs`
- Data store: Google Sheets (`Orders`, `Products`, `Expenses`)

## Repository Structure
- `apps-script/`: MVP application code.
- `images/`: reference images.
- `.agent/`: workflow and skills support material.

## Quick Start
1. Open your Apps Script project and load files from `apps-script/`.
2. Set `SPREADSHEET_ID` in Script Properties.
3. Run `adminPrepareEnvironment()`.
4. Run `adminSeedDemoProductsIfEmpty()`.
5. Run `adminRunSmokeTests()`.
6. Publish the Web App (`/exec`) with access set to `Anyone with the link`.

Detailed docs:
- `apps-script/README.md`
- `apps-script/DEPLOYMENT_CHECKLIST.md`

## Automated QA
From `apps-script/`:
```bash
python3 qa_e2e.py --api-base "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec" --local-dir "$(pwd)"
```

## Security
- Do not commit hardcoded IDs or tokens.
- Keep secrets only in Script Properties or git-ignored local files.
- Local template: `apps-script/private.local.json.example`.
