<?php
/**
 * Send Email Handler
 * @description Securely sends contact form emails
 * @version 2.0.0
 */

define('FLOWERBTC_SECURE', true);
require_once __DIR__ . '/config.php';

// Initialize response
$response = [
    'success' => false,
    'message' => ''
];

try {
    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    // Rate limiting
    $clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    if (!checkRateLimit($clientIp)) {
        logSecurityEvent('rate_limit_exceeded', ['ip' => $clientIp, 'endpoint' => 'send_email']);
        throw new Exception('Too many requests. Please try again later.');
    }

    // CSRF validation
    $csrfToken = $_POST['csrf_token'] ?? '';
    if (!validateCsrfToken($csrfToken)) {
        logSecurityEvent('csrf_validation_failed', ['ip' => $clientIp, 'endpoint' => 'send_email']);
        throw new Exception('Invalid security token. Please refresh the page and try again.');
    }

    // Get and sanitize form data
    $name = sanitizeInput($_POST['name'] ?? '', 100);
    $email = sanitizeEmail($_POST['email'] ?? '');
    $subject = sanitizeInput($_POST['subject'] ?? '', 200);
    $message = sanitizeInput($_POST['message'] ?? '', 5000);

    // Validate required fields
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        throw new Exception('All fields are required');
    }

    // Validate email format
    if (!validateEmail($email)) {
        throw new Exception('Invalid email address');
    }

    // Get app config
    $appConfig = getAppConfig();

    // Prepare email content
    $emailSubject = "[{$appConfig['site_name']}] New Contact Form Submission: $subject";
    $emailBody = "You have received a new message from your website contact form.\n\n";
    $emailBody .= "Name: $name\n";
    $emailBody .= "Email: $email\n";
    $emailBody .= "Subject: $subject\n\n";
    $emailBody .= "Message:\n$message\n";
    $emailBody .= "\n---\n";
    $emailBody .= "IP Address: $clientIp\n";
    $emailBody .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown') . "\n";
    $emailBody .= "Date: " . date('Y-m-d H:i:s') . "\n";

    // Email headers
    $headers = "From: {$appConfig['site_name']} <noreply@flowerbtc.io>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    $headers .= "X-Originating-IP: $clientIp\r\n";

    // Send email
    $mailSent = mail($appConfig['admin_email'], $emailSubject, $emailBody, $headers);

    if ($mailSent) {
        $response['success'] = true;
        $response['message'] = 'Thank you! Your message has been sent successfully.';
        
        logSecurityEvent('email_sent', [
            'ip' => $clientIp,
            'email' => $email,
            'subject' => $subject
        ]);
    } else {
        throw new Exception('Failed to send message. Please try again later.');
    }

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    error_log("Error in send_email.php: " . $e->getMessage());
}

// Send response
sendJsonResponse($response);
