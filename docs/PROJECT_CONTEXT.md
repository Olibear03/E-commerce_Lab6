# Project Context: ITEC 116 Activity 6 (E-Commerce & BI Integration)

## Objective
Simulate an end-to-end enterprise data pipeline:
1. Node A (Storefront): Emits transactional JSON payloads on checkout.
2. Node B (BI Ingestion): Validates auth headers and logs payloads to a staging table.
3. Node C (ETL Pipeline): Cleans, formats (ISO-8601), casts types, and loads data into a Star Schema (Fact + Dimension tables).
4. Node D (QA & Governance): Reconciles row counts and monetary totals to ensure 0% data loss across all stages.

## Data Schema Rules
- Transaction payload keys: `transaction_id`, `timestamp` (ISO-8601), `customer_id`, `items` (list of item_id, name, unit_price, quantity), `total_amount`, `tax_amount`, `status`.
- Star Schema:
  - Fact: `Fact_Sales`
  - Dimensions: `Dim_Customer`, `Dim_Product`, `Dim_Time`