# Runbook: Incident Triage

## Severity levels
- Sev 1: Production unavailable or data corruption risk.
- Sev 2: Critical flow broken with workaround.
- Sev 3: Non-critical bug or degradation.

## Triage flow
1. Capture incident summary and timestamp.
2. Identify impacted flow (`capture`, `menu`, `kanban`, `expenses`, `deploy`).
3. Collect evidence:
  - API response from `/exec?action=<action>`.
  - Last deployment version.
  - Recent logs/errors.
4. Apply mitigation or rollback if Sev 1/2.
5. Open follow-up issue with root cause and prevention actions.

## Frequent incidents
- Empty menu after deploy.
- Invalid JSON from `/exec`.
- Status transition blocked unexpectedly.
- Missing `order_id` in create response.
