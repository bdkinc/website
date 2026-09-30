<?php
if (!defined('ABSPATH')) { exit; }

function bdk_deployment_status() {
    global $wpdb;
    // Request-local and persistent option caches can outlive a released deployment lock.
    $value = $wpdb->get_var($wpdb->prepare("SELECT option_value FROM $wpdb->options WHERE option_name = %s", 'bdk_deploy_status'));
    return $value === null ? ['state' => 'not configured', 'at' => gmdate('c')] : maybe_unserialize($value);
}

// Serialize queue, dispatch and completion so an older request cannot overwrite new content.
function bdk_deployment_locked($callback) {
    global $wpdb;
    $lock = 'bdk_deploy_' . md5($wpdb->prefix . DB_NAME);
    if ((string) $wpdb->get_var($wpdb->prepare('SELECT GET_LOCK(%s, 5)', $lock)) !== '1') {
        return new WP_Error('deployment_busy', 'Deployment status is busy; try again.', ['status' => 503]);
    }
    try {
        // update_option() also reads its old value through these caches, including
        // legacy autoloaded status and cached absence. Refresh them under the lock.
        wp_cache_delete('bdk_deploy_status', 'options');
        wp_cache_delete('alloptions', 'options');
        wp_cache_delete('notoptions', 'options');
        return $callback();
    }
    finally { $wpdb->get_var($wpdb->prepare('SELECT RELEASE_LOCK(%s)', $lock)); }
}

function bdk_deployment_url() {
    return getenv('BDK_DEPLOY_HOOK_URL') ?: get_option('bdk_deploy_hook_url', '');
}

function bdk_queue_deployment() {
    return bdk_deployment_locked('bdk_deployment_enqueue');
}

function bdk_deployment_enqueue() {
        $old = bdk_deployment_status();
        $status = ['state' => bdk_deployment_url() ? 'queued' : 'not configured', 'deploymentId' => wp_generate_uuid4(), 'attempt' => 0, 'at' => gmdate('c')];
        if (isset($old['liveDeploymentId'])) { $status['liveDeploymentId'] = $old['liveDeploymentId']; }
        update_option('bdk_deploy_status', $status, false);
        if ($status['state'] === 'queued' && !wp_next_scheduled('bdk_dispatch_deployment')) { wp_schedule_single_event(time() + 30, 'bdk_dispatch_deployment'); }
        return $status;
}
add_action('transition_post_status', function ($new, $old, $post) {
    if (bdk_definition($post) && ($new === 'publish' || $old === 'publish')) { bdk_queue_deployment(); }
}, 10, 3);
foreach (['added_post_meta', 'updated_post_meta', 'deleted_post_meta'] as $hook) {
    add_action($hook, function ($meta_id, $id, $key) {
        $post = get_post($id);
        if ($post && $post->post_status === 'publish' && $key === '_bdk_data' && bdk_definition($post)) { bdk_queue_deployment(); }
    }, 10, 3);
}
add_action('before_delete_post', function ($id, $post) {
    if (($post->post_status === 'publish' && bdk_definition($post)) || $post->post_type === 'attachment') { bdk_queue_deployment(); }
}, 10, 2);
foreach (['add_attachment', 'edit_attachment', 'delete_attachment'] as $hook) { add_action($hook, 'bdk_queue_deployment'); }

function bdk_dispatch_deployment() {
    $prepared = bdk_deployment_locked(function () {
        $status = bdk_deployment_status();
        if ($status['state'] !== 'queued') { return null; }
        $url = bdk_deployment_url();
        if (!$url || (!wp_http_validate_url($url) && !in_array(wp_parse_url($url, PHP_URL_HOST), ['localhost', '127.0.0.1', 'host.docker.internal'], true))) {
            $status['state'] = 'failed';
            $status['message'] = 'Invalid or missing configured deployment URL';
            update_option('bdk_deploy_status', $status, false);
            return null;
        }
        $status['state'] = 'dispatched';
        $status['attempt']++;
        $status['at'] = gmdate('c');
        update_option('bdk_deploy_status', $status, false);
        return ['url' => $url, 'status' => $status];
    });
    if (!$prepared || is_wp_error($prepared)) { return; }
    $status = $prepared['status'];
    $headers = ['Content-Type' => 'application/json', 'X-BDK-Deployment-ID' => $status['deploymentId']];
    if (getenv('BDK_DEPLOY_HOOK_TOKEN')) { $headers['Authorization'] = 'Bearer ' . getenv('BDK_DEPLOY_HOOK_TOKEN'); }
    // Keep the existing webhook body compatible; CI must preserve the correlation header.
    $result = wp_remote_post($prepared['url'], ['timeout' => 15, 'redirection' => 0, 'headers' => $headers, 'body' => wp_json_encode(['event' => 'content.changed', 'site' => home_url(), 'at' => gmdate('c')])]);
    $code = is_wp_error($result) ? 0 : wp_remote_retrieve_response_code($result);
    bdk_deployment_locked(function () use ($status, $code) {
        $current = bdk_deployment_status();
        if (($current['deploymentId'] ?? '') !== $status['deploymentId'] || $current['state'] !== 'dispatched') { return; }
        $current['httpStatus'] = $code;
        $current['at'] = gmdate('c');
        if ($code < 200 || $code >= 300) {
            $current['state'] = $current['attempt'] < 3 ? 'queued' : 'failed';
            $current['message'] = 'Deployment dispatch was not accepted';
            if ($current['state'] === 'queued' && !wp_next_scheduled('bdk_dispatch_deployment')) { wp_schedule_single_event(time() + 60 * $current['attempt'], 'bdk_dispatch_deployment'); }
        }
        update_option('bdk_deploy_status', $current, false);
    });
}
add_action('bdk_dispatch_deployment', 'bdk_dispatch_deployment');

