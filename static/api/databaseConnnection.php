<?php
$host = 'srv1632.hstgr.io';
$username = 'u143688490_hachisnail'; 
$password = 'Hachisnail5000';
$dbname = 'u143688490_kusupure';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]));
}
?>
