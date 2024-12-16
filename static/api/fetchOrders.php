<?php
include '../api/databaseConnnection.php';

// Set the Content-Type header
header('Content-Type: application/json');

// Check if username is provided
if (!isset($_GET['username'])) {
    echo json_encode(['error' => 'Username is required']);
    exit;
}

$username = $_GET['username']; // Get the username from the query parameter

// Optionally, get the search term
$searchTerm = isset($_GET['query']) ? $_GET['query'] : ''; // Changed from 'search' to 'query' to match the JS request

// Prepare the SQL query to fetch UserID based on the provided username
$query_user = "SELECT UserID FROM users WHERE Name = ? LIMIT 1";  // Use 'Name' as the column for username

// Prepare statement for user query
$stmt_user = $conn->prepare($query_user);
if ($stmt_user === false) {
    echo json_encode(['error' => 'Failed to prepare user query']);
    exit;
}

// Bind parameters and execute the query for user
$stmt_user->bind_param('s', $username); // 's' denotes the parameter type (string)
$stmt_user->execute();

// Get the result
$result_user = $stmt_user->get_result();

// Check if a user is found
if ($result_user->num_rows > 0) {
    // Fetch the UserID
    $row_user = $result_user->fetch_assoc();
    $user_id = $row_user['UserID'];  // Use 'UserID' instead of 'user_id'

    // Now, we can proceed to fetch the orders using the obtained UserID
    $query_orders = "
    SELECT 
        o.OrderID,
        o.Status AS order_status,
        o.FullName AS customer_name,
        o.FullAddress AS customer_address,
        o.City,
        o.Province,
        o.ZipCode,
        o.PhoneNumber,
        o.DeliveryInstructions,
        o.CreatedAt AS order_created_at,
        od.ProductID,
        p.Name AS product_name,
        od.sizes AS product_size,
        od.Quantity,
        od.Subtotal AS product_subtotal,
        p.Price AS product_price,
        p.Images AS product_images,
        (od.Quantity * p.Price) AS product_total_price
    FROM orders o
    JOIN orderdetails od ON o.OrderID = od.OrderID
    JOIN products p ON od.ProductID = p.ProductID
    WHERE o.UserID = ?";

    // If search term is provided, modify the query to filter by order ID or product name
    if (!empty($searchTerm)) {
        $searchTerm = "%" . $searchTerm . "%"; // Add wildcard for SQL LIKE search
        $query_orders .= " AND (o.OrderID LIKE ? OR p.Name LIKE ?)";
    }

    $query_orders .= " ORDER BY o.OrderID DESC"; // Ensure the orders are sorted by OrderID

    // Prepare statement for orders query
    $stmt_orders = $conn->prepare($query_orders);
    if ($stmt_orders === false) {
        echo json_encode(['error' => 'Failed to prepare orders query']);
        exit;
    }

    // Bind parameters and execute the query for orders
    if (!empty($searchTerm)) {
        $stmt_orders->bind_param('iss', $user_id, $searchTerm, $searchTerm); // 's' for string, 'i' for integer
    } else {
        $stmt_orders->bind_param('i', $user_id); // Only user ID if no search term
    }

    $stmt_orders->execute();

    // Get the result for orders
    $result_orders = $stmt_orders->get_result();

    // Check if any orders were returned
    if ($result_orders->num_rows > 0) {
        $orders = [];

        // Fetch all orders and prepare the data
        while ($row = $result_orders->fetch_assoc()) {
            // Group the order data by OrderID
            if (!isset($orders[$row['OrderID']])) {
                $orders[$row['OrderID']] = [
                    'OrderID' => $row['OrderID'],
                    'status' => $row['order_status'],
                    'customer_name' => $row['customer_name'],
                    'customer_address' => $row['customer_address'],
                    'city' => $row['City'],
                    'province' => $row['Province'],
                    'zipcode' => $row['ZipCode'],
                    'phone' => $row['PhoneNumber'],
                    'delivery_instructions' => $row['DeliveryInstructions'],
                    'order_created_at' => $row['order_created_at'],
                    'items' => [] // To store the products for this order
                ];
            }

            // Add product details to the respective order
            $orders[$row['OrderID']]['items'][] = [
                'product_id' => $row['ProductID'],
                'product_name' => $row['product_name'],
                'product_size' => $row['product_size'],
                'quantity' => $row['Quantity'],
                'product_subtotal' => $row['product_subtotal'],
                'product_price' => $row['product_price'],
                'product_total_price' => $row['product_total_price'],
                'product_images' => !empty($row['product_images']) ? explode(',', $row['product_images'])[0] : null // Get only the first image
            ];
        }

        // Return the orders as JSON
        echo json_encode(['orders' => array_values($orders)]);
    } else {
        // No orders found for the given UserID
        echo json_encode(['message' => 'No orders found']);
    }

    // Close the orders statement
    $stmt_orders->close();
} else {
    // No user found for the provided username
    echo json_encode(['error' => 'User not found']);
}

// Close the user statement and connection
$stmt_user->close();
$conn->close();
?>
