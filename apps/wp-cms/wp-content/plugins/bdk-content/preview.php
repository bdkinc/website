<?php
if (!defined('ABSPATH')) { exit; }

// Snapshots are immutable, short-lived copies, never revisions written onto a published parent.
function bdk_preview_target($post) {
    $fixed = json_decode(file_get_contents('/var/www/bdk-editorial/routes.json'), true);
    if ($post->post_type === 'bdk_page') {
        $path = $fixed[$post->post_name] ?? null;
        if ($post->post_name === 'service-location') { $path = bdk_preview_generated_path('service'); }
        if ($post->post_name === 'industry-location') { $path = bdk_preview_generated_path('pseo_industry'); }
        return $path ? ['kind' => 'page', 'key' => $post->post_name, 'path' => $path] : null;
    }
    $collections = ['post' => 'blog', 'service' => 'services', 'location' => 'locations', 'testimonial' => 'testimonials', 'partner' => 'partners', 'pseo_service' => 'pseoServices', 'pseo_industry' => 'pseoIndustries'];
    if (isset($collections[$post->post_type])) {
        $name = $collections[$post->post_type];
        $path = '/';
        if ($name === 'blog') { $path = '/blog/' . $post->post_name; }
        if ($name === 'services') { $path = $fixed['service-' . $post->post_name] ?? null; }
        if ($name === 'locations') { $path = bdk_preview_generated_path('service', null, $post); }
        if ($name === 'pseoServices' || $name === 'pseoIndustries') { $path = bdk_preview_generated_path($post->post_type, $post); }
        return $path ? ['kind' => 'collection', 'key' => $name, 'path' => $path] : null;
    }
    if ($post->post_type === 'bdk_settings') { return ['kind' => 'settings', 'key' => 'site', 'path' => '/']; }
    return null;
}
function bdk_preview_first($type) {
    $posts = get_posts(['post_type' => $type, 'post_status' => 'publish', 'numberposts' => 1, 'orderby' => 'ID', 'order' => 'ASC']);
    return $posts[0] ?? null;
}
function bdk_preview_generated_path($type, $entry = null, $location = null) {
    $entry = $entry ?: bdk_preview_first($type);
    $location = $location ?: bdk_preview_first('location');
    if (!$entry || !$location || $entry->post_status !== 'publish' || $location->post_status !== 'publish') { return null; }
    $slug = $location->post_name;
    if (!$slug) { return null; }
    return ($type === 'pseo_industry' ? '/industries/' : '/services/') . $entry->post_name . '/' . $slug;
}
// Public identities reuse the same fixed/generated routing as snapshots, not WP theme routes.
function bdk_public_path($post) {
    if (!$post || $post->post_status !== 'publish' || !$post->post_name || !bdk_definition($post)) { return null; }
    if (!in_array($post->post_type, ['post', 'service', 'location', 'pseo_service', 'pseo_industry', 'bdk_page'], true)) { return null; }
    if ($post->post_type === 'post' && !is_array(get_post_meta($post->ID, '_bdk_data', true))) { return null; }
    $target = bdk_preview_target($post);
    return $target['path'] ?? null;
}
function bdk_public_permalink($link, $post) {
    $post = get_post($post);
    $path = bdk_public_path($post);
    $targets = bdk_preview_targets();
    return $path && isset($targets['current']) ? $targets['current']['origin'] . $path : $link;
}
add_filter('post_link', 'bdk_public_permalink', 10, 2);
add_filter('post_type_link', 'bdk_public_permalink', 10, 2);
add_filter('page_link', 'bdk_public_permalink', 10, 2);

