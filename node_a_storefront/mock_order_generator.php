<?php
// Set timezone to Manila for correct ISO-8601 timestamps
date_default_timezone_set('Asia/Manila');

// 1. Mock Database (Products, Customers, Warehouses)
$customers = [
    ["id" => "CUST-001", "name" => "Juan Dela Cruz", "email" => "juan.delacruz@example.com"],
    ["id" => "CUST-002", "name" => "Maria Clara", "email" => "maria.clara@example.com"],
    ["id" => "CUST-003", "name" => "Jose Rizal", "email" => "jose.rizal@example.com"]
];

$products = [
    ["id" => "P001", "name" => "Hamster Wireless Mouse", "category" => "Mice", "price" => 599, "cost" => 380],
    ["id" => "P026", "name" => "Spider-Punk Wearable Mask", "category" => "Collectibles & Gear", "price" => 3899, "cost" => 2600],
    ["id" => "P029", "name" => "Ultimate Ergonomic Gaming Chair", "category" => "Chairs & Setup", "price" => 12499, "cost" => 8500],
    ["id" => "P008", "name" => "Geto Suguru Ceramic Mug", "category" => "Desk Accessories", "price" => 650, "cost" => 380],
    ["id" => "P003", "name" => "Moon Cherry Mechanical Keyboard", "category" => "Keyboards", "price" => 2499, "cost" => 1800],
    ["id" => "P011", "name" => "Multiport 7-in-1 USB-C Hub", "category" => "Hubs & Docks", "price" => 1299, "cost" => 900],
    ["id" => "P007", "name" => "Cyberpunk Neon XXL Desk Mat", "category" => "Desk Accessories", "price" => 750, "cost" => 450],
    ["id" => "P005", "name" => "Auroza RGB Gaming Mouse", "category" => "Mice", "price" => 899, "cost" => 600]
];

$warehouses = ["WH-MNL-01 (Manila)", "WH-CAV-02 (Dasmariñas)", "WH-CEB-01 (Cebu)"];

function generate_dynamic_order($customers, $products, $warehouses) {
    // 2. Setup Random Variables
    $customer = $customers[array_rand($customers)];
    $warehouse = $warehouses[array_rand($warehouses)];
    $transaction_id = "ORD-2026-" . rand(1000, 9999);
    
    // ISO-8601 formatted timestamp
    $timestamp = date('c');

    // 3. Dynamically Generate Line Items
    $num_items = rand(1, 3); // Customer buys 1 to 3 different products
    shuffle($products);
    $selected_products = array_slice($products, 0, $num_items);
    
    $line_items = [];
    $item_count = 0;
    $subtotal = 0;
    $line_no = 1;

    foreach ($selected_products as $prod) {
        $qty = rand(1, 5); // Customer buys 1 to 5 pieces of this product
        $line_total = $qty * $prod["price"];
        
        $line_items[] = [
            "line_no" => $line_no++,
            "product_id" => $prod["id"],
            "product_name" => $prod["name"],
            "category" => $prod["category"],
            "quantity" => $qty,
            "unit_price" => $prod["price"],
            "unit_cost" => $prod["cost"],
            "line_total" => $line_total
        ];
        
        $item_count += $qty;
        $subtotal += $line_total;
    }

    // 4. Calculate Dynamic Totals
    $tax_rate = 0.12;
    $tax_amount = round($subtotal * $tax_rate, 2);
    
    $shipping_options = [0, 50, 100];
    $shipping_fee = $shipping_options[array_rand($shipping_options)]; 
    $monetary_value = round($subtotal + $tax_amount + $shipping_fee, 2);

    $payment_methods = ["GCash", "Credit Card", "Maya"];
    $event_id = "EVT-" . strtoupper(bin2hex(random_bytes(4)));
    $reference_no = "PAY-" . strtoupper(bin2hex(random_bytes(4)));

    // 5. Build the Final Payload (Team A's Schema)
    $payload = [
        "schema_version" => "1.1",
        "event_id" => $event_id,
        "event_type" => "Order Completed",
        "source_system" => "Node-A-ECommerce-Storefront",
        "warehouse_location" => $warehouse,
        "transaction_id" => $transaction_id,
        "timestamp" => $timestamp,
        "entity_type" => "Customer",
        "entity_id" => $customer["id"],
        "customer" => [
            "customer_id" => $customer["id"],
            "customer_name" => $customer["name"],
            "email" => $customer["email"]
        ],
        "status" => "Completed",
        "status_code" => "C",
        "payment" => [
            "method" => $payment_methods[array_rand($payment_methods)],
            "payment_status" => "Paid",
            "reference_no" => $reference_no
        ],
        "currency" => "PHP",
        "line_items" => $line_items,
        "totals" => [
            "item_count" => $item_count,
            "subtotal" => $subtotal,
            "discount" => 0,
            "tax_rate" => $tax_rate,
            "tax_amount" => $tax_amount,
            "shipping_fee" => $shipping_fee,
            "monetary_value" => $monetary_value
        ]
    ];
    
    return $payload;
}

// Generate 1 random order and echo it as JSON
$new_order = generate_dynamic_order($customers, $products, $warehouses);
$json_payload = json_encode($new_order);

echo "Sending Transaction: " . $new_order['transaction_id'] . "...\n";

// Use cURL to POST the data to Track B
$ch = curl_init('http://127.0.0.1:5000/server.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $json_payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer itec116_secret_token'
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Response Code: " . $http_code . "\n";
echo "Response Body: " . $response . "\n";
?>