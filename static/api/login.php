<?php
// Include database connection file
require_once '../api/databaseConnnection.php'; // Ensure this file connects to your MySQLi database

// Get POST data
$emailOrUsername = $_POST['username'] ?? null;
$password = $_POST['password'] ?? null;

// Validate input
if (!$emailOrUsername || !$password) {
    echo json_encode(['status' => 'error', 'message' => 'Please provide both username and password']);
    exit;
}

// Prepare SQL to check if the user exists
$query = "SELECT * FROM users WHERE Email = ? OR Name = ? LIMIT 1";

// Prepare statement
$stmt = $conn->prepare($query);
if ($stmt === false) {
    echo json_encode(['status' => 'error', 'message' => 'Database error']);
    exit;
}

// Bind parameters and execute the statement
$stmt->bind_param('ss', $emailOrUsername, $emailOrUsername);
$stmt->execute();

// Get result
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user) {
    // Check if the password matches
    if (password_verify($password, $user['PasswordHash'])) {
        // Success: Login successful, create a session or return user data
        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful',
            'username' => $user['Name'],
            'email' => $user['Email']
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid password']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'User not found']);
}

// Close the statement
$stmt->close();
?>
