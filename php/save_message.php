<?php
/**
 * Save Message Handler
 * @description Securely saves contact form messages to database
 * @version 2.0.0
 */

define('FLOWERBTC_SECURE', true);
require_once __DIR__ . '/config.php';

// Initialize response
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

try {
    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    // Rate limiting
    $clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    if (!checkRateLimit($clientIp)) {
        logSecurityEvent('rate_limit_exceeded', ['ip' => $clientIp]);
        throw new Exception('Too many requests. Please try again later.');
    }

    // CSRF validation
    $csrfToken = $_POST['csrf_token'] ?? '';
    if (!validateCsrfToken($csrfToken)) {
        logSecurityEvent('csrf_validation_failed', ['ip' => $clientIp]);
        throw new Exception('Invalid security token. Please refresh the page and try again.');
    }

    // Honeypot check (anti-spam)
    if (!empty($_POST['website'])) {
        logSecurityEvent('honeypot_triggered', ['ip' => $clientIp]);
        throw new Exception('Spam detected');
    }

    // Validate required fields
    $requiredFields = ['name', 'email', 'subject', 'message'];
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            $response['errors'][$field] = ucfirst($field) . ' is required';
        }
    }

    if (!empty($response['errors'])) {
        throw new Exception('Validation failed');
    }

    // Sanitize inputs
    $name = sanitizeInput($_POST['name'], 100);
    $email = sanitizeEmail($_POST['email']);
    $phone = !empty($_POST['phone']) ? sanitizeInput($_POST['phone'], 50) : null;
    $company = !empty($_POST['company']) ? sanitizeInput($_POST['company'], 100) : null;
    $subject = sanitizeInput($_POST['subject'], 200);
    $message = sanitizeInput($_POST['message'], 5000);
    $newsletter = !empty($_POST['newsletter']);

    // Validate email format
    if (!validateEmail($email)) {
        $response['errors']['email'] = 'Invalid email format';
        throw new Exception('Validation failed');
    }

    // Get database connection
    $pdo = getDatabaseConnection();

    // Prepare and execute insert statement
    $stmt = $pdo->prepare("INSERT INTO messages (name, email, phone, company, subject, message, newsletter, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    
    $stmt->execute([
        $name,
        $email,
        $phone,
        $company,
        $subject,
        $message,
        $newsletter ? 1 : 0,
        $clientIp,
        $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ]);

    // Send notification email to admin
    $appConfig = getAppConfig();
    $emailSubject = "[{$appConfig['site_name']}] New Contact Form Submission";
    $emailBody = "Name: $name\n";
    $emailBody .= "Email: $email\n";
    $emailBody .= "Phone: " . ($phone ?: 'N/A') . "\n";
    $emailBody .= "Company: " . ($company ?: 'N/A') . "\n";
    $emailBody .= "Subject: $subject\n";
    $emailBody .= "Message:\n$message\n";
    
    $headers = "From: {$appConfig['site_name']} <noreply@flowerbtc.io>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    @mail($appConfig['admin_email'], $emailSubject, $emailBody, $headers);

    // Set success response
    $response['success'] = true;
    $response['message'] = 'Thank you! Your message has been sent successfully. We will get back to you soon.';
    
    logSecurityEvent('message_saved', [
        'ip' => $clientIp,
        'email' => $email
    ]);

} catch (PDOException $e) {
    error_log("Database error in save_message.php: " . $e->getMessage());
    $response['message'] = 'An error occurred while saving your message. Please try again later.';
    
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    
    if (empty($response['errors'])) {
        $response['errors']['general'] = $e->getMessage();
    }
}

// Send response
sendJsonResponse($response);
