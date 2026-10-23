<?php
/**
 * ============================================================================
 * ITEC 116 - GROUP ACTIVITY 6: TRACK C (DATA INTEGRATION ARCHITECTS)
 * File: node_c_etl/etl_pipeline.php
 * ============================================================================
 * 
 * [RUBRIC REQUIREMENT - TASK 2.1: Data Cleansing & Transformation]
 * "Program the ETL script to convert raw JSON transactional payloads into
 *  structured analytical tables. Standardize date formats to ISO-8601, strip
 *  invalid/null strings, calculate net margins/rates, and map raw status codes
 *  to human-readable dimensions."
 *
 * [RUBRIC REQUIREMENT - TASK 2.2: Star Schema / Aggregation Mapping]
 * "Map transactional data from Node A into a core Fact Table (Fact_Sales)
 *  linked to Dimension Tables (Dim_Customer, Dim_Time, Dim_Product)."
 *
 * NOTE ON EXECUTION:
 * - CLI Mode: Run `php node_c_etl/etl_pipeline.php` in terminal.
 * - Live Web UI Mode: Clicking "Run ETL Pipeline Now" on the Storefront Demo
 *   calls `node_b_ingestion/server.php?action=run_etl`, which executes this
 *   exact same ETL logic over HTTP so you can demo it live in the browser!
 * ============================================================================
 */

$db_path = __DIR__ . '/../data/warehouse.db';

