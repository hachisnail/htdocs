<?php
// Start the session and ensure no output is sent before this
session_start();
header('Content-Type: application/json');

if (isset($_SERVER['HTTP_ORIGIN'])) {
    $allowedOrigins = ['http://localhost']; // Add allowed origins here
    if (in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
        header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
        header('Access-Control-Allow-Credentials: true'); // Allow credentials (cookies)
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    exit(0); // Exit to prevent further processing for preflight requests
}

// Debug session creation
if (!isset($_SESSION)) {
    echo json_encode(['status' => 'error', 'message' => 'Session could not be started']);
    exit();
}

// Include database connection
include_once "databaseConnnection.php";

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$user = $data['username'] ?? '';
$pass = $data['password'] ?? '';

if (!$user || !$pass) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit();
}

// Prepare and execute the query to fetch the admin user
$stmt = $conn->prepare("SELECT * FROM admin_users WHERE username = ?");
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $admin = $result->fetch_assoc();

    // Verify the password
    if (password_verify($pass, $admin['password'])) {
        // Set session variable on successful login
        $_SESSION['user_logged_in'] = true;

        // Debug session data
        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful',
            'session_id' => session_id(),
            'session_data' => $_SESSION
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid username or password']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid username or password']);
}

$stmt->close();
$conn->close();
?>