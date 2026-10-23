<?php
/**
 * ============================================================================
 * ITEC 116 - GROUP ACTIVITY 6: TRACK B (BI & DATA ENGINEERS)
 * File: node_b_ingestion/db_staging.php
 * ============================================================================
 *
 * [RUBRIC REQUIREMENT - TASK 1: BI Staging Node (Track B)]
 * "Program the Module 7 BI Data Ingestion Endpoint/Staging table to receive,
 *  authenticate, and log incoming transactional feeds."
 *
 * HOW THIS WORKS (FOR ORAL DEFENSE):
 * 1. Creates the `staging_orders` table inside `data/warehouse.db`.
 * 2. Why do we use a Staging Table (`staging_orders`) instead of inserting
 *    directly into `Fact_Sales`?
 *    - Decoupling & Resilience: Node B captures the exact raw JSON string
 *      (`raw_payload TEXT`) as fast as possible without slowing down the
 *      customer's checkout experience.
 *    - Auditability: Keeping the original `raw_payload` alongside `received_at`
 *      and `is_processed` (0 = waiting for ETL, 1 = processed by Track C)
 *      allows Track D to audit 100% row reconciliation and replay data if needed.
 * ============================================================================
 */

$db_path = __DIR__ . '/../data/warehouse.db';

// Ensure the data directory exists
if (!is_dir(dirname($db_path))) {
    mkdir(dirname($db_path), 0777, true);
}

try {
    // Connect to SQLite (creates warehouse.db if it doesn't exist)
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create the Track B Staging Table
    $sql = "
    CREATE TABLE IF NOT EXISTS staging_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,          -- Auto-incrementing Staging Log ID
        transaction_id TEXT NOT NULL,                  -- Order ID from Node A (e.g., 'ORD-2026-1234')
        raw_payload TEXT NOT NULL,                     -- Complete unedited JSON payload string (Schema v1.1)
        received_at DATETIME DEFAULT CURRENT_TIMESTAMP,-- Ingestion timestamp
        is_processed INTEGER DEFAULT 0                 -- ETL Flag: 0 = Pending Track C ETL, 1 = Loaded into Star Schema
    )";
    
    $pdo->exec($sql);
    echo "Success: Staging table created in data/warehouse.db\n";

} catch (PDOException $e) {
    echo "Database Error: " . $e->getMessage() . "\n";
}
?>
