# Board Snapshot Contract (Draft)

## Endpoint
- `GET /exec?action=getBoardSnapshot`

## Query Parameters
- `board_day` (optional): `YYYY-MM-DD` day scope for snapshot payload.

## Required Fields per Item
- `order_id`
- `order_number`
- `customer_name`
- `delivery_at`
- `type`
- `channel`
- `payment_status`
- `total_amount`
- `status`
- `captured_at`
- `updated_at`
- `sync_version`

## Envelope
```json
{
  "status": "success",
  "board_rev": "string",
  "items": [],
  "board_day": "YYYY-MM-DD (optional)"
}
```

## Notes
- Keep payload minimal for board rendering only.
- `board_rev` is deterministic for the scoped dataset (`board_day` scope when provided).
- Preserve `getOrders` compatibility for other consumers.
