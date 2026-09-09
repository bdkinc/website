<?php
/**
 * Headless theme: send the public site to Astro; everything else 404s.
 */
if (!defined('ABSPATH')) {
    exit;
}

$frontend = getenv('FRONTEND_URL') ?: 'https://www.bdkinc.com';
$request_path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$is_root = ($request_path === '/' || $request_path === '' || $request_path === '/index.php');

if ($is_root && $frontend) {
    wp_redirect($frontend, 302);
    exit;
}

status_header(404);
nocache_headers();
header('Content-Type: text/plain; charset=utf-8');
echo 'Not found';
exit;