// Normalize only known public content links. Admin, REST, uploads and external URLs stay intact.
function bdk_public_body_link($href) {
    if (!$href || $href[0] === '#' || preg_match('~^(mailto:|tel:)~i', $href)) { return $href; }
    $parts = wp_parse_url($href);
    if (!$parts) { return $href; }
    $home = wp_parse_url(home_url('/'));
    $origins = [$home];
    foreach (bdk_preview_targets() as $target) { $origins[] = wp_parse_url($target['origin']); }
    if (isset($parts['host'])) {
        $internal = false;
        foreach ($origins as $origin) {
            if (strtolower($parts['host']) === strtolower($origin['host']) && ($parts['port'] ?? null) === ($origin['port'] ?? null) && (!isset($parts['scheme']) || $parts['scheme'] === $origin['scheme'])) { $internal = true; break; }
        }
        if (!$internal || isset($parts['user']) || isset($parts['pass'])) { return $href; }
    } elseif (isset($parts['scheme'])) { return $href; }
    $path = '/' . ltrim($parts['path'] ?? '', '/');
    if (preg_match('~/(wp-admin|wp-json|wp-content|wp-includes)(/|$)|/wp-[^/]+\\.php$~', $path)) { return $href; }
    $query = [];
    if (isset($parts['query'])) { wp_parse_str($parts['query'], $query); }
    if (array_intersect(['rest_route', 'attachment_id', 'preview', 'preview_id', 'preview_nonce'], array_keys($query))) { return $href; }
    $suffix = isset($parts['query']) ? '?' . $parts['query'] : '';
    $suffix .= isset($parts['fragment']) ? '#' . $parts['fragment'] : '';
    // WordPress resolves historical pretty links and native ?p= links even after permalink filters.
    $id = url_to_postid(home_url($path) . (isset($parts['query']) ? '?' . $parts['query'] : ''));
    $canonical = $id ? bdk_public_path(get_post($id)) : null;
    if ($canonical) {
        unset($query['p'], $query['page_id'], $query['post_type'], $query['name']);
        return $canonical . ($query ? '?' . http_build_query($query) : '') . (isset($parts['fragment']) ? '#' . $parts['fragment'] : '');
    }
    if ($id) { return $href; }
    // Already-canonical links (including native link-picker output) stay on the rendering frontend.
    $fixed = json_decode(file_get_contents('/var/www/bdk-editorial/routes.json'), true);
    if (in_array(untrailingslashit($path) ?: '/', $fixed, true)) { return $path . $suffix; }
    if (preg_match('~^/blog/([^/]+)/?$~', $path, $match)) {
        $post = get_page_by_path($match[1], OBJECT, 'post');
        if (bdk_public_path($post)) { return $path . $suffix; }
    }
    if (preg_match('~^/(services|industries)/([^/]+)/([^/]+)/?$~', $path, $match)) {
        $location = get_page_by_path($match[3], OBJECT, 'location');
        $types = $match[1] === 'industries' ? ['pseo_industry'] : ['service', 'pseo_service'];
        foreach ($types as $type) {
            $entry = get_page_by_path($match[2], OBJECT, $type);
            if ($entry && $location && bdk_preview_generated_path($type, $entry, $location) === untrailingslashit($path)) { return $path . $suffix; }
        }
    }
    return $href;
}

