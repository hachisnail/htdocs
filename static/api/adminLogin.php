<?php
session_set_cookie_params([
    'lifetime' => 0, // Session cookie expires when browser is closed
    'path' => '/admin/', // Path where the cookie is valid
    'domain' => $_SERVER['HTTP_HOST'], // Use the server's host dynamically
    'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on', // Set to true if using HTTPS
    'httponly' => true // Ensures the cookie is accessible only via HTTP
]);

session_start();

// Set response type
header('Content-Type: application/json');

// Add cache-control headers
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Handle CORS headers for cross-origin requests
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $allowedOrigins = ['http://localhost', 'https://mediumpurple-raccoon-269311.hostingersite.com']; // Add allowed origins here
    if (in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
        header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
        header('Access-Control-Allow-Credentials: true'); // Allow credentials (cookies)
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
}

// Handle preflight requests (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    exit(0);
}

// Check if session is started properly
if (session_status() !== PHP_SESSION_ACTIVE) {
    echo json_encode(['status' => 'error', 'message' => 'Session could not be started']);
    exit();
}

// Include the database connection file
include_once "databaseConnnection.php";

// Get POST data (JSON body)
$data = json_decode(file_get_contents('php://input'), true);
$user = $data['username'] ?? '';
$pass = $data['password'] ?? '';

// Validate input
if (!$user || !$pass) {
    echo json_encode(['status' => 'error', 'message' => 'Username or password not provided']);
    exit();
}

// Prepare SQL query to check if the username exists
$stmt = $conn->prepare("SELECT * FROM admin_users WHERE username = ?");
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $admin = $result->fetch_assoc();

    // Verify the password (ensure you stored it securely with password_hash)
    if (password_verify($pass, $admin['password'])) {
        // Set session variables for the logged-in user
        $_SESSION['user_logged_in'] = true;
        $_SESSION['user_id'] = $admin['id'];

        // Ensure the session ID is sent back for JavaScript-based cookie handling
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
