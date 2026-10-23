<?php
/**
 * ============================================================================
 * ITEC 116 - GROUP ACTIVITY 6: TRACK B (BI & DATA ENGINEERS)
 * File: node_b_ingestion/auth.php
 * ============================================================================
 *
 * [RUBRIC REQUIREMENT - TASK 1: BI Staging Node (Track B)]
 * "Program Node B to establish a staging endpoint that captures incoming
 *  transactional streams, verifies request headers/tokens, and appends raw
 *  data to an ingestion log."
 *
 * HOW THIS WORKS (FOR ORAL DEFENSE):
 * - Every POST request from Node A (Storefront) must carry the HTTP header:
 *   `Authorization: Bearer itec116_secret_token`
 * - If a request is missing this header or provides the wrong token, Node B
 *   immediately rejects the payload with HTTP `401 Unauthorized` before
 *   touching the SQLite database.
 * ============================================================================
 */

define('BI_SECRET_TOKEN', 'Bearer itec116_secret_token');

/**
 * Validates the incoming HTTP Authorization Bearer header.
 * Terminates with 401 Unauthorized if invalid.
 */
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
