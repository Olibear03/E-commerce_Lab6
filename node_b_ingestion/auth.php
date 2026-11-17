<?php


define('BI_SECRET_TOKEN', 'Bearer itec116_secret_token');

function verify_ingestion_auth(): void {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $auth_header = $headers['Authorization'] ?? ($headers['authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? ''));

    if ($auth_header !== BI_SECRET_TOKEN) {
        http_response_code(401);
        echo json_encode([
            "error" => "Unauthorized. Invalid or missing Bearer token."
        ]);
        exit;
    }
}
?>
