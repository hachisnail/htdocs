<?php
require_once '../api/databaseConnnection.php'; // Include the database connection

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); 
    echo json_encode(['message' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

// Extract data from the payload
$fullName = $data['fullName'];
$fullAddress = $data['fullAddress'];
$city = $data['city'];
$province = $data['province'];
$zipCode = $data['zipCode'];
$phoneNumber = $data['phoneNumber'];
$deliveryInstructions = $data['deliveryInstructions'];
$userId = $data['userId']; // If userId is "guest", it can be NULL
$shoppingBag = $data['shoppingBag'];

if ($userId == "guest") {
    $userId = NULL;  // Treat guest as NULL in the database
}

// Start a database transaction
$conn->begin_transaction();

try {
    // If a userId is provided, fetch the actual UserID from the database
    if ($userId) {
        $stmt = $conn->prepare("SELECT UserID FROM users WHERE Name = ?");
        $stmt->bind_param("s", $userId);  // Assuming $userId is actually a 'Name' field
        $stmt->execute();
        $stmt->bind_result($userIdFromDB);
        $stmt->fetch();
        $stmt->close();  // Close the statement to avoid command sync issues

        if ($userIdFromDB) {
            $userId = $userIdFromDB; // Use the valid UserID
        } else {
            $userId = NULL;  // If the user doesn't exist, treat as guest
        }
    }

    // Insert the order into the 'orders' table
    $stmt = $conn->prepare("INSERT INTO orders (UserID, FullName, FullAddress, City, Province, ZipCode, PhoneNumber, DeliveryInstructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isssssss", $userId, $fullName, $fullAddress, $city, $province, $zipCode, $phoneNumber, $deliveryInstructions);

    if (!$stmt->execute()) {
        throw new Exception("Failed to insert order: " . $stmt->error);
    }

    // Retrieve the inserted OrderID
    $orderId = $stmt->insert_id;
    if (!$orderId) {
        throw new Exception("Failed to retrieve Order ID after insert.");
    }

    // Loop through the shopping bag and insert order details for each item
    foreach ($shoppingBag as $item) {
        if (!isset($item['ProductID']) || !isset($item['Quantity']) || !isset($item['Subtotal'])) {
            throw new Exception("Missing necessary shopping bag item data: " . json_encode($item));
        }

        $productId = $item['ProductID'];
        $quantity = $item['Quantity'];
        $size = $item['size'];
        $subtotal = $item['Subtotal'];

        $stmt = $conn->prepare("INSERT INTO orderdetails (OrderID, ProductID, Quantity, sizes, Subtotal) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iiisi", $orderId, $productId, $quantity, $size, $subtotal);
        if (!$stmt->execute()) {
            throw new Exception("Failed to insert order details: " . $stmt->error);
        }
        $stmt->close();  // Close the statement after executing

        // Check product stock
        $stmt = $conn->prepare("SELECT Stock FROM products WHERE ProductID = ?");
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $stmt->bind_result($currentStock);
        $stmt->fetch();
        $stmt->close();  // Close the statement after fetching the result

        if ($currentStock < $quantity) {
            throw new Exception("Not enough stock for product ID " . $productId);
        }

        // Update the product stock after the order
        $stmt = $conn->prepare("UPDATE products SET Stock = Stock - ? WHERE ProductID = ?");
        $stmt->bind_param("ii", $quantity, $productId);
        if (!$stmt->execute()) {
            throw new Exception("Failed to update product stock: " . $stmt->error);
        }
        $stmt->close();  // Close the statement after executing the update
    }

    // Commit the transaction
    $conn->commit();

    // Return success response with the orderId
    echo json_encode(['orderId' => $orderId]);
} catch (Exception $e) {
    // Rollback if there's an error
    $conn->rollback();
    echo json_encode(['message' => 'Failed to place order: ' . $e->getMessage()]);
}
?>
