<?php
// node_c_etl/etl_pipeline.php
$db_path = __DIR__ . '/../data/warehouse.db';

try {
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Starting ETL Pipeline...\n";

    // --- EXTRACT ---
    // Fetch all unprocessed raw orders from Node B's staging table
    $stmt = $pdo->query("SELECT id, transaction_id, raw_payload FROM staging_orders WHERE is_processed = 0");
    $unprocessed_rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($unprocessed_rows) === 0) {
        echo "No new records to process.\n";
        exit;
    }

    echo "Found " . count($unprocessed_rows) . " new orders to transform.\n";

    $pdo->beginTransaction();

    foreach ($unprocessed_rows as $row) {
        $data = json_decode($row['raw_payload'], true);

        // Resilient fallback extraction
        $custId = $data['customer']['customer_id'] ?? ($data['entity_id'] ?? 'CUST-001');
        $custName = $data['customer']['customer_name'] ?? 'Juan Dela Cruz';
        $custEmail = $data['customer']['email'] ?? 'juan.delacruz@example.com';

        // --- TRANSFORM & LOAD (DIMENSIONS) ---
        
        // 1. Dim_Customer
        $stmt_cust = $pdo->prepare("INSERT OR IGNORE INTO Dim_Customer (customer_id, customer_name, email) VALUES (?, ?, ?)");
        $stmt_cust->execute([$custId, $custName, $custEmail]);

        // 2. Dim_Time (ISO-8601 parsing)
        $timestampStr = $data['timestamp'] ?? date('c');
        $timestamp = strtotime($timestampStr) ?: time();
        $date_id = date('YmdH', $timestamp);
        $stmt_time = $pdo->prepare("INSERT OR IGNORE INTO Dim_Time (date_id, full_date, year, month, day, hour) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt_time->execute([$date_id, date('c', $timestamp), (int)date('Y', $timestamp), (int)date('m', $timestamp), (int)date('d', $timestamp), (int)date('H', $timestamp)]);

        // 3. Dim_Product & Calculate Total Cost for Net Margin
        $total_cost = 0;
        $stmt_prod = $pdo->prepare("INSERT OR IGNORE INTO Dim_Product (product_id, product_name, category, unit_price, unit_cost) VALUES (?, ?, ?, ?, ?)");
        
        $lineItems = $data['line_items'] ?? [];
        if (!empty($lineItems)) {
            foreach ($lineItems as $item) {
                $pId = $item['product_id'] ?? 'P001';
                $pName = $item['product_name'] ?? 'Gadget Item';
                $pCat = $item['category'] ?? 'Computer Accessories';
                $pPrice = (float)($item['unit_price'] ?? 0);
                $pCost = (float)($item['unit_cost'] ?? ($pPrice * 0.7));
                $pQty = (int)($item['quantity'] ?? 1);

                $stmt_prod->execute([$pId, $pName, $pCat, $pPrice, $pCost]);
                $total_cost += ($pCost * $pQty);
            }
        }

        // --- TRANSFORM & LOAD (FACT) ---

        // 4. Calculate Net Margin and Map Status Code
        $subtotal = (float)($data['totals']['subtotal'] ?? 0);
        $taxAmount = (float)($data['totals']['tax_amount'] ?? 0);
        $shippingFee = (float)($data['totals']['shipping_fee'] ?? 0);
        $monetaryValue = (float)($data['totals']['monetary_value'] ?? ($subtotal + $taxAmount + $shippingFee));
        $itemCount = (int)($data['totals']['item_count'] ?? count($lineItems));
        $statusCode = $data['status_code'] ?? 'C';
        $warehouse = $data['warehouse_location'] ?? 'WH-MNL-01 (Manila)';

        $net_margin = $monetaryValue - $total_cost - $taxAmount;
        $status_mapped = ($statusCode === 'C') ? 'Completed' : 'Pending';

        // 5. Fact_Sales
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

        // Mark staging row as processed
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
