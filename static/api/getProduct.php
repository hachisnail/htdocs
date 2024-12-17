<?php
require_once '../api/databaseConnnection.php';

try {
    // Get the product ID from the query string
    if (isset($_GET['id'])) {
        $productID = (int) $_GET['id'];

        // Fetch the product details from the database
        $query = "SELECT * FROM products WHERE ProductID = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $productID);
        $stmt->execute();
        $result = $stmt->get_result();

        // Check if the product was found
        if ($result->num_rows > 0) {
            $product = $result->fetch_assoc();
            // Send the product data as JSON response
            echo json_encode($product);
        } else {
            echo json_encode(['success' => false, 'message' => 'Product not found.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Product ID is required.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
} finally {
    $conn->close();
}
?>
