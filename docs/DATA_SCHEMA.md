# Track C: Dimensional Modeling (Star Schema)

The ETL pipeline must extract data from `staging_orders` and insert it into the following Star Schema:

## Dimension Tables
1. **Dim_Customer**: `customer_id` (PK), `customer_name`, `email`
2. **Dim_Product**: `product_id` (PK), `product_name`, `category`, `unit_cost`, `unit_price`
3. **Dim_Time**: `date_id` (PK), `full_date` (ISO-8601), `year`, `month`, `day`, `hour`

## Fact Table
**Fact_Sales**: 
- **Primary Key:** `fact_id`
- **Foreign Keys:** `transaction_id`, `customer_id`, `date_id`, `warehouse_location`
- **Metrics/Measures:** `item_count`, `subtotal`, `tax_amount`, `shipping_fee`, `monetary_value`, `net_margin` (calculated as monetary_value - total unit_costs)