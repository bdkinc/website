<?php
if (!defined('ABSPATH')) { exit; }

function bdk_fixed_copy($post) {
    return $post && in_array($post->post_type, ['bdk_page', 'bdk_settings'], true) && bdk_definition($post);
}

add_action('init', function () {
    foreach (['post', 'service', 'location', 'testimonial', 'partner', 'pseo_service', 'pseo_industry', 'bdk_page', 'bdk_settings'] as $type) {
        register_post_meta($type, '_bdk_data', ['type' => 'object', 'single' => true, 'revisions_enabled' => true]);
    }
}, 20);

// Connection-owned database locks serialize publication, cancellation and native meta restore.
// Nested calls in the same request reuse the lock; disconnect/crash releases it in MySQL.
function bdk_lock_copy($id) {
    global $wpdb;
    if (!empty($GLOBALS['bdk_copy_locks'][$id])) { ++$GLOBALS['bdk_copy_locks'][$id]; return true; }
    $name = 'bdk-copy-' . md5(DB_NAME . ':' . $wpdb->prefix . ':' . $id);
    if ((int) $wpdb->get_var($wpdb->prepare('SELECT GET_LOCK(%s, 10)', $name)) !== 1) {
        return new WP_Error('bdk_busy', 'Copy publication is busy; try again.', ['status' => 409]);
    }
    $GLOBALS['bdk_copy_locks'][$id] = 1;
    clean_post_cache($id); // A waiting request must not reuse pre-lock meta or post caches.
    return true;
}
function bdk_unlock_copy($id) {
    global $wpdb;
    if (--$GLOBALS['bdk_copy_locks'][$id] > 0) { return; }
    unset($GLOBALS['bdk_copy_locks'][$id]);
    $name = 'bdk-copy-' . md5(DB_NAME . ':' . $wpdb->prefix . ':' . $id);
    $wpdb->get_var($wpdb->prepare('SELECT RELEASE_LOCK(%s)', $name));
}
function bdk_with_copy_lock($id, $callback) {
    $locked = bdk_lock_copy($id);
    if (is_wp_error($locked)) { return $locked; }
    try { return $callback(); } finally { bdk_unlock_copy($id); }
}

// Core would delete registered revision meta when restoring a pre-integration revision.
add_filter('wp_post_revision_meta_keys', function ($keys, $type) {
    if (doing_action('wp_restore_post_revision')) {
        // The restore action passes its actual revision before core's priority-10 handler.
        $revision = $GLOBALS['bdk_restoring_revision'] ?? null;
        if (!$revision || !metadata_exists('post', $revision->ID, '_bdk_data')) {
            $keys = array_diff($keys, ['_bdk_data']);
        }
    }
    return $keys;
}, 10, 2);
add_action('wp_restore_post_revision', function ($id, $revision_id) {
    $locked = bdk_lock_copy($id);
    // Abort before core's priority-10 meta restore if serialization cannot be obtained.
    if (is_wp_error($locked)) { wp_die($locked); }
    $revision = get_post($revision_id);
    if (metadata_exists('post', $revision_id, '_bdk_data')) {
        $valid = bdk_preflight_site_redirects(get_post($id), get_post_meta($revision_id, '_bdk_data', true));
        if (is_wp_error($valid)) { bdk_unlock_copy($id); wp_die($valid); }
    }
    $GLOBALS['bdk_restoring_revision'] = $revision;
}, 1, 2);
add_action('wp_restore_post_revision', function ($id) {
    try {
        unset($GLOBALS['bdk_restoring_revision']);
        bdk_cancel_copy_schedule($id);
        wp_save_post_revision($id);
    } finally { bdk_unlock_copy($id); }
}, 20);

function bdk_working_copy($post) {
    $working = get_post_meta($post->ID, '_bdk_working_copy', true);
    return is_array($working) ? $working : ['data' => bdk_copy_data($post), 'savedAt' => null, 'savedBy' => null];
}

function bdk_save_working_copy($input, $post) {
    if (!bdk_fixed_copy($post) || !current_user_can('edit_post', $post->ID)) {
        return new WP_Error('bdk_forbidden', 'Cannot stage this record.', ['status' => 403]);
    }
    return bdk_with_copy_lock($post->ID, function () use ($input, $post) {
        $working = bdk_working_copy($post);
        $data = bdk_validate_fields($input, bdk_definition($post)['fields'], $working['data']);
        if (is_wp_error($data)) { return $data; }
        $working = ['data' => $data, 'savedAt' => time(), 'savedBy' => get_current_user_id()];
        update_post_meta($post->ID, '_bdk_working_copy', wp_slash($working));
        return $working;
    });
}

function bdk_cancel_copy_schedule($id) {
    return bdk_with_copy_lock($id, function () use ($id) {
        wp_clear_scheduled_hook('bdk_publish_scheduled_copy', [$id]);
        delete_post_meta($id, '_bdk_scheduled_copy');
        return true;
    });
}

// Recheck site aliases against current published identities before any lifecycle mutation.
function bdk_preflight_site_redirects($post, $data) {
    if ($post && $post->post_type === 'bdk_settings' && $post->post_name === 'site') {
        return bdk_complete_fields($data, bdk_definition($post)['fields']);
    }
    return $data;
}

