<?php
// node_c_etl/schema_setup.php
$db_path = __DIR__ . '/../data/warehouse.db';

try {
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "
    -- 1. Create Dimension Tables
    CREATE TABLE IF NOT EXISTS Dim_Customer (
        customer_id TEXT PRIMARY KEY,
        customer_name TEXT,
        email TEXT
    );

    CREATE TABLE IF NOT EXISTS Dim_Product (
        product_id TEXT PRIMARY KEY,
        product_name TEXT,
        category TEXT,
        unit_price REAL,
        unit_cost REAL
    );

    CREATE TABLE IF NOT EXISTS Dim_Time (
        date_id TEXT PRIMARY KEY,
        full_date TEXT,
        year INTEGER,
        month INTEGER,
        day INTEGER,
        hour INTEGER
    );

    -- 2. Create Fact Table
    CREATE TABLE IF NOT EXISTS Fact_Sales (
        fact_id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id TEXT UNIQUE,
        customer_id TEXT,
        date_id TEXT,
        warehouse_location TEXT,
        item_count INTEGER,
        subtotal REAL,
        tax_amount REAL,
        shipping_fee REAL,
        monetary_value REAL,
        net_margin REAL,
        status TEXT,
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