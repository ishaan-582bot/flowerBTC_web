<?php
// Database configuration
$db_host = 'localhost';
$db_name = 'flowerbtc';
$db_user = 'root';
$db_pass = '';

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Initialize response array
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Validate honeypot field
        if (!empty($_POST['website'])) {
            throw new Exception('Spam detected');
        }

        // Validate required fields
        $required_fields = ['name', 'email', 'subject', 'message'];
        foreach ($required_fields as $field) {
            if (empty($_POST[$field])) {
                $response['errors'][$field] = ucfirst($field) . ' is required';
            }
        }

        // Validate email format
        if (!empty($_POST['email']) && !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            $response['errors']['email'] = 'Invalid email format';
        }

        // If there are errors, throw exception
        if (!empty($response['errors'])) {
            throw new Exception('Validation failed');
        }

        // Sanitize inputs
        $name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
        $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
        $phone = !empty($_POST['phone']) ? filter_var($_POST['phone'], FILTER_SANITIZE_STRING) : null;
        $company = !empty($_POST['company']) ? filter_var($_POST['company'], FILTER_SANITIZE_STRING) : null;
        $subject = filter_var($_POST['subject'], FILTER_SANITIZE_STRING);
        $message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);

        // Connect to database
        $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Prepare and execute insert statement
        $stmt = $pdo->prepare("INSERT INTO messages (name, email, phone, company, subject, message) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name, $email, $phone, $company, $subject, $message]);

        // Set success response
        $response['success'] = true;
        $response['message'] = 'Message sent successfully!';

    } catch (Exception $e) {
        $response['message'] = 'Error: ' . $e->getMessage();
    }
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response); 