<?php
// Include the database connection file
include('../api/databaseConnnection.php'); // Adjust the path as necessary

// Get the raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Debug: log the received data to see what is being received
file_put_contents('php://stderr', print_r($data, true)); // This logs to the PHP error log

// Check if orderId and newStatus are provided
if (isset($data['orderId']) && isset($data['newStatus'])) {
    $orderId = $data['orderId'];
    $newStatus = $data['newStatus'];

    // Use the existing connection from dbConnection.php
    global $conn;

    // Update the order status to the new status (e.g., 'Processing')
    $stmt = $conn->prepare("UPDATE orders SET Status = ? WHERE OrderID = ?");
    $stmt->bind_param('si', $newStatus, $orderId);

    if ($stmt->execute()) {
        // Send a success response
        echo json_encode(['success' => true]);
    } else {
        // Send a failure response
        echo json_encode(['success' => false, 'message' => 'Failed to update order status']);
    }

    // Close the statement
    $stmt->close();
} else {
    // Send an error response if the required data is missing
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
}

// Close the database connection (optional, as dbConnection.php should handle this)
$conn->close();
?>
