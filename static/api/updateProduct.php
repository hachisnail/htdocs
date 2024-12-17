<?php
require_once '../api/databaseConnnection.php';

try {
    // Get JSON input data
    $inputData = json_decode(file_get_contents('php://input'), true);
    
    // Debug: Check if the input data is correct
    file_put_contents('php://stderr', print_r($inputData, true)); // Output to PHP error log

    if (isset($inputData['ProductID'], $inputData['Name'], $inputData['Price'], $inputData['Stock'], $inputData['Details'], $inputData['Tags'])) {
        $productID = $inputData['ProductID'];
        $name = $inputData['Name'];
        $price = $inputData['Price'];
        $stock = $inputData['Stock'];
        $details = $inputData['Details'];
        $tags = $inputData['Tags'];

        // Update product data in the database
        $query = "UPDATE products SET Name = ?, Price = ?, Stock = ?, Details = ?, Tags = ? WHERE ProductID = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sdissi", $name, $price, $stock, $details, $tags, $productID);
        $stmt->execute();

        // Debug: Check the number of affected rows
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Product update failed.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid data received.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
} finally {
    $conn->close();
}
?>
