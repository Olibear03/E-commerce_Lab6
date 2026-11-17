<?php

$db_path = __DIR__ . '/../data/warehouse.db';

try {
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Starting ETL Pipeline...\n";

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

        $custId = trim((string)($data['customer']['customer_id'] ?? ($data['customer']['id'] ?? ($data['entity_id'] ?? 'CUST-001'))));
        $custName = trim((string)($data['customer']['customer_name'] ?? ($data['customer']['name'] ?? 'Juan Dela Cruz')));
        $custEmail = trim((string)($data['customer']['email'] ?? 'juan.delacruz@example.com'));

        $timestampStr = $data['timestamp'] ?? date('c');
        $timestamp = strtotime($timestampStr) ?: time();
        $iso8601_date = date('c', $timestamp);
        $date_id = date('YmdH', $timestamp);

        $stmt_cust = $pdo->prepare("INSERT OR IGNORE INTO Dim_Customer (customer_id, customer_name, email) VALUES (?, ?, ?)");
        $stmt_cust->execute([$custId, $custName, $custEmail]);

        $stmt_time = $pdo->prepare("INSERT OR IGNORE INTO Dim_Time (date_id, full_date, year, month, day, hour) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt_time->execute([
            $date_id,
            $iso8601_date,
            (int)date('Y', $timestamp),
            (int)date('m', $timestamp),
            (int)date('d', $timestamp),
            (int)date('H', $timestamp)
        ]);

        $total_cost = 0.0;
        $stmt_prod = $pdo->prepare("INSERT OR IGNORE INTO Dim_Product (product_id, product_name, category, unit_price, unit_cost) VALUES (?, ?, ?, ?, ?)");

        $lineItems = $data['line_items'] ?? [];
        if (!empty($lineItems)) {
            foreach ($lineItems as $item) {
                $pId = trim((string)($item['product_id'] ?? 'P001'));
                $pName = trim((string)($item['product_name'] ?? 'Gadget Item'));
                $pCat = trim((string)($item['category'] ?? 'Computer Accessories'));

                $pPrice = (float)($item['unit_price'] ?? 0);
                $pCost = (float)($item['unit_cost'] ?? ($pPrice * 0.7));
                $pQty = (int)($item['quantity'] ?? 1);

                $stmt_prod->execute([$pId, $pName, $pCat, $pPrice, $pCost]);

                $total_cost += ($pCost * $pQty);
            }
        }

        $subtotal = (float)($data['totals']['subtotal'] ?? 0);
        $taxAmount = (float)($data['totals']['tax_amount'] ?? 0);
        $shippingFee = (float)($data['totals']['shipping_fee'] ?? 0);
        $monetaryValue = (float)($data['totals']['monetary_value'] ?? ($subtotal + $taxAmount + $shippingFee));
        $itemCount = (int)($data['totals']['item_count'] ?? count($lineItems));
        $statusCode = trim((string)($data['status_code'] ?? 'C'));
        $warehouse = trim((string)($data['warehouse_location'] ?? 'WH-MNL-01 (Manila)'));

        $net_margin = round($monetaryValue - $total_cost - $taxAmount, 2);

        $status_mapped = ($statusCode === 'C') ? 'Completed' : 'Pending';

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
