<?php
/**
 * View Messages - Admin Panel
 * @description Secure admin interface for viewing contact form submissions
 * @version 2.0.0
 */

define('FLOWERBTC_SECURE', true);
require_once __DIR__ . '/config.php';

// Simple authentication (replace with proper auth system in production)
$adminPassword = $_ENV['ADMIN_PASSWORD'] ?? '';
$isAuthenticated = false;

if (isset($_POST['password'])) {
    if (password_verify($_POST['password'], $adminPassword)) {
        $_SESSION['admin_authenticated'] = true;
        $_SESSION['admin_login_time'] = time();
    } else {
        $error = 'Invalid password';
        logSecurityEvent('admin_login_failed', ['ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown']);
    }
}

$isAuthenticated = !empty($_SESSION['admin_authenticated']) && 
                   (time() - ($_SESSION['admin_login_time'] ?? 0)) < 3600; // 1 hour session

// Logout
if (isset($_GET['logout'])) {
    unset($_SESSION['admin_authenticated']);
    unset($_SESSION['admin_login_time']);
    header('Location: view_messages.php');
    exit;
}

// Pagination
$page = filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT) ?: 1;
$page = max(1, $page);
$perPage = 20;
$offset = ($page - 1) * $perPage;

$messages = [];
$totalMessages = 0;
$totalPages = 0;

if ($isAuthenticated) {
    try {
        $pdo = getDatabaseConnection();
        
        // Get total count
        $totalMessages = $pdo->query("SELECT COUNT(*) FROM messages")->fetchColumn();
        $totalPages = ceil($totalMessages / $perPage);
        
        // Get messages for current page
        $stmt = $pdo->prepare("SELECT * FROM messages ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $stmt->execute([$perPage, $offset]);
        $messages = $stmt->fetchAll();
        
    } catch (PDOException $e) {
        error_log("Error fetching messages: " . $e->getMessage());
        $error = 'Failed to load messages';
    }
}

// Output HTML
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlowerBTC - Admin Messages</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0a0a0a;
            color: #fff;
            line-height: 1.6;
            padding: 2rem;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { margin-bottom: 1rem; color: #ffd700; }
        .login-form {
            max-width: 400px;
            margin: 5rem auto;
            padding: 2rem;
            background: #1a1a1a;
            border-radius: 10px;
            border: 1px solid #333;
        }
        .login-form input {
            width: 100%;
            padding: 0.75rem;
            margin: 0.5rem 0;
            background: #0a0a0a;
            border: 1px solid #333;
            color: #fff;
            border-radius: 5px;
        }
        .login-form button {
            width: 100%;
            padding: 0.75rem;
            background: #ffd700;
            color: #0a0a0a;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        }
        .error { color: #ff4444; margin-bottom: 1rem; }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #333;
        }
        .logout-btn {
            padding: 0.5rem 1rem;
            background: #ff4444;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .stat-card {
            background: #1a1a1a;
            padding: 1rem;
            border-radius: 10px;
            border: 1px solid #333;
        }
        .stat-card h3 { color: #888; font-size: 0.875rem; margin-bottom: 0.5rem; }
        .stat-card .value { font-size: 1.5rem; color: #ffd700; }
        table {
            width: 100%;
            border-collapse: collapse;
            background: #1a1a1a;
            border-radius: 10px;
            overflow: hidden;
        }
        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #333;
        }
        th {
            background: #222;
            font-weight: 600;
            color: #ffd700;
        }
        tr:hover { background: #222; }
        .message-preview {
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .pagination {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 2rem;
        }
        .pagination a, .pagination span {
            padding: 0.5rem 1rem;
            background: #1a1a1a;
            border: 1px solid #333;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }
        .pagination a:hover { background: #333; }
        .pagination .current { background: #ffd700; color: #0a0a0a; }
        .empty-state {
            text-align: center;
            padding: 3rem;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <?php if (!$isAuthenticated): ?>
            <div class="login-form">
                <h1>Admin Login</h1>
                <?php if (isset($error)): ?>
                    <p class="error"><?php echo htmlspecialchars($error); ?></p>
                <?php endif; ?>
                <form method="POST">
                    <input type="password" name="password" placeholder="Enter admin password" required autofocus>
                    <button type="submit">Login</button>
                </form>
            </div>
        <?php else: ?>
            <div class="header">
                <h1>Messages</h1>
                <a href="?logout=1" class="logout-btn">Logout</a>
            </div>
            
            <div class="stats">
                <div class="stat-card">
                    <h3>Total Messages</h3>
                    <div class="value"><?php echo number_format($totalMessages); ?></div>
                </div>
                <div class="stat-card">
                    <h3>Current Page</h3>
                    <div class="value"><?php echo $page; ?> / <?php echo max(1, $totalPages); ?></div>
                </div>
            </div>
            
            <?php if (empty($messages)): ?>
                <div class="empty-state">
                    <p>No messages yet.</p>
                </div>
            <?php else: ?>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Newsletter</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($messages as $msg): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($msg['created_at']); ?></td>
                                <td><?php echo htmlspecialchars($msg['name']); ?></td>
                                <td><?php echo htmlspecialchars($msg['email']); ?></td>
                                <td><?php echo htmlspecialchars($msg['subject']); ?></td>
                                <td class="message-preview" title="<?php echo htmlspecialchars($msg['message']); ?>">
                                    <?php echo htmlspecialchars(substr($msg['message'], 0, 50)) . (strlen($msg['message']) > 50 ? '...' : ''); ?>
                                </td>
                                <td><?php echo $msg['newsletter'] ? 'Yes' : 'No'; ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                
                <?php if ($totalPages > 1): ?>
                    <div class="pagination">
                        <?php if ($page > 1): ?>
                            <a href="?page=<?php echo $page - 1; ?>">← Previous</a>
                        <?php endif; ?>
                        
                        <?php for ($i = max(1, $page - 2); $i <= min($totalPages, $page + 2); $i++): ?>
                            <?php if ($i === $page): ?>
                                <span class="current"><?php echo $i; ?></span>
                            <?php else: ?>
                                <a href="?page=<?php echo $i; ?>"><?php echo $i; ?></a>
                            <?php endif; ?>
                        <?php endfor; ?>
                        
                        <?php if ($page < $totalPages): ?>
                            <a href="?page=<?php echo $page + 1; ?>">Next →</a>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            <?php endif; ?>
        <?php endif; ?>
    </div>
</body>
</html>