// Only validated snapshots saved by the capability-checked API enter this internal path.
function bdk_commit_copy($post, $data) {
    $valid = bdk_preflight_site_redirects($post, $data);
    if (is_wp_error($valid)) { return $valid; }
    wp_save_post_revision($post->ID); // Baseline before the first meta-only publication.
    update_post_meta($post->ID, '_bdk_data', wp_slash($data));
    wp_save_post_revision($post->ID);
}

function bdk_publish_working_copy($post) {
    if (!bdk_fixed_copy($post) || $post->post_status !== 'publish' || !current_user_can('edit_post', $post->ID) || !current_user_can(get_post_type_object($post->post_type)->cap->publish_posts)) {
        return new WP_Error('bdk_forbidden', 'Cannot publish copy for this record.', ['status' => 403]);
    }
    return bdk_with_copy_lock($post->ID, function () use ($post) {
        $working = bdk_working_copy($post);
        $data = $working['data']; // Preserve untouched live values verbatim.
        $valid = bdk_preflight_site_redirects($post, $data);
        if (is_wp_error($valid)) { return $valid; }
        bdk_cancel_copy_schedule($post->ID);
        bdk_commit_copy($post, $data);
        delete_post_meta($post->ID, '_bdk_working_copy');
        return bdk_working_copy($post);
    });
}

function bdk_schedule_working_copy($post, $timestamp) {
    if (!bdk_fixed_copy($post) || $post->post_status !== 'publish' || !current_user_can('edit_post', $post->ID) || !current_user_can(get_post_type_object($post->post_type)->cap->publish_posts)) {
        return new WP_Error('bdk_forbidden', 'Cannot schedule copy for this record.', ['status' => 403]);
    }
    if (!is_int($timestamp) || $timestamp <= time()) { return new WP_Error('bdk_time', 'Use a future Unix timestamp.', ['status' => 400]); }
    return bdk_with_copy_lock($post->ID, function () use ($post, $timestamp) {
        $data = bdk_working_copy($post)['data']; // Snapshot the trusted, validated working slot.
        $valid = bdk_preflight_site_redirects($post, $data);
        if (is_wp_error($valid)) { return $valid; }
        bdk_cancel_copy_schedule($post->ID);
        $scheduled = ['data' => $data, 'publishAt' => $timestamp, 'scheduledBy' => get_current_user_id()];
        update_post_meta($post->ID, '_bdk_scheduled_copy', wp_slash($scheduled));
        $result = wp_schedule_single_event($timestamp, 'bdk_publish_scheduled_copy', [$post->ID], true);
        if (is_wp_error($result) || !$result) {
            delete_post_meta($post->ID, '_bdk_scheduled_copy', wp_slash($scheduled));
            return is_wp_error($result) ? $result : new WP_Error('bdk_schedule', 'Could not schedule publication.', ['status' => 500]);
        }
        return $scheduled;
    });
}
add_action('bdk_publish_scheduled_copy', function ($id) {
    $result = bdk_with_copy_lock($id, function () use ($id) {
        $post = get_post($id);
        $scheduled = get_post_meta($id, '_bdk_scheduled_copy', true);
        if (!bdk_fixed_copy($post) || $post->post_status !== 'publish' || !is_array($scheduled) || $scheduled['publishAt'] > time()) { return; }
        $result = bdk_commit_copy($post, $scheduled['data']);
        if (is_wp_error($result)) { return $result; }
        // Consume only the exact snapshot read under the lock, never a replacement.
        delete_post_meta($id, '_bdk_scheduled_copy', wp_slash($scheduled));
        // Later edits remain durable; the immutable scheduled snapshot never consumes them.
    });
    if (is_wp_error($result) && $result->get_error_code() === 'bdk_busy') { wp_schedule_single_event(time() + 30, 'bdk_publish_scheduled_copy', [$id]); }
});

add_action('rest_api_init', function () {
    register_rest_route('bdk/v1', '/working-copy/(?P<id>\d+)', [
        'methods' => 'GET,POST',
        'permission_callback' => function ($request) {
            return wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest') && current_user_can('edit_post', (int) $request['id']);
        },
        'callback' => function ($request) {
            $post = get_post((int) $request['id']);
            if (!bdk_fixed_copy($post)) { return new WP_Error('bdk_target', 'Only fixed pages and settings support working copies.', ['status' => 400]); }
            $action = $request->get_method() === 'GET' ? 'read' : $request->get_param('action');
            switch ($action) {
                case 'read': $result = bdk_working_copy($post); break;
                case 'save': $result = bdk_save_working_copy($request['data'], $post); break;
                case 'publish': $result = bdk_publish_working_copy($post); break;
                case 'schedule': $result = bdk_schedule_working_copy($post, $request['publishAt']); break;
                case 'cancel': $result = bdk_cancel_copy_schedule($post->ID); break;
                case 'discard':
                    $result = bdk_with_copy_lock($post->ID, function () use ($post) {
                        delete_post_meta($post->ID, '_bdk_working_copy');
                        return bdk_working_copy($post);
                    });
                    break;
                default: return new WP_Error('bdk_action', 'Unknown working-copy action.', ['status' => 400]);
            }
            if (is_wp_error($result)) { return $result; }
            $response = new WP_REST_Response(['working' => bdk_working_copy($post), 'scheduled' => get_post_meta($post->ID, '_bdk_scheduled_copy', true) ?: null]);
            $response->header('Cache-Control', 'private, no-store');
            return $response;
        },
    ]);
});
