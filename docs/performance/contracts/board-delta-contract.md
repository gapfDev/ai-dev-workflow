# Board Delta Contract

## Endpoint
- `GET /exec?action=getBoardDelta`

## Query Parameters
- `since_rev` (optional): last known board revision from the client.
- `since_updated_at` (optional): ISO timestamp cursor for incremental change filtering.
- `board_day` (optional): `YYYY-MM-DD` day scope for snapshot/delta payloads.
  - When `board_day` is provided, `since_rev` is required.

## Response Envelope
```json
{
  "status": "success",
  "board_rev": "string",
  "changed": [],
  "removed": [],
  "full": false,
  "board_day": "YYYY-MM-DD (optional)",
  "fallback": "snapshot (optional)",
  "fallback_reason": "string (optional)"
}
```

## Semantics
- If `since_rev` matches current revision, backend returns an empty delta.
- If no `since_updated_at` is provided, backend returns `full: true` with a full board payload in `changed`.
- For day-scoped requests, `removed` includes `order_id`s that left the selected day (for example moved to another day).
- If day-scoped delta cannot be derived from prior revision state, backend returns a snapshot-style fallback (`full: true`, `fallback: "snapshot"`, `fallback_reason`).

## Client Rules
- Apply `changed` by `order_id` replacement/insert.
- Apply `removed` as deletions if provided.
- If response is invalid or inconsistent, fallback to `getBoardSnapshot`.
