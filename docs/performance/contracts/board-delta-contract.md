# Board Delta Contract

## Endpoint
- `GET /exec?action=getBoardDelta`

## Query Parameters
- `since_rev` (optional): last known board revision from the client.
- `since_updated_at` (optional): ISO timestamp cursor for incremental change filtering.

## Response Envelope
```json
{
  "status": "success",
  "board_rev": "string",
  "changed": [],
  "removed": [],
  "full": false
}
```

## Semantics
- If `since_rev` matches current revision, backend returns an empty delta.
- If no `since_updated_at` is provided, backend returns `full: true` with a full board payload in `changed`.
- `removed` is currently empty in MVP because hard delete is not part of the workflow.

## Client Rules
- Apply `changed` by `order_id` replacement/insert.
- Apply `removed` as deletions if provided.
- If response is invalid or inconsistent, fallback to `getBoardSnapshot`.
