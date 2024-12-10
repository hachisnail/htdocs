<?php
$host = 'localhost';
$username = 'root'; 
$password = '';
$dbname = 'kosupure';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]));
}
?>
