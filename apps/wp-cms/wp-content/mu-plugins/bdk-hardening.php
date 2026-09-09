<?php
/**
 * Plugin Name: BDK Hardening
 * Description: Local/headless hardening: no file editor, no XML-RPC, users REST auth, noindex.
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!defined('DISALLOW_FILE_EDIT')) {
    define('DISALLOW_FILE_EDIT', true);
}

add_filter('xmlrpc_enabled', '__return_false');

// Gate the users REST endpoints against the RESOLVED route (covers both
// permalink and ?rest_route= forms, including URL-encoded variants) rather
// than the raw request URI, which can be bypassed with encoding.
add_filter('rest_pre_dispatch', 'bdk_hardening_users_rest_auth', 10, 3);

function bdk_hardening_users_rest_auth($result, $server, $request)
{
    if (!empty($result)) {
        return $result;
    }

    $route = $request->get_route();
    // Case-insensitive: WP matches REST routes with the `i` modifier.
    if (stripos($route, '/wp/v2/users') !== 0) {
        return $result;
    }

    if (!is_user_logged_in()) {
        return new WP_Error(
            'rest_forbidden',
            'Authentication required.',
            ['status' => 401]
        );
    }

    return $result;
}

add_action('init', 'bdk_hardening_force_blog_public', 0);

function bdk_hardening_force_blog_public()
{
    add_filter('pre_option_blog_public', static function () {
        return '0';
    });
}

add_action('send_headers', 'bdk_hardening_noindex_header');

function bdk_hardening_noindex_header()
{
    if ((string) get_option('blog_public') === '0') {
        header('X-Robots-Tag: noindex, nofollow', true);
    }
}
