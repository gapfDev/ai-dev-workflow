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

### `getBoardSnapshot` (GET)
- Optional query: `board_day=YYYY-MM-DD`
  - When present, snapshot payload is scoped to that day only.
  - `board_rev` is calculated from the scoped item set.
  - Invalid `board_day` returns an error.

### `getBoardDelta` (GET)
- Supports optional day scope with `board_day=YYYY-MM-DD`.
- For day-scoped delta:
  - `since_rev` is required.
  - `removed` includes `order_id`s that existed in the previous scoped revision but are no longer in the selected day (for example moved out to another day).
  - If prior scoped revision state is unavailable, endpoint falls back to `full: true` snapshot-like response with:
    - `fallback: "snapshot"`
    - `fallback_reason`

### `archiveBoardDay` (POST)
- Required payload:
  - `day_key` (`YYYY-MM-DD`)
  - `reason`
  - `confirm_step_1=true`
  - `confirm_step_2=true`
- Archives the day and persists audit fields in `BoardDays`:
  - `is_archived=true`
  - `archived_at`
  - `archived_reason`
  - `updated_at`

### `unarchiveBoardDay` (POST)
- Required payload:
  - `day_key` (`YYYY-MM-DD`)
  - `reason`
- Unarchives the day and persists audit fields in `BoardDays`:
  - `is_archived=false`
  - `unarchived_at`
  - `updated_at`

### `createOrder` (POST)
- Creates order and generates:
  - `order_number`
  - `captured_at`
- If `delivery_date` is archived, backend auto-unarchives that day and returns:
  - `auto_unarchived_day` (`true|false`)
  - `auto_unarchived_day_key` (`YYYY-MM-DD` when triggered)

### `updateOrderDetails` (POST)
- Updates mutable order fields.
- Must reject edits on `Delivered` orders.
- When `delivery_date` is moved into an archived day, backend auto-unarchives that day and returns:
  - `auto_unarchived_day` (`true|false`)
  - `auto_unarchived_day_key` (`YYYY-MM-DD` when triggered)

### `updateOrderStatus` (POST)
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
