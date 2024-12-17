<?php
// Database connection
include '../api/databaseConnnection.php';

// Fetch the top 4 products based on sales
$sql = "SELECT 
            ProductID, 
            Name, 
            Price, 
            SUBSTRING_INDEX(Images, ',', 1) AS Image 
        FROM products 
        ORDER BY Sales DESC, CreatedAt DESC 
        LIMIT 4";

$result = $conn->query($sql);

$products = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Fallback to a placeholder image if the Image field is NULL or empty
        $row['Image'] = $row['Image'] ?: '/placeholder.jpg';
        $products[] = $row;
    }
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($products);

$conn->close();
?>
