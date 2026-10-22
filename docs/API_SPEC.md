# Track B: BI Ingestion Endpoint Specification

## Endpoint
- **URL Path:** `/api/v1/ingest/orders`
- **Method:** `POST`
- **Purpose:** Receive raw transactional payloads from Node A and log them into the `staging_orders` database table.

## Authentication
- **Header Required:** `Authorization: Bearer <SECRET_TOKEN>`
- If the header is missing or invalid, the API must return a `401 Unauthorized`.

## Expected Payload
- Must accept `application/json`.
- Must match the `schema_version: "1.1"` transaction payload (containing transaction_id, line_items, totals, etc.).

## Database Action
- Store the raw JSON string as a `TEXT` or `JSON` column in the `staging_orders` table.
- Append a `received_at` timestamp.