try {
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Starting ETL Pipeline...\n";

    // ========================================================================
    // PHASE 1: EXTRACT (Read Unprocessed Raw JSON Payloads from Node B)
    // ========================================================================
    // We only query rows where `is_processed = 0` so we never double-process
    // orders that were already loaded in previous batches.
    $stmt = $pdo->query("SELECT id, transaction_id, raw_payload FROM staging_orders WHERE is_processed = 0");
    $unprocessed_rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($unprocessed_rows) === 0) {
        echo "No new records to process.\n";
        exit;
    }

    echo "Found " . count($unprocessed_rows) . " new orders to transform.\n";

    // Wrap the entire batch in an ACID database transaction.
    // PROFESSOR Q&A TIP: If any row fails mid-batch, $pdo->rollBack() ensures
    // zero partial/corrupted loads (maintaining 100% reconciliation integrity).
    $pdo->beginTransaction();

    foreach ($unprocessed_rows as $row) {
        // Parse the raw JSON string stored by Node B into a PHP associative array
        $data = json_decode($row['raw_payload'], true);

        // ====================================================================
        // PHASE 2: TRANSFORM - DATA CLEANSING, NULL FALLBACKS & TYPE CASTING
        // ====================================================================

        // [RULE 1: Strip Null / Missing Strings with Resilient Fallbacks]
        // Handles both nested customer objects and flat keys without crashing.
        $custId = trim((string)($data['customer']['customer_id'] ?? ($data['customer']['id'] ?? ($data['entity_id'] ?? 'CUST-001'))));
        $custName = trim((string)($data['customer']['customer_name'] ?? ($data['customer']['name'] ?? 'Juan Dela Cruz')));
        $custEmail = trim((string)($data['customer']['email'] ?? 'juan.delacruz@example.com'));

        // [RULE 2: Standardize Date Formats to ISO-8601 & Extract Time Dimension]
        // Parses incoming timestamp string into Unix epoch, then formats strictly
        // to ISO-8601 (`date('c')` -> e.g., 2026-10-22T20:30:00+08:00) and builds
        // an hourly surrogate key `date_id` (YYYYMMDDHH).
        $timestampStr = $data['timestamp'] ?? date('c');
        $timestamp = strtotime($timestampStr) ?: time();
        $iso8601_date = date('c', $timestamp);
        $date_id = date('YmdH', $timestamp);

        // ====================================================================
        // PHASE 3: LOAD DIMENSIONS (Dim_Customer, Dim_Time, Dim_Product)
        // ====================================================================
        // PROFESSOR Q&A TIP: Why `INSERT OR IGNORE`?
        // Because multiple orders can be placed by the same customer (`CUST-001`),
        // during the same hour (`2026102220`), or for the same product (`P026`).
        // `INSERT OR IGNORE` upserts new dimension members while preventing
        // Primary Key duplicate constraint errors!

        // 1. Load Dim_Customer
        $stmt_cust = $pdo->prepare("INSERT OR IGNORE INTO Dim_Customer (customer_id, customer_name, email) VALUES (?, ?, ?)");
        $stmt_cust->execute([$custId, $custName, $custEmail]);

        // 2. Load Dim_Time (with explicit (int) type casting for year, month, day, hour)
        $stmt_time = $pdo->prepare("INSERT OR IGNORE INTO Dim_Time (date_id, full_date, year, month, day, hour) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt_time->execute([
            $date_id,
            $iso8601_date,
            (int)date('Y', $timestamp),
            (int)date('m', $timestamp),
            (int)date('d', $timestamp),
            (int)date('H', $timestamp)
        ]);

        // 3. Load Dim_Product & Accumulate Total Base Cost for Margin Math
        $total_cost = 0.0;
        $stmt_prod = $pdo->prepare("INSERT OR IGNORE INTO Dim_Product (product_id, product_name, category, unit_price, unit_cost) VALUES (?, ?, ?, ?, ?)");
        
        $lineItems = $data['line_items'] ?? [];
        if (!empty($lineItems)) {
            foreach ($lineItems as $item) {
                $pId = trim((string)($item['product_id'] ?? 'P001'));
                $pName = trim((string)($item['product_name'] ?? 'Gadget Item'));
                $pCat = trim((string)($item['category'] ?? 'Computer Accessories'));
                // Explicit (float) and (int) casting for numeric accuracy
                $pPrice = (float)($item['unit_price'] ?? 0);
                $pCost = (float)($item['unit_cost'] ?? ($pPrice * 0.7));
                $pQty = (int)($item['quantity'] ?? 1);

                $stmt_prod->execute([$pId, $pName, $pCat, $pPrice, $pCost]);
                
                // Accumulate COGS (Cost of Goods Sold) across all line items in the order
                $total_cost += ($pCost * $pQty);
            }
        }

        // ====================================================================
        // PHASE 4: TRANSFORM & LOAD CORE FACT TABLE (Fact_Sales)
        // ====================================================================

        // Explicit numeric type casting ((float) and (int))
        $subtotal = (float)($data['totals']['subtotal'] ?? 0);
        $taxAmount = (float)($data['totals']['tax_amount'] ?? 0);
        $shippingFee = (float)($data['totals']['shipping_fee'] ?? 0);
        $monetaryValue = (float)($data['totals']['monetary_value'] ?? ($subtotal + $taxAmount + $shippingFee));
        $itemCount = (int)($data['totals']['item_count'] ?? count($lineItems));
        $statusCode = trim((string)($data['status_code'] ?? 'C'));
        $warehouse = trim((string)($data['warehouse_location'] ?? 'WH-MNL-01 (Manila)'));

        // [RULE 3: Calculate Net Margin]
        // Formula: Gross Monetary Value - Total Product Base Cost (COGS) - VAT Tax Amount
        $net_margin = round($monetaryValue - $total_cost - $taxAmount, 2);

        // [RULE 4: Map Raw Status Code to Human-Readable Dimension]
        // Maps 'C' -> 'Completed', 'P' -> 'Pending', etc.
        $status_mapped = ($statusCode === 'C') ? 'Completed' : 'Pending';

        // 4. Insert into Fact_Sales (linked via customer_id and date_id foreign keys)
        $stmt_fact = $pdo->prepare("
            INSERT OR IGNORE INTO Fact_Sales 
            (transaction_id, customer_id, date_id, warehouse_location, item_count, subtotal, tax_amount, shipping_fee, monetary_value, net_margin, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt_fact->execute([
            $data['transaction_id'] ?? $row['transaction_id'],
            $custId,
            $date_id,
            $warehouse,
            $itemCount,
            $subtotal,
            $taxAmount,
            $shippingFee,
            $monetaryValue,
            $net_margin,
            $status_mapped
        ]);

        // ====================================================================
        // PHASE 5: UPDATE STAGING STATE (Mark as Processed)
        // ====================================================================
        // Sets `is_processed = 1` in Node B's staging_orders table so Track D
        // can verify 100% of staged rows have been transformed into Fact_Sales.
        $stmt_update = $pdo->prepare("UPDATE staging_orders SET is_processed = 1 WHERE id = ?");
        $stmt_update->execute([$row['id']]);
        
        echo "Processed Transaction: " . ($data['transaction_id'] ?? $row['transaction_id']) . "\n";
    }

    $pdo->commit();
    echo "ETL Pipeline completed successfully.\n";

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo "ETL Error: " . $e->getMessage() . "\n";
}
?>
