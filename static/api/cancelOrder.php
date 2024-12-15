<?php
// Include database connection (adjust based on your setup)
include_once '../api/databaseConnnection.php';

// Get the raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Check if the orderId is provided
if (isset($data['orderId'])) {
    $orderId = $data['orderId'];

    // Validate the orderId (Make sure it's a valid integer)
    if (!is_numeric($orderId)) {
        echo json_encode(['success' => false, 'message' => 'Invalid order ID']);
        exit;
    }

    // Check if the order exists and is in a cancellable state
    $query = "SELECT * FROM orders WHERE OrderID = ? AND status IN ('PENDING', 'ON PROCESS')";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $orderId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Proceed with the cancellation by updating the order status
        $updateQuery = "UPDATE orders SET status = 'CANCELLED' WHERE OrderID = ?";
        $updateStmt = $conn->prepare($updateQuery);
        $updateStmt->bind_param("i", $orderId);
        if ($updateStmt->execute()) {
            // Cancellation was successful
            echo json_encode(['success' => true, 'message' => 'Order cancelled successfully']);
        } else {
            // Something went wrong with the update query
            echo json_encode(['success' => false, 'message' => 'Failed to update order status']);
        }
    } else {
        // Order does not exist or is not in a cancellable state
        echo json_encode(['success' => false, 'message' => 'Order cannot be cancelled']);
    }
} else {
    // Invalid request - no order ID provided
    echo json_encode(['success' => false, 'message' => 'Order ID is required']);
}
?>
