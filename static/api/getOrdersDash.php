<?php
include '../api/databaseConnnection.php'; // Include your database connection file

header('Content-Type: application/json');

// Query to join users and orders tables, with filtering for only 'Pending' orders
$query = "SELECT 
    orders.OrderID, 
    orders.FullName, 
    orders.Status, 
    orders.CreatedAt, 
    users.Name, 
    (SELECT SUM(Quantity * Subtotal) 
     FROM orderdetails 
     WHERE orderdetails.OrderID = orders.OrderID) AS Total
FROM orders
JOIN users ON orders.UserID = users.UserID
WHERE orders.Status = 'Pending'
ORDER BY orders.CreatedAt DESC;
"; // Filtering only 'Pending' orders

$result = $conn->query($query);

if ($result->num_rows > 0) {
    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = [
            'OrderID' => $row['OrderID'],
            'FullName' => $row['FullName'],
            'Name' => $row['Name'],
            'Status' => $row['Status'],
            'CreatedAt' => $row['CreatedAt'],
            'Total' => $row['Total']
        ];
    }
    echo json_encode($orders);
} else {
    echo json_encode([]); // No pending orders found
}

$conn->close();
?>
