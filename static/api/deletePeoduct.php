<?php
session_set_cookie_params([
    'lifetime' => 0,        // Session cookie expires when the browser is closed
    'path' => '/',          // Path where the cookie is valid
    'domain' => 'localhost',  // Adjust to the correct domain or IP address
    'secure' => false,      // Set to true if using HTTPS
    'httponly' => true      // Ensures the cookie is accessible only via HTTP
]);

session_start();


// Include the database connection file
include '../api/databaseConnnection.php';

// Set the appropriate headers
header('Content-Type: application/json');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the input data from the request body
    $input = json_decode(file_get_contents('php://input'), true);

    // Check if 'id' is provided in the request body
    if (isset($input['id'])) {
        $id = intval($input['id']); // Sanitize the input (convert to integer)

        // Prepare the SQL statement
        $stmt = $conn->prepare("DELETE FROM `products` WHERE ProductID = ?");
        $stmt->bind_param("i", $id); // Bind the parameter

        // Execute the statement and check for errors
        if ($stmt->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "Product with ID $id has been deleted."
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Failed to delete product. Please try again."
            ]);
        }

        // Close the statement
        $stmt->close();
    } else {
        // 'id' is missing in the request
        echo json_encode([
            "status" => "error",
            "message" => "Product ID is required."
        ]);
    }
} else {
    // Invalid request method
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method. Use POST."
    ]);
}

// Close the database connection
$conn->close();
?>
