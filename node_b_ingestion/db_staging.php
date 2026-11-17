<?php


$db_path = __DIR__ . '/../data/warehouse.db';

if (!is_dir(dirname($db_path))) {
    mkdir(dirname($db_path), 0777, true);
}

try {

    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "
    CREATE TABLE IF NOT EXISTS staging_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id TEXT NOT NULL,
        raw_payload TEXT NOT NULL,
        received_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_processed INTEGER DEFAULT 0
    )";

    $pdo->exec($sql);
    echo "Success: Staging table created in data/warehouse.db\n";

} catch (PDOException $e) {
    echo "Database Error: " . $e->getMessage() . "\n";
}
?>
