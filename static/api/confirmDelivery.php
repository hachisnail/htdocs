<?php
// Include database connection (assuming db_connect.php connects to your database)
include_once '../api/databaseConnnection.php';


// Get the raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Check if orderId is provided
if (isset($data['orderId'])) {
    $orderId = $data['orderId'];

    // Validate orderId (make sure it's a numeric value)
    if (!is_numeric($orderId)) {
        echo json_encode(['success' => false, 'message' => 'Invalid order ID']);
        exit;
    }

    // Check if the order exists and get its current status
    $query = "SELECT * FROM orders WHERE OrderID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $orderId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $order = $result->fetch_assoc();

        // If the order status is not already 'Delivered' or 'Completed'
            // Update the order status to 'Delivered'
            $updateQuery = "UPDATE orders SET status = 'CONFIRMED' WHERE OrderID = ?";
            $updateStmt = $conn->prepare($updateQuery);
            $updateStmt->bind_param('i', $orderId);

            if ($updateStmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Delivery confirmed successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update order status']);
            }

    } else {
        echo json_encode(['success' => false, 'message' => 'Order not found']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Order ID is required']);
}

?>
