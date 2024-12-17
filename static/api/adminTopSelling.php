<?php
// Include database connection
require_once '../api/databaseConnnection.php';

try {
    // Define the SQL query to fetch top products based on sales and include the time of sale
    $query = "
        SELECT 
            p.ProductID, 
            p.Name, 
            p.Price, 
            SUBSTRING_INDEX(p.Images, ',', 1) AS Image, 
            p.Sales, 
            MAX(o.CreatedAt) AS LastSoldAt
        FROM products p
        LEFT JOIN orderdetails od ON p.ProductID = od.ProductID
        LEFT JOIN orders o ON od.OrderID = o.OrderID
        GROUP BY p.ProductID
        ORDER BY p.Sales DESC, p.CreatedAt DESC
    ";

    // Execute the query
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();

    // Prepare the products array
    $products = [];
    while ($row = $result->fetch_assoc()) {
        // Set a placeholder image if the field is NULL or empty
        $row['Image'] = $row['Image'] ?: '/placeholder.jpg';
        $products[] = $row;
    }

    // Send the JSON response
    header('Content-Type: application/json');
    echo json_encode($products);
} catch (Exception $e) {
    // Handle errors
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred while fetching products.', 'details' => $e->getMessage()]);
} finally {
    // Close the database connection
    $conn->close();
}
?>
