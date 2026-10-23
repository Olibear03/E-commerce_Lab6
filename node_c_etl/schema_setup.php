<?php
/**
 * ============================================================================
 * ITEC 116 - GROUP ACTIVITY 6: TRACK C (DATA INTEGRATION ARCHITECTS)
 * File: node_c_etl/schema_setup.php
 * ============================================================================
 * 
 * [RUBRIC REQUIREMENT - TASK 2.2: Star Schema / Aggregation Mapping]
 * "Map transactional data from Node A into a core Fact Table (Fact_Sales)
 *  linked to Dimension Tables (Dim_Customer, Dim_Time, Dim_Product)."
 *
 * HOW THIS WORKS (FOR ORAL DEFENSE):
 * 1. This script initializes the Dimensional Data Warehouse inside SQLite
 *    (`data/warehouse.db`) using a Kimball Star Schema architecture.
 * 2. Why Star Schema?
 *    - The center of the star is `Fact_Sales`, which stores quantitative,
 *      numerical measurements (monetary_value, net_margin, subtotal, tax_amount,
 *      item_count) and foreign keys pointing to surrounding dimensions.
 *    - Surrounding `Fact_Sales` are 3 Dimension Tables (`Dim_Customer`,
 *      `Dim_Product`, `Dim_Time`) which store descriptive attributes ("who,
 *      what, where, when") used for grouping/filtering in BI charts.
 * 3. How to run manually in terminal:
 *    `php node_c_etl/schema_setup.php`
 * ============================================================================
 */

$db_path = __DIR__ . '/../data/warehouse.db';

try {
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "
    -- ========================================================================
    -- 1. DIMENSION TABLES (Context: Who, What, When)
    -- ========================================================================

    -- Dim_Customer: Stores unique customer entities extracted from Node A orders
    CREATE TABLE IF NOT EXISTS Dim_Customer (
        customer_id TEXT PRIMARY KEY,   -- Natural/Business Key (e.g., 'CUST-001')
        customer_name TEXT,             -- Full Name (e.g., 'Juan Dela Cruz')
        email TEXT                      -- Contact Email
    );

    -- Dim_Product: Stores catalog item metadata, selling price, and unit cost
    -- Used by Track C to compute Net Margin (Selling Price - Unit Cost)
    CREATE TABLE IF NOT EXISTS Dim_Product (
        product_id TEXT PRIMARY KEY,    -- Product SKU (e.g., 'P026', 'P033')
        product_name TEXT,              -- Descriptive Gadget Name
        category TEXT,                  -- Department (e.g., 'Watches & Wearables')
        unit_price REAL,                -- Retail Selling Price (PHP)
        unit_cost REAL                  -- Wholesale Base Cost (PHP)
    );

    -- Dim_Time: Stores standardized ISO-8601 time hierarchies for hourly/daily BI trends
    CREATE TABLE IF NOT EXISTS Dim_Time (
        date_id TEXT PRIMARY KEY,       -- Hourly grain key formatted as YYYYMMDDHH (e.g., '2026102220')
        full_date TEXT,                 -- Standardized ISO-8601 timestamp string
        year INTEGER,                   -- Extracted Year (cast to INT)
        month INTEGER,                  -- Extracted Month 1-12 (cast to INT)
        day INTEGER,                    -- Extracted Day 1-31 (cast to INT)
        hour INTEGER                    -- Extracted Hour 0-23 (cast to INT for hourly sales chart)
    );

    -- ========================================================================
    -- 2. CORE FACT TABLE (Quantitative Measures & Foreign Keys)
    -- ========================================================================

    -- Fact_Sales: Central analytical table grain = 1 row per completed order
    -- Note: 'transaction_id TEXT UNIQUE' enforces idempotency (prevents duplicate loading)
    CREATE TABLE IF NOT EXISTS Fact_Sales (
        fact_id INTEGER PRIMARY KEY AUTOINCREMENT, -- Warehouse Surrogate Key
        transaction_id TEXT UNIQUE,                -- Degenerate Dimension / Order ID from Node A
        customer_id TEXT,                          -- FK -> Dim_Customer.customer_id
        date_id TEXT,                              -- FK -> Dim_Time.date_id
        warehouse_location TEXT,                   -- Fulfillment Hub Dimension (Manila / Cavite / Cebu)
        item_count INTEGER,                        -- Total units sold in this transaction (cast to INT)
        subtotal REAL,                             -- Pre-tax merchandise total (cast to REAL/FLOAT)
        tax_amount REAL,                           -- 12% VAT amount (cast to REAL/FLOAT)
        shipping_fee REAL,                         -- Logistics fee (cast to REAL/FLOAT)
        monetary_value REAL,                       -- Gross Revenue = subtotal + tax + shipping
        net_margin REAL,                           -- Calculated Profit = monetary_value - total_cost - tax_amount
        status TEXT,                               -- Human-readable dimension mapped from 'C' -> 'Completed'
        FOREIGN KEY(customer_id) REFERENCES Dim_Customer(customer_id),
        FOREIGN KEY(date_id) REFERENCES Dim_Time(date_id)
    );
    ";
    
    $pdo->exec($sql);
    echo "Success: Track C Star Schema tables created in warehouse.db\n";

} catch (PDOException $e) {
    echo "Database Error: " . $e->getMessage() . "\n";
}
?>
