<?php
// Include the database connection
require_once '../api/databaseConnnection.php'; // Assuming you have a file to handle DB connection

// Get the OrderID from the query parameter
$orderId = isset($_GET['id']) ? (int)$_GET['id'] : 0; // Sanitizing the input

// Check if the orderId is valid
if ($orderId > 0) {
    // Prepare the query to fetch the order data from the database
    $query = "SELECT 
                  o.OrderID,
                  o.FullName AS customer_name,
                  o.City AS city,
                  o.Province AS province,
                  o.ZipCode AS zipcode,
                  o.PhoneNumber AS phone,
                  o.DeliveryInstructions AS delivery_instructions,
                  o.Status AS status,
                  u.Name AS username,
                  p.Name AS product_name,
                  p.ProductID AS product_id,
                  od.sizes AS product_size,
                  od.Quantity AS quantity,
                  od.Subtotal AS product_total_price
              FROM orders o
              INNER JOIN orderdetails od ON o.OrderID = od.OrderID
              INNER JOIN products p ON od.ProductID = p.ProductID
              INNER JOIN users u ON o.UserID = u.UserID 
              WHERE o.OrderID = ?";

    // Prepare the statement
    if ($stmt = $conn->prepare($query)) {
        // Bind the parameter
        $stmt->bind_param("i", $orderId);

        // Execute the query
        $stmt->execute();

        // Get the result
        $result = $stmt->get_result();

        // Check if we have data
        if ($result->num_rows > 0) {
            $order = [
                "orders" => []
            ];

            // Fetch the data and format it for the response
            while ($row = $result->fetch_assoc()) {
                // For the first row, populate order-level information
                if (empty($order['orders'])) {
                    $order['orders'][] = [
                        "OrderID" => $row['OrderID'],
                        "name" => $row['username'],
                        "customer_name" => $row['customer_name'],
                        "city" => $row['city'],
                        "province" => $row['province'],
                        "zipcode" => $row['zipcode'],
                        "phone" => $row['phone'],
                        "delivery_instructions" => $row['delivery_instructions'],
                        "status" => $row['status'],
                        "items" => []
                    ];
                }

                // Add product details to the order's items
                $order['orders'][0]['items'][] = [
                    "product_name" => $row['product_name'],
                    "product_id" => $row['product_id'],
                    "product_size" => $row['product_size'],
                    "quantity" => $row['quantity'],
                    "product_total_price" => $row['product_total_price']
                ];
            }

            // Return the data as a JSON response
            echo json_encode($order);
        } else {
            // No data found for the given OrderID
            echo json_encode(["error" => "No order data found for the provided Order ID."]);
        }

        // Close the statement
        $stmt->close();
    } else {
        // Error with the query preparation
        echo json_encode(["error" => "Failed to prepare query."]);
    }
} else {
    // Invalid OrderID
    echo json_encode(["error" => "Invalid Order ID provided."]);
}

// Close the database connection
$conn->close();
?>
