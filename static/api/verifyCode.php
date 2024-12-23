<?php
session_start();
require '../api/databaseConnnection.php'; // Your database connection file

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $code = $_POST['code'];
    $username = $_POST['username'];
    $password = $_POST['password'];

    if (isset($_SESSION['email_confirmation']) && $_SESSION['email_confirmation']['email'] === $email) {
        if ($_SESSION['email_confirmation']['code'] == $code) {
            // Hash the password
            $passwordHash = password_hash($password, PASSWORD_BCRYPT);

            // Insert user into the database using mysqli
            $stmt = $conn->prepare("INSERT INTO users (Name, Email, PasswordHash) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $username, $email, $passwordHash); // "sss" means string types for 3 parameters

            if ($stmt->execute()) {
                unset($_SESSION['email_confirmation']); // Clear session
                echo json_encode(['status' => 'success', 'message' => 'Account created successfully']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to insert user into the database']);
            }

            $stmt->close();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid confirmation code']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No confirmation code found']);
    }
}
?>
