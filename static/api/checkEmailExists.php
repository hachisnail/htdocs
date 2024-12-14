<?php
require 'databaseConnnection.php'; // Your database connection file

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];

    // Prepare the SQL query
    $stmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE Email = ?");
    $stmt->bind_param("s", $email); // Bind the email parameter
    $stmt->execute();
    $stmt->bind_result($emailCount);
    $stmt->fetch();

    // Check if the email exists
    if ($emailCount > 0) {
        echo json_encode(['exists' => true]);
    } else {
        echo json_encode(['exists' => false]);
    }

    $stmt->close();
}
?>
