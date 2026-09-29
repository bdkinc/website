<?php
if (!defined('ABSPATH')) { exit; }

function bdk_definitions() {
    static $definitions;
    if ($definitions !== null) { return $definitions; }
    $root = '/var/www/bdk-editorial';
    $definitions = json_decode(file_get_contents($root . '/collections.json'), true, 512, JSON_THROW_ON_ERROR);
    foreach (glob($root . '/data/*.json') as $file) {
        $definition = json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
        $definitions[$definition['kind'] . ':' . $definition['key']] = $definition;
    }
    return $definitions;
}

function bdk_definition($post) {
    foreach (bdk_definitions() as $definition) {
        if (isset($definition['postType']) && $definition['postType'] === $post->post_type) { return $definition; }
        if (($definition['kind'] ?? '') === 'page' && $post->post_type === 'bdk_page' && $definition['key'] === $post->post_name) { return $definition; }
        if (($definition['kind'] ?? '') === 'settings' && $post->post_type === 'bdk_settings' && $definition['key'] === $post->post_name) { return $definition; }
    }
    return null;
}

function bdk_copy_data($post) {
    $data = get_post_meta($post->ID, '_bdk_data', true);
    if (!is_array($data)) { $data = []; }
    if ($post->post_type === 'post') {
        $data['title'] = $post->post_title;
        // New drafts may have no GMT publication date yet; preview still needs a valid date.
        $data['pubDate'] = get_post_time('c', true, $post) ?: get_post_time('c', false, $post);
        $data['draft'] = $post->post_status !== 'publish';
    }
    return $data;
}

function bdk_validate_fields($input, $fields, $previous = []) {
    if (!is_array($input)) { return new WP_Error('bdk_shape', 'Copy must be an object.', ['status' => 400]); }
    foreach ($input as $key => $value) {
        if (!isset($fields[$key])) { return new WP_Error('bdk_field', 'Unknown copy field: ' . $key, ['status' => 400]); }
        $field = $fields[$key];
        if (!empty($field['locked']) && !current_user_can('manage_options') && (!array_key_exists($key, $previous) || $value !== $previous[$key])) {
            return new WP_Error('bdk_locked', 'This field is developer-owned: ' . $key, ['status' => 403]);
        }
        $type = $field['type'];
        if ($type === 'group') {
            $value = bdk_validate_fields($value, $field['fields'], $previous[$key] ?? []);
            if (is_wp_error($value)) { return $value; }
        } elseif ($type === 'number') {
            if (!is_int($value) && !is_float($value)) { return new WP_Error('bdk_number', 'Expected a number: ' . $key, ['status' => 400]); }
        } elseif ($type === 'boolean') {
            if (!is_bool($value)) { return new WP_Error('bdk_boolean', 'Expected a boolean: ' . $key, ['status' => 400]); }
        } elseif ($type === 'strings') {
            if (!is_array($value) || array_values($value) !== $value || count(array_filter($value, 'is_string')) !== count($value)) { return new WP_Error('bdk_strings', 'Expected a list of strings: ' . $key, ['status' => 400]); }
            $value = array_map('sanitize_text_field', $value);
        } else {
            if (!is_string($value)) { return new WP_Error('bdk_string', 'Expected text: ' . $key, ['status' => 400]); }
            if ($type === 'select' && !in_array($value, $field['choices'], true)) { return new WP_Error('bdk_choice', 'Invalid choice: ' . $key, ['status' => 400]); }
            if (in_array($type, ['url', 'media'], true) && $value !== '' && !preg_match('~^(https?://|/(?!/)|mailto:|tel:|#)~i', $value)) { return new WP_Error('bdk_url', 'Use an HTTP(S) URL or a site-relative path: ' . $key, ['status' => 400]); }
            if ($type === 'date' && strtotime($value) === false) { return new WP_Error('bdk_date', 'Invalid date: ' . $key, ['status' => 400]); }
            $value = $type === 'textarea' ? sanitize_textarea_field($value) : sanitize_text_field($value);
        }
        $previous[$key] = $value;
    }
    return $previous;
}

function bdk_update_copy($input, $post) {
    if (!current_user_can('edit_post', $post->ID)) { return new WP_Error('bdk_forbidden', 'Cannot edit this record.', ['status' => 403]); }
    $definition = bdk_definition($post);
    if (!$definition) { return new WP_Error('bdk_definition', 'No fixed definition for this record.', ['status' => 400]); }
    $previous = get_post_meta($post->ID, '_bdk_data', true);
    $data = bdk_validate_fields($input, $definition['fields'], is_array($previous) ? $previous : []);
    if (is_wp_error($data)) { return $data; }
    if ($post->post_type === 'post') {
        foreach (['category' => 'category', 'tags' => 'post_tag'] as $key => $taxonomy) {
            if (array_key_exists($key, $input)) {
                $terms = wp_set_object_terms($post->ID, (array) $data[$key], $taxonomy);
                if (is_wp_error($terms)) { return $terms; }
            }
        }
    }
    update_post_meta($post->ID, '_bdk_data', wp_slash($data));
    return true;
}

