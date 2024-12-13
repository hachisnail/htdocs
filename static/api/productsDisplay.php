<?php
// Configure session cookie parameters
session_set_cookie_params([
    'lifetime' => 0,        // Session cookie expires when the browser is closed
    'path' => '/',          // Path where the cookie is valid
    'domain' => '192.168.2.0',  // Adjust to the correct domain or IP address
    'secure' => false,      // Set to true if using HTTPS
    'httponly' => true      // Ensures the cookie is accessible only via HTTP
]);

// Start the session
session_start();

// Include the database connection file
include '../api/databaseConnnection.php';

// Set the content type to JSON for the response
header('Content-Type: application/json');

// Get the category name and search term from the URL parameters
$categoryName = isset($_GET['categoryName']) ? $_GET['categoryName'] : '';
$searchTerm = isset($_GET['searchTerm']) ? $_GET['searchTerm'] : '';

// Start building the query
$query = "
    SELECT 
        p.ProductID, 
        p.Name AS ProductName, 
        p.Price, 
        p.Details, 
        p.Tags, 
        p.Stock, 
        p.Sales, 
        p.CreatedAt, 
        p.Images, 
        c.Name AS CategoryName
    FROM 
        products p
    INNER JOIN 
        categories c ON p.CategoryID = c.CategoryID
";

// Initialize an array for the query parameters
$params = [];
$types = "";

// Add category filter if category name is provided
if (!empty($categoryName)) {
    $query .= " WHERE c.Name = ?";
    $params[] = $categoryName;
    $types .= "s";  // 's' for string type
}

// Add search term filter if search term is provided
if (!empty($searchTerm)) {
    // Add AND condition if a category filter is already applied
    if (!empty($categoryName)) {
        $query .= " AND (p.Name LIKE ? 
                        OR p.Details LIKE ? 
                        OR p.Tags LIKE ? 
                        OR p.Price LIKE ? 
                        OR p.Stock LIKE ? 
                        OR p.Sales LIKE ? 
                        OR c.Name LIKE ?)";
    } else {
        $query .= " WHERE (p.Name LIKE ? 
                           OR p.Details LIKE ? 
                           OR p.Tags LIKE ? 
                           OR p.Price LIKE ? 
                           OR p.Stock LIKE ? 
                           OR p.Sales LIKE ? 
                           OR c.Name LIKE ?)";
    }
    
    // Add the search term to the parameters for all searchable fields
    $searchWildcard = "%" . $searchTerm . "%";
    $params = array_merge($params, array_fill(0, 7, $searchWildcard)); // Add 7 times for each field
    $types .= "sssssss";  // 7 's' for the parameters
}

// Prepare the SQL query
$stmt = $conn->prepare($query);

// Bind the parameters if necessary
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

// Execute the query
$stmt->execute();

// Get the result
$result = $stmt->get_result();

// Check if there are any products found
if ($result->num_rows > 0) {
    // Fetch all rows as an associative array
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    // Return the products as JSON
    echo json_encode([
        "status" => "success",
        "message" => "Products fetched successfully",
        "data" => $products
    ]);
} else {
    // If no products are found, return an empty array
    echo json_encode([
        "status" => "success",
        "message" => "No products found",
        "data" => []
    ]);
}

// Close the statement
$stmt->close();

// Close the database connection
$conn->close();
?>
