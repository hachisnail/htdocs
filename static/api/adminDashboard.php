<?php
// Include database connection
require_once '../api/databaseConnnection.php';

try {
    // Get the total number of products
    $productQuery = "SELECT COUNT(*) as totalProducts FROM products";
    $productResult = $conn->query($productQuery);
    $totalProducts = $productResult->fetch_assoc()['totalProducts'];

    // Get the total number of customers (users)
    $customerQuery = "SELECT COUNT(*) as totalCustomers FROM users";
    $customerResult = $conn->query($customerQuery);
    $totalCustomers = $customerResult->fetch_assoc()['totalCustomers'];

    // Get the total number of orders
    $orderQuery = "SELECT COUNT(*) as totalOrders FROM orders";
    $orderResult = $conn->query($orderQuery);
    $totalOrders = $orderResult->fetch_assoc()['totalOrders'];

    // Get the total number of guest orders (where UserID is NULL)
    $guestQuery = "SELECT COUNT(*) as totalGuests FROM orders WHERE UserID IS NULL";
    $guestResult = $conn->query($guestQuery);
    $totalGuests = $guestResult->fetch_assoc()['totalGuests'];

    // Prepare the response array
    $response = [
        'totalProducts' => $totalProducts,
        'totalCustomers' => $totalCustomers,
        'totalOrders' => $totalOrders,
        'totalGuests' => $totalGuests
    ];

    // Set the content type as JSON and return the response
    header('Content-Type: application/json');
    echo json_encode($response);
} catch (Exception $e) {
    // Handle errors
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred while fetching data.', 'details' => $e->getMessage()]);
} finally {
    // Close the database connection
    $conn->close();
}
?>
