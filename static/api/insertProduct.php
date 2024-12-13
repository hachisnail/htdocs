<?php
// Include your database connection file
session_set_cookie_params([
    'lifetime' => 0,        // Session cookie expires when the browser is closed
    'path' => '/',          // Path where the cookie is valid
    'domain' => '192.168.2.0',  // Adjust to the correct domain or IP address
    'secure' => false,      // Set to true if using HTTPS
    'httponly' => true      // Ensures the cookie is accessible only via HTTP
]);

session_start();


// Include the database connection file
include '../api/databaseConnnection.php'; // Adjust path if necessary

// Set the content type to JSON for the response
header('Content-Type: application/json');

// Check if the user is logged in by verifying the session variable 'user_logged_in'
if (!isset($_SESSION['user_logged_in']) || $_SESSION['user_logged_in'] !== true) {
    echo json_encode([
        "status" => "error",
        "message" => "Unauthorized access. Please log in.",
        "data" => []
    ]);
    exit; // Stop further script execution if not authenticated
}


include '../api/databaseConnnection.php'; // Adjusted path since db_connect.php is inside the 'api' folder

// Directory to store uploaded images (using $_SERVER['DOCUMENT_ROOT'])
$targetDir = $_SERVER['DOCUMENT_ROOT'] . "/static/assets/productsImages/"; // Ensure this directory exists and is writable

// Function to handle image uploads
function uploadImage($file) {
    global $targetDir;

    // Check if the file is an image (basic check)
    $fileType = mime_content_type($file['tmp_name']);
    if (strpos($fileType, 'image') === false) {
        return false; // Not an image
    }

    // Get the original filename
    $imageName = basename($file['name']);
    $targetFile = $targetDir . $imageName;

    // Check if the file already exists
    if (file_exists($targetFile)) {
        return false; // File already exists
    }

    // Move the file to the target directory
    if (move_uploaded_file($file['tmp_name'], $targetFile)) {
        return $imageName;
    } else {
        return false; // Error uploading the file
    }
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the product data (it should be passed as a JSON string in the 'productData' field)
    $productData = json_decode($_POST['productData'], true);

    // Check if the product data is valid
    if ($productData) {
        // Get the data from the product data
        $name = $productData['Name'];
        $price = $productData['Price'];
        $details = $productData['Details'];
        $tags = $productData['Tags']; // Expect a comma-separated string
        $stock = $productData['Stock'];
        $categoryID = $productData['CategoryID'];

        // Process the tags (break down by comma)
        $tagsArray = explode(',', $tags);
        $tagsString = implode(',', $tagsArray);

        // Process the uploaded images
        $images = [];
        if (isset($_FILES['Images']) && !empty($_FILES['Images']['name'][0])) {
            // Limit to 4 files
            $fileLimit = 4;
            $numFiles = count($_FILES['Images']['name']);
            $numFiles = ($numFiles > $fileLimit) ? $fileLimit : $numFiles;

            // Loop through the uploaded images and handle them
            for ($i = 0; $i < $numFiles; $i++) {
                $file = [
                    'name' => $_FILES['Images']['name'][$i],
                    'tmp_name' => $_FILES['Images']['tmp_name'][$i],
                    'size' => $_FILES['Images']['size'][$i],
                    'error' => $_FILES['Images']['error'][$i]
                ];

                $uploadedImage = uploadImage($file);
                if ($uploadedImage) {
                    $images[] = $uploadedImage; // Add uploaded image to the list
                }
            }
        }

        // Convert the image filenames array to a comma-separated string
        $imagesString = !empty($images) ? implode(',', $images) : null;

        // Prepare the SQL query to insert the product into the database
        $query = "
            INSERT INTO `products` ( `Name`, `Price`, `Details`, `Tags`, `Stock`, `CategoryID`, `CreatedAt`, `Images`)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
        ";

        // Prepare the statement
        $stmt = $conn->prepare($query);

        // Bind the parameters (use appropriate types: s for strings, d for decimal/numbers)
        $stmt->bind_param("sdssdss", $name, $price, $details, $tagsString, $stock, $categoryID, $imagesString);

        // Execute the query and return a response
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Product added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to add product"]);
        }

        // Close the statement and database connection
        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid input data"]);
    }
}
?>