add_action('rest_api_init', function () {
    $types = ['post', 'service', 'location', 'testimonial', 'partner', 'pseo_service', 'pseo_industry', 'bdk_page', 'bdk_settings'];
    register_rest_field($types, 'bdk_data', [
        'get_callback' => function ($object) { return bdk_copy_data(get_post($object['id'])); },
        'update_callback' => 'bdk_update_copy',
        'schema' => ['description' => 'Fixed, labeled editorial fields. Partial updates preserve other fields.', 'type' => 'object', 'context' => ['view', 'edit']],
    ]);
    register_rest_field($types, 'bdk_original_markdown', [
        'get_callback' => function ($object) { return get_post_meta($object['id'], '_bdk_original_markdown', true); },
        'update_callback' => function ($value, $post) {
            if (!current_user_can('manage_options') || !is_string($value)) { return new WP_Error('bdk_forbidden', 'Migration-only source archive.', ['status' => 403]); }
            update_post_meta($post->ID, '_bdk_original_markdown', wp_slash($value));
            return true;
        },
        'schema' => ['type' => 'string', 'context' => ['view', 'edit']],
    ]);
    register_rest_route('bdk/v1', '/editorial', [
        'methods' => 'GET', 'permission_callback' => function () { return current_user_can('edit_posts'); },
        'callback' => function () { return bdk_definitions(); },
    ]);
});

// Avoid two competing category/tag/summary editors; labeled fields are canonical.
add_filter('register_taxonomy_args', function ($args, $taxonomy) {
    if (in_array($taxonomy, ['category', 'post_tag'], true)) { $args['show_ui'] = false; }
    return $args;
}, 10, 2);
add_action('init', function () { remove_post_type_support('post', 'excerpt'); }, 20);

// Remember publication across unpublishing, without reserving a new draft's slug.
add_action('transition_post_status', function ($new_status, $old_status, $post) {
    if ($post->post_type === 'post' && (in_array($old_status, ['publish', 'future', 'private'], true) || in_array($new_status, ['publish', 'future', 'private'], true))) {
        update_post_meta($post->ID, '_bdk_published_identity', 1);
    }
}, 10, 3);

// Marketers edit fixed records, not route/layout identities.
add_filter('wp_insert_post_data', function ($data, $postarr) {
    if (!current_user_can('manage_options') && !empty($postarr['ID'])) {
        $old = get_post($postarr['ID']);
        if ($old && bdk_definition($old)) {
            if ($old->post_type !== 'post') { $data['post_name'] = $old->post_name; }
            elseif ($old->post_name && $old->post_status !== 'trash' && $data['post_status'] !== 'trash' && (in_array($old->post_status, ['publish', 'future', 'private'], true) || get_post_meta($old->ID, '_bdk_published_identity', true))) {
                // This filter runs after core uniqueness: check the retained slug too.
                $data['post_name'] = wp_unique_post_slug($old->post_name, $old->ID, $data['post_status'], $old->post_type, $data['post_parent']);
            }
        }
    }
    return $data;
}, 10, 2);
add_filter('map_meta_cap', function ($caps, $cap, $user_id, $args) {
    if ($cap === 'delete_post' && !empty($args[0])) {
        $post = get_post($args[0]);
        if ($post && in_array($post->post_type, ['bdk_page', 'bdk_settings'], true) && !user_can($user_id, 'manage_options')) { return ['do_not_allow']; }
    }
    return $caps;
}, 10, 4);

add_filter('allowed_block_types_all', function ($allowed, $context) {
    if (isset($context->post) && $context->post->post_type === 'post') {
        return ['core/paragraph', 'core/heading', 'core/list', 'core/list-item', 'core/quote', 'core/image', 'core/code', 'core/separator'];
    }
    return $allowed;
}, 10, 2);

function bdk_prose_html($html) {
    $processor = new WP_HTML_Tag_Processor($html);
    while ($processor->next_tag('a')) {
        $href = $processor->get_attribute('href');
        if (is_string($href)) { $processor->set_attribute('href', bdk_public_body_link($href)); }
    }
    return wp_kses($processor->get_updated_html(), [
        'p' => [], 'br' => [], 'h2' => [], 'h3' => [], 'h4' => [], 'h5' => [], 'h6' => [],
        'strong' => [], 'em' => [], 'ul' => [], 'ol' => ['start' => true], 'li' => [],
        'blockquote' => [], 'code' => [], 'pre' => [], 'hr' => [],
        'a' => ['href' => true, 'title' => true],
        'figure' => [], 'figcaption' => [], 'img' => ['src' => true, 'alt' => true, 'width' => true, 'height' => true, 'loading' => true],
    ], ['http', 'https', 'mailto', 'tel']);
}
add_filter('rest_prepare_post', function ($response) {
    $data = $response->get_data();
    if (isset($data['content']['rendered'])) { $data['content']['rendered'] = bdk_prose_html($data['content']['rendered']); }
    $response->set_data($data);
    return $response;
});

require_once __DIR__ . '/editor-ui.php';

add_filter('rest_post_collection_params', function ($params) {
    $params['bdk_managed'] = ['type' => 'boolean', 'default' => false, 'description' => 'Only structured BDK editorial posts.'];
    return $params;
});
add_filter('rest_post_query', function ($args, $request) {
    if ($request->get_param('bdk_managed')) { $args['meta_query'] = [['key' => '_bdk_data', 'compare' => 'EXISTS']]; }
    return $args;
}, 10, 2);
