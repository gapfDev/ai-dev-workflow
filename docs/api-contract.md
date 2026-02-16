# API Contract (MVP)

## Base URL
Web App deployment URL ending in `/exec`.

## Request pattern
- Method: `GET` or `POST`
- Query: `?action=<actionName>`
- POST body: JSON payload

## Standard response envelopes

### Success
```json
{
  "status": "success",
  "data": {},
  "meta": {}
}
```

### Error
```json
{
  "status": "error",
  "message": "Actionable error message"
}
```

## Core actions

### `getProducts` (GET)
- Returns active products for capture/menu.

### `getOrders` (GET)
- Returns current order board state.
- Optional query: `board_day=YYYY-MM-DD`
  - When present, the response includes only orders with matching `delivery_date`.
  - When omitted, behavior remains unchanged and returns all orders.

### `getBoardDays` (GET)
- Returns only days that currently contain at least one order.
- Each item includes:
  - `day_key`
  - `order_count`
  - `pending_count`
  - `is_archived`
  - `updated_at`

### `createOrder` (POST)
- Creates order and generates:
  - `order_number`
  - `captured_at`

### `updateOrder` (POST)
- Updates mutable order fields.
- Must reject edits on `Delivered` orders.

### `moveOrderStatus` (POST)
- Enforces transitions:
  - Allowed: `Baked -> Delivered`
  - Rejected: direct `Pending -> Delivered`
- `Cancelled` reactivation requires explicit confirmation flag.

## Validation baseline
- Required create fields: customer, date, type, items.
- `items` must contain at least one valid line.
- Monetary fields must parse as numeric.

## Compatibility
- Existing endpoints that already return JSON remain valid.
- New actions must use the same envelope and error conventions.
