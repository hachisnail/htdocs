<?php
// Database connection
include '../api/databaseConnnection.php';

// Fetch the newest 4 products
$sql = "SELECT 
            ProductID, 
            Name, 
            Price, 
            SUBSTRING_INDEX(Images, ',', 1) AS Image 
        FROM products 
        ORDER BY CreatedAt DESC 
        LIMIT 4";

$result = $conn->query($sql);

$products = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($products);

$conn->close();
?>