// Only developer-configured origins can receive grants. Request origins are never trusted.
function bdk_preview_targets() {
    $targets = [];
    foreach (['current' => ['Current site', 'FRONTEND_URL'], 'editorial' => ['Editorial concept', 'BDK_PREVIEW_EDITORIAL_URL'], 'systems' => ['Systems concept', 'BDK_PREVIEW_SYSTEMS_URL']] as $key => $config) {
        $origin = rtrim((string) getenv($config[1]), '/');
        $parts = wp_parse_url($origin);
        if (!$origin || !$parts || !in_array($parts['scheme'] ?? '', ['http', 'https'], true) || empty($parts['host']) || isset($parts['user']) || isset($parts['pass']) || isset($parts['query']) || isset($parts['fragment']) || !empty($parts['path'])) { continue; }
        $targets[$key] = ['label' => $config[0], 'origin' => $origin];
    }
    return $targets;
}
function bdk_base64url($value) { return rtrim(strtr(base64_encode($value), '+/', '-_'), '='); }
function bdk_verify_preview($token) {
    $secret = getenv('BDK_PREVIEW_SECRET');
    $parts = explode('.', (string) $token);
    if (!$secret || count($parts) !== 2 || !hash_equals(bdk_base64url(hash_hmac('sha256', $parts[0], $secret, true)), $parts[1])) { return false; }
    $grant = json_decode(base64_decode(strtr($parts[0], '-_', '+/')), true);
    $targets = bdk_preview_targets();
    $selected = $grant['previewTarget'] ?? 'current';
    if (!is_array($grant) || !isset($targets[$selected]) || ($grant['v'] ?? 0) !== 1 || ($grant['exp'] ?? 0) <= time() || ($grant['exp'] ?? 0) > time() + 960 || ($grant['aud'] ?? '') !== $targets[$selected]['origin']) { return false; }
    return $grant;
}
add_action('rest_api_init', function () {
    register_rest_route('bdk/v1', '/preview', [
        'methods' => 'POST',
        'permission_callback' => function ($request) {
            // Explicit nonce even when an application password is used by automation.
            return wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest') && current_user_can('edit_post', (int) $request['postId']);
        },
        'callback' => function ($request) {
            $post = get_post((int) $request['postId']);
            $definition = $post ? bdk_definition($post) : null;
            // Core legitimately leaves a new draft slug empty until first publication.
            // A snapshot needs an identity, not a prematurely reserved public permalink.
            if ($post && $post->post_type === 'post' && $post->post_status === 'draft' && !$post->post_name) {
                $post = clone $post;
                $post->post_name = sanitize_title($post->post_title) ?: 'draft-' . $post->ID;
            }
            $target = $post ? bdk_preview_target($post) : null;
            $secret = getenv('BDK_PREVIEW_SECRET');
            $targets = bdk_preview_targets();
            $selected = $request->has_param('target') ? (string) $request['target'] : 'current';
            if (!isset($targets[$selected])) { return new WP_Error('bdk_audience', 'Unknown preview target.', ['status' => 400]); }
            $audience = $targets[$selected]['origin'];
            if (!$definition || !$target || !$post->post_name) { return new WP_Error('bdk_target', 'Save this record as a draft before previewing.', ['status' => 400]); }
            if (!$secret || !$audience) { return new WP_Error('bdk_config', 'Preview is not configured.', ['status' => 503]); }
            parse_str((string) $request['form'], $form);
            $previous = bdk_fixed_copy($post) ? bdk_working_copy($post)['data'] : (array) bdk_copy_data($post);
            $input = $request->has_param('form') ? bdk_form_values($form['bdk_copy'] ?? [], $definition['fields']) : [];
            $data = bdk_validate_fields($input, $definition['fields'], $previous);
            if (is_wp_error($data)) { return $data; }
            $body = $post->post_content;
            if ($post->post_type === 'post') {
                $data['title'] = sanitize_text_field($request->has_param('title') ? $request['title'] : $post->post_title);
                $body = $request->has_param('content') ? (string) $request['content'] : $body;
            }
            $snapshot = wp_generate_uuid4();
            $grant = array_merge($target, ['v' => 1, 'postId' => $post->ID, 'editor' => get_current_user_id(), 'snapshot' => $snapshot, 'previewTarget' => $selected, 'aud' => $audience, 'exp' => time() + 900]);
            $record = ['id' => $post->ID, 'slug' => $post->post_name, 'status' => $post->post_status, 'bdk_data' => $data, 'content' => ['rendered' => bdk_prose_html(apply_filters('the_content', $body))], 'bdk_admin' => admin_url()];
            set_transient('bdk_preview_' . $snapshot, ['grant' => $grant, 'record' => $record], 900);
            $payload = bdk_base64url(wp_json_encode($grant));
            $token = $payload . '.' . bdk_base64url(hash_hmac('sha256', $payload, $secret, true));
            $response = new WP_REST_Response(['url' => $audience . '/api/preview?token=' . rawurlencode($token)]);
            $response->header('Cache-Control', 'private, no-store');
            return $response;
        },
    ]);
    register_rest_route('bdk/v1', '/preview-snapshot', [
        'methods' => 'GET',
        'permission_callback' => function ($request) {
            $grant = bdk_verify_preview($request->get_header('X-BDK-Preview'));
            return $grant && current_user_can('edit_post', $grant['postId']) && user_can($grant['editor'], 'edit_post', $grant['postId']);
        },
        'callback' => function ($request) {
            $grant = bdk_verify_preview($request->get_header('X-BDK-Preview'));
            $snapshot = get_transient('bdk_preview_' . $grant['snapshot']);
            if (!$snapshot || $snapshot['grant'] !== $grant) { return new WP_Error('bdk_expired', 'Preview expired; create another preview.', ['status' => 401]); }
            $response = new WP_REST_Response($snapshot['record']);
            $response->header('Cache-Control', 'private, no-store');
            return $response;
        },
    ]);
});
add_action('add_meta_boxes', function ($type, $post) {
    if (!bdk_definition($post)) { return; }
    add_meta_box('bdk-preview', 'Astro website preview', function ($post) {
        echo '<p><label for="bdk-preview-target">Preview target</label><select id="bdk-preview-target">';
        foreach (bdk_preview_targets() as $key => $target) { echo '<option value="' . esc_attr($key) . '">' . esc_html($target['label']) . '</option>'; }
        echo '</select></p>';
        echo '<p>Preview current fields without updating the published website. For a new blog post, save a draft first. Each preview expires after 15 minutes.</p>';
        // The docked preview relies on the classic form's field events; blog posts use the block editor.
        $live = !use_block_editor_for_post($post);
        if ($live) { echo '<p><button type="button" class="button button-primary" id="bdk-live-button" aria-expanded="false">Show live preview beside the form</button></p>'; }
        echo '<button type="button" class="button' . ($live ? '' : ' button-primary') . '" id="bdk-preview-button">Preview current copy in a new tab</button><p id="bdk-preview-status" role="status"></p>';
    }, $type, 'side', 'high');
}, 10, 2);
add_action('admin_enqueue_scripts', function ($hook) {
    if (!in_array($hook, ['post.php', 'post-new.php'], true)) { return; }
    global $post;
    if (!$post || !bdk_definition($post)) { return; }
    // Record identity matches the website preview's section markers: a page key or "settings".
    $record = ['bdk_page' => $post->post_name, 'bdk_settings' => 'settings'][$post->post_type] ?? null;
    wp_localize_script('bdk-editor', 'bdkPreview', ['endpoint' => rest_url('bdk/v1/preview'), 'nonce' => wp_create_nonce('wp_rest'), 'postId' => $post->ID, 'targets' => bdk_preview_targets(), 'record' => $record, 'editSection' => admin_url('admin.php?page=bdk-edit')]);
}, 20);
// Never send editors to the headless WordPress theme using the core Preview control.
add_filter('preview_post_link', function ($link, $post) {
    return bdk_definition($post) ? admin_url('post.php?post=' . $post->ID . '&action=edit#bdk-preview') : $link;
}, 10, 2);