function bdk_deployment_callback_permission($request) {
    $secret = getenv('BDK_DEPLOY_CALLBACK_SECRET');
    if (!$secret || !hash_equals('Bearer ' . $secret, (string) $request->get_header('authorization'))) {
        return new WP_Error('deployment_unauthorized', 'Unauthorized deployment callback.', ['status' => 401]);
    }
    return true;
}

function bdk_deployment_callback($request) {
    $data = $request->get_json_params();
    if (!is_array($data) || array_diff(array_keys($data), ['deploymentId', 'state', 'message']) || !isset($data['deploymentId'], $data['state']) || !is_string($data['deploymentId']) || !preg_match('/^[a-f0-9-]{36}$/D', $data['deploymentId']) || !in_array($data['state'], ['building', 'live', 'failed'], true) || (isset($data['message']) && (!is_string($data['message']) || strlen($data['message']) > 500))) {
        return new WP_Error('deployment_invalid', 'Invalid deployment status payload.', ['status' => 400]);
    }
    return bdk_deployment_locked(function () use ($data) {
        $status = bdk_deployment_status();
        if (($status['deploymentId'] ?? '') !== $data['deploymentId'] || !in_array($status['state'], ['dispatched', 'building', $data['state']], true)) {
            return new WP_Error('deployment_stale', 'Deployment is stale or not awaiting completion.', ['status' => 409]);
        }
        if (in_array($status['state'], ['live', 'failed'], true)) { return $status; }
        $status['state'] = $data['state'];
        $status['at'] = gmdate('c');
        unset($status['message']);
        if (isset($data['message'])) { $status['message'] = sanitize_text_field($data['message']); }
        if ($data['state'] === 'live') { $status['liveDeploymentId'] = $data['deploymentId']; }
        update_option('bdk_deploy_status', $status, false);
        return $status;
    });
}

function bdk_deployment_editor_permission($request) {
    return current_user_can('edit_posts') && wp_verify_nonce($request->get_header('x_wp_nonce'), 'wp_rest');
}

function bdk_retry_deployment() {
    return bdk_deployment_locked(function () {
        $status = bdk_deployment_status();
        if (!in_array($status['state'], ['failed', 'dispatched', 'building', 'not configured'], true)) {
            return new WP_Error('deployment_retry_unavailable', 'Deployment does not require retry.', ['status' => 409]);
        }
        // A fresh identifier also invalidates any late completion from the previous attempt.
        return bdk_deployment_enqueue();
    });
}
add_action('rest_api_init', function () {
    register_rest_route('bdk/v1', '/deployment-status', [
        ['methods' => 'GET', 'permission_callback' => 'bdk_deployment_editor_permission', 'callback' => 'bdk_deployment_status'],
        ['methods' => 'POST', 'permission_callback' => 'bdk_deployment_callback_permission', 'callback' => 'bdk_deployment_callback'],
    ]);
    register_rest_route('bdk/v1', '/deployment-retry', ['methods' => 'POST', 'permission_callback' => 'bdk_deployment_editor_permission', 'callback' => 'bdk_retry_deployment']);
});
add_action('admin_notices', function () {
    if (!current_user_can('edit_posts')) { return; }
    $status = bdk_deployment_status();
    echo '<div class="notice notice-info"><p>Static website deployment: ' . esc_html($status['state']) . '. Publishing requests a rebuild; preview changes are immediate.</p></div>';
});
