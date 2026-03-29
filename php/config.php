<?php
/**
 * FlowerBTC Configuration
 * @description Centralized configuration with environment-based settings
 * @version 2.0.0
 */

// Prevent direct access
if (!defined('FLOWERBTC_SECURE')) {
    define('FLOWERBTC_SECURE', true);
}

// Error handling - don't expose errors in production
$isDevelopment = ($_SERVER['SERVER_NAME'] ?? '') === 'localhost';

if ($isDevelopment) {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
} else {
    error_reporting(0);
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
    ini_set('error_log', __DIR__ . '/../logs/error.log');
}

// Session security
ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_secure', isset($_SERVER['HTTPS']) ? '1' : '0');
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_strict_mode', '1');

/**
 * Database Configuration
 * Load from environment variables or secure config file
 */
function getDatabaseConfig(): array {
    // Try to load from environment variables first
    $config = [
        'host' => $_ENV['DB_HOST'] ?? 'localhost',
        'name' => $_ENV['DB_NAME'] ?? 'flowerbtc',
        'user' => $_ENV['DB_USER'] ?? 'flowerbtc_user',
        'pass' => $_ENV['DB_PASS'] ?? '',
        'charset' => 'utf8mb4'
    ];
    
    // If no environment variables, try to load from secure config file
    $secureConfigFile = __DIR__ . '/../config/database.secure.php';
    if (empty($config['pass']) && file_exists($secureConfigFile)) {
        $secureConfig = require $secureConfigFile;
        $config = array_merge($config, $secureConfig);
    }
    
    return $config;
}

/**
 * Application Configuration
 */
function getAppConfig(): array {
    return [
        'site_name' => 'FlowerBTC',
        'site_url' => 'https://flowerbtc.io',
        'admin_email' => 'admin@flowerbtc.io',
        'support_email' => 'support@flowerbtc.io',
        'version' => '2.0.0',
        'csrf_token_lifetime' => 3600, // 1 hour
        'rate_limit_requests' => 10,
        'rate_limit_window' => 60, // 1 minute
    ];
}

/**
 * Get PDO database connection
 * @return PDO
 * @throws PDOException
 */
function getDatabaseConnection(): PDO {
    $config = getDatabaseConfig();
    
    $dsn = "mysql:host={$config['host']};dbname={$config['name']};charset={$config['charset']}";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$config['charset']} COLLATE utf8mb4_unicode_ci"
    ];
    
    try {
        return new PDO($dsn, $config['user'], $config['pass'], $options);
    } catch (PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        throw new PDOException("Database connection failed. Please try again later.");
    }
}

/**
 * Generate CSRF token
 * @return string
 */
function generateCsrfToken(): string {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (empty($_SESSION['csrf_token']) || 
        empty($_SESSION['csrf_token_time']) || 
        time() - $_SESSION['csrf_token_time'] > getAppConfig()['csrf_token_lifetime']) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        $_SESSION['csrf_token_time'] = time();
    }
    
    return $_SESSION['csrf_token'];
}

/**
 * Validate CSRF token
 * @param string $token
 * @return bool
 */
function validateCsrfToken(string $token): bool {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    return isset($_SESSION['csrf_token']) && 
           hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Sanitize input string
 * @param string $input
 * @param int $maxLength
 * @return string
 */
function sanitizeInput(string $input, int $maxLength = 1000): string {
    $input = trim($input);
    $input = strip_tags($input);
    $input = htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return substr($input, 0, $maxLength);
}

/**
 * Sanitize email
 * @param string $email
 * @return string
 */
function sanitizeEmail(string $email): string {
    return filter_var(trim($email), FILTER_SANITIZE_EMAIL);
}

/**
 * Validate email
 * @param string $email
 * @return bool
 */
function validateEmail(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Rate limiting check
 * @param string $identifier
 * @return bool
 */
function checkRateLimit(string $identifier): bool {
    $config = getAppConfig();
    $key = 'rate_limit_' . md5($identifier);
    
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    $now = time();
    
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = ['count' => 1, 'time' => $now];
        return true;
    }
    
    $data = $_SESSION[$key];
    
    // Reset if window has passed
    if ($now - $data['time'] > $config['rate_limit_window']) {
        $_SESSION[$key] = ['count' => 1, 'time' => $now];
        return true;
    }
    
    // Check limit
    if ($data['count'] >= $config['rate_limit_requests']) {
        return false;
    }
    
    $_SESSION[$key]['count']++;
    return true;
}

/**
 * Send JSON response
 * @param array $data
 * @param int $statusCode
 */
function sendJsonResponse(array $data, int $statusCode = 200): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    
    echo json_encode($data, JSON_THROW_ON_ERROR);
    exit;
}

/**
 * Log security event
 * @param string $event
 * @param array $context
 */
function logSecurityEvent(string $event, array $context = []): void {
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'event' => $event,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'context' => $context
    ];
    
    $logFile = __DIR__ . '/../logs/security.log';
    $logDir = dirname($logFile);
    
    if (!is_dir($logDir)) {
        mkdir($logDir, 0750, true);
    }
    
    error_log(json_encode($logEntry) . "\n", 3, $logFile);
}
