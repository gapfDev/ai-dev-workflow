# Board Snapshot Contract (Draft)

## Endpoint
- `GET /exec?action=getBoardSnapshot`

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
  "items": []
}
```

## Notes
- Keep payload minimal for board rendering only.
- Preserve `getOrders` compatibility for other consumers.
