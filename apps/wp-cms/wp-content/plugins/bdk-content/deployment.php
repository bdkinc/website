<?php
if (!defined('ABSPATH')) { exit; }

function bdk_queue_deployment() {
    $url = getenv('BDK_DEPLOY_HOOK_URL') ?: get_option('bdk_deploy_hook_url', '');
    if (!$url) { update_option('bdk_deploy_status', ['state' => 'not configured', 'at' => gmdate('c')], false); return; }
    if (!wp_next_scheduled('bdk_dispatch_deployment')) { wp_schedule_single_event(time() + 30, 'bdk_dispatch_deployment'); }
    update_option('bdk_deploy_status', ['state' => 'queued', 'at' => gmdate('c')], false);
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
add_action('bdk_dispatch_deployment', function () {
    $url = getenv('BDK_DEPLOY_HOOK_URL') ?: get_option('bdk_deploy_hook_url', '');
    if (!$url) { update_option('bdk_deploy_status', ['state' => 'not configured', 'at' => gmdate('c')], false); return; }
    if (!wp_http_validate_url($url) && !in_array(wp_parse_url($url, PHP_URL_HOST), ['localhost', '127.0.0.1', 'host.docker.internal'], true)) {
        update_option('bdk_deploy_status', ['state' => 'failed', 'error' => 'Invalid configured deployment URL', 'at' => gmdate('c')], false); return;
    }
    $headers = ['Content-Type' => 'application/json'];
    if (getenv('BDK_DEPLOY_HOOK_TOKEN')) { $headers['Authorization'] = 'Bearer ' . getenv('BDK_DEPLOY_HOOK_TOKEN'); }
    $result = wp_remote_post($url, ['timeout' => 15, 'redirection' => 0, 'headers' => $headers, 'body' => wp_json_encode(['event' => 'content.changed', 'site' => home_url(), 'at' => gmdate('c')])]);
    $code = is_wp_error($result) ? 0 : wp_remote_retrieve_response_code($result);
    $success = $code >= 200 && $code < 300;
    $old = get_option('bdk_deploy_status', []);
    $attempt = ($old['attempt'] ?? 0) + 1;
    update_option('bdk_deploy_status', ['state' => $success ? 'dispatch accepted (deployment pending)' : 'failed', 'httpStatus' => $code, 'attempt' => $attempt, 'at' => gmdate('c')], false);
    if (!$success && $attempt < 3 && !wp_next_scheduled('bdk_dispatch_deployment')) { wp_schedule_single_event(time() + 60 * $attempt, 'bdk_dispatch_deployment'); }
});
add_action('admin_notices', function () {
    if (!current_user_can('edit_posts')) { return; }
    $status = get_option('bdk_deploy_status', ['state' => 'not configured']);
    echo '<div class="notice notice-info"><p>Static website deployment: ' . esc_html($status['state']) . '. Publishing requests a rebuild; preview changes are immediate.</p></div>';
});
