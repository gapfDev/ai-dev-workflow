# Module Ownership

- UI (`apps-script/Index.html`): `agent:UI`
- Backend (`apps-script/Code.gs`): `agent:Backend`
- Admin ops (`apps-script/Admin.gs`, deploy flow): `agent:Backend` + `area:devops`
- Data quality and schema (`Orders`, `Products`, `Expenses`): `agent:Data`
- QA automation (`apps-script/qa_e2e.py`): `agent:QA`
- Runbooks and standards (`docs/`): `agent:QA` + `area:docs`
