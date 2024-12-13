<?php
// Include the database connection


include 'databaseConnnection.php';

// Set the content type to JSON
header('Content-Type: application/json');

// Get the ProductID from the query string (GET request)
$productId = isset($_GET['ProductID']) ? $_GET['ProductID'] : '';

// If ProductID is not provided, return an error
if (empty($productId)) {
    echo json_encode([
        "status" => "error",
        "message" => "Product ID is required"
    ]);
    exit;
}

// Prepare the SQL query with a placeholder
$query = "SELECT * FROM products WHERE ProductID = ?";

// Prepare the statement
$stmt = $conn->prepare($query);

// Bind the ProductID parameter to the query
$stmt->bind_param("i", $productId);

// Execute the query
$stmt->execute();

// Get the result
$result = $stmt->get_result();

// Check if the product is found
if ($result->num_rows > 0) {
    // Fetch the product details
    $product = $result->fetch_assoc();
    echo json_encode([
        "status" => "success",
        "data" => $product
    ]);
} else {
    // If no product is found
    echo json_encode([
        "status" => "error",
        "message" => "Product not found"
    ]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
