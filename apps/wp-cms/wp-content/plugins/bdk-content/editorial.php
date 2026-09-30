<?php
if (!defined('ABSPATH')) { exit; }

// Expand only the shared SEO fieldset; existing field contracts take precedence.
function bdk_expand_seo_fields($fields, $seo) {
    foreach ($fields as &$field) {
        if ($field['type'] === 'group') {
            $field['fields'] = bdk_expand_seo_fields(array_replace(($field['ref'] ?? '') === 'seo' ? $seo : [], $field['fields'] ?? []), $seo);
        }
    }
    unset($field);
    return $fields;
}

function bdk_definitions() {
    static $definitions;
    if ($definitions !== null) { return $definitions; }
    $root = '/var/www/bdk-editorial';
    $definitions = json_decode(file_get_contents($root . '/collections.json'), true, 512, JSON_THROW_ON_ERROR);
    $seo = json_decode(file_get_contents($root . '/seo.json'), true, 512, JSON_THROW_ON_ERROR);
    $routes = json_decode(file_get_contents($root . '/routes.json'), true, 512, JSON_THROW_ON_ERROR);
    foreach (glob($root . '/data/*.json') as $file) {
        $definition = json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
        if ($definition['kind'] === 'page' && (isset($routes[$definition['key']]) || in_array($definition['key'], ['service-location', 'industry-location'], true))) {
            $group = isset($definition['fields']['seo']) ? 'seo' : (isset($definition['fields']['metadata']) ? 'metadata' : 'seo');
            $definition['fields'][$group] = array_replace(array_merge(['type' => 'group', 'label' => 'Search and sharing'], isset($definition['fields'][$group]) ? [] : ['optional' => true]), $definition['fields'][$group] ?? [], ['ref' => 'seo']);
        }
        $definitions[$definition['kind'] . ':' . $definition['key']] = $definition;
    }
    foreach ($definitions as &$definition) {
        $definition['fields'] = bdk_expand_seo_fields($definition['fields'], $seo);
    }
    unset($definition);
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

// Canonical identities mirror getSiteRoutes; duplicate service identities share one path.
function bdk_redirect_public_paths() {
    $paths = array_values(json_decode(file_get_contents('/var/www/bdk-editorial/routes.json'), true, 512, JSON_THROW_ON_ERROR));
    $posts = get_posts(['post_type' => ['post', 'service', 'pseo_service', 'pseo_industry', 'location'], 'post_status' => 'publish', 'numberposts' => -1, 'orderby' => 'ID', 'order' => 'ASC']);
    $locations = array_filter($posts, function ($post) { return $post->post_type === 'location'; });
    foreach ($posts as $post) {
        if ($post->post_type === 'post') {
            $path = bdk_public_path($post);
            if ($path) { $paths[] = $path; }
        } elseif (in_array($post->post_type, ['service', 'pseo_service', 'pseo_industry'], true)) {
            foreach ($locations as $location) {
                $path = bdk_preview_generated_path($post->post_type, $post, $location);
                if ($path) { $paths[] = $path; }
            }
        }
    }
    return array_values(array_unique(array_map(function ($path) { return rtrim($path, '/') ?: '/'; }, $paths)));
}

function bdk_redirect_path($value) {
    // ECMAScript String.trim whitespace, matching the shared TypeScript parser.
    $trimmed = preg_replace('/^[\x{0009}-\x{000D}\x{0020}\x{00A0}\x{1680}\x{2000}-\x{200A}\x{2028}\x{2029}\x{202F}\x{205F}\x{3000}\x{FEFF}]+|[\x{0009}-\x{000D}\x{0020}\x{00A0}\x{1680}\x{2000}-\x{200A}\x{2028}\x{2029}\x{202F}\x{205F}\x{3000}\x{FEFF}]+$/u', '', $value);
    $path = rtrim($trimmed, '/');
    if ($trimmed === '/') { $path = '/'; }
    if (strpos($trimmed, '//') !== false || !preg_match('~^/(?:[a-z0-9._\x7e-]+(?:/[a-z0-9._\x7e-]+)*)?$~iD', $path)
        || array_intersect(explode('/', $path), ['.', '..'])
        || preg_match('~^/(?:preview|api|_astro|404|wp-admin|wp-json|wp-content|wp-includes)(?:/|$)~i', $path)
        || preg_match('~^/wp-[^/]*\.php(?:/|$)~i', $path)) {
        return new WP_Error('bdk_redirects', 'Invalid redirects path: ' . $value, ['status' => 400]);
    }
    return $path;
}

function bdk_validate_site_redirects($data) {
    if (!isset($data['redirects']) || $data['redirects'] === []) { return $data; }
    $canonical = array_fill_keys(bdk_redirect_public_paths(), true);
    $redirects = [];
    foreach ($data['redirects'] as $line) {
        $parts = explode('->', $line);
        if (count($parts) !== 2) { return new WP_Error('bdk_redirects', 'Invalid redirects pair: ' . $line, ['status' => 400]); }
        $source = bdk_redirect_path($parts[0]);
        $target = bdk_redirect_path($parts[1]);
        if (is_wp_error($source)) { return $source; }
        if (is_wp_error($target)) { return $target; }
        if ($source === $target) { return new WP_Error('bdk_redirects', 'Self redirect: ' . $source, ['status' => 400]); }
        if (isset($redirects[$source])) { return new WP_Error('bdk_redirects', 'Duplicate redirects source: ' . $source, ['status' => 400]); }
        if (isset($canonical[$source])) { return new WP_Error('bdk_redirects', 'Redirects source is a public path: ' . $source, ['status' => 400]); }
        $redirects[$source] = $target;
    }
    foreach ($redirects as $source => $unused) {
        $seen = [];
        $target = $source;
        while (isset($redirects[$target])) {
            if (isset($seen[$target])) { return new WP_Error('bdk_redirects', 'Redirects loop: ' . $source, ['status' => 400]); }
            $seen[$target] = true;
            $target = $redirects[$target];
        }
        if (!isset($canonical[$target])) { return new WP_Error('bdk_redirects', 'Redirects target is not a public path: ' . $target, ['status' => 400]); }
    }
    return $data;
}

// Check the effective object without coercing or rewriting untouched values.
function bdk_complete_fields($data, $fields) {
    foreach ($fields as $key => $field) {
        if (!array_key_exists($key, $data)) {
            if (array_key_exists('default', $field)) { $data[$key] = $field['default']; }
            elseif (!empty($field['optional'])) { continue; }
            else { return new WP_Error('bdk_required', 'Missing copy field: ' . $key, ['status' => 400]); }
        }
        $value = $data[$key];
        switch ($field['type']) {
            case 'group':
                if (!is_array($value)) { return new WP_Error('bdk_shape', 'Expected an object: ' . $key, ['status' => 400]); }
                $value = bdk_complete_fields($value, $field['fields']);
                if (is_wp_error($value)) { return $value; }
                if ($value === [] && !empty($field['optional']) && ($field['ref'] ?? '') === 'seo') {
                    unset($data[$key]);
                } else {
                    $data[$key] = $value;
                }
                break;
            case 'number': $valid = (is_int($value) || is_float($value)) && is_finite($value); break;
            case 'boolean': $valid = is_bool($value); break;
            case 'strings': $valid = is_array($value) && array_values($value) === $value && count(array_filter($value, 'is_string')) === count($value); break;
            case 'select': $valid = is_string($value) && in_array($value, $field['choices'], true); break;
            case 'date': $valid = is_string($value) && strtotime($value) !== false; break;
            default: $valid = is_string($value);
        }
        if ($field['type'] !== 'group' && !$valid) { return new WP_Error('bdk_value', 'Invalid copy field: ' . $key, ['status' => 400]); }
    }
    return $fields === (bdk_definitions()['settings:site']['fields'] ?? null) ? bdk_validate_site_redirects($data) : $data;
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
            $value = bdk_validate_fields($value, $field['fields'], is_array($previous[$key] ?? null) ? $previous[$key] : []);
            if (is_wp_error($value)) { return $value; }
        } elseif ($type === 'number') {
            if (!is_int($value) && !is_float($value)) { return new WP_Error('bdk_number', 'Expected a number: ' . $key, ['status' => 400]); }
        } elseif ($type === 'boolean') {
            if (!is_bool($value)) { return new WP_Error('bdk_boolean', 'Expected a boolean: ' . $key, ['status' => 400]); }
        } elseif ($type === 'strings') {
            if (!is_array($value) || array_values($value) !== $value || count(array_filter($value, 'is_string')) !== count($value)) { return new WP_Error('bdk_strings', 'Expected a list of strings: ' . $key, ['status' => 400]); }
            if ($key !== 'redirects' || $fields !== (bdk_definitions()['settings:site']['fields'] ?? null)) { $value = array_map('sanitize_text_field', $value); }
        } else {
            if (!is_string($value)) { return new WP_Error('bdk_string', 'Expected text: ' . $key, ['status' => 400]); }
            if ($type === 'select' && !in_array($value, $field['choices'], true)) { return new WP_Error('bdk_choice', 'Invalid choice: ' . $key, ['status' => 400]); }
            if (in_array($type, ['url', 'media'], true) && $value !== '' && !preg_match('~^(https?://|/(?!/)|mailto:|tel:|#)~i', $value)) { return new WP_Error('bdk_url', 'Use an HTTP(S) URL or a site-relative path: ' . $key, ['status' => 400]); }
            if ($type === 'date' && strtotime($value) === false) { return new WP_Error('bdk_date', 'Invalid date: ' . $key, ['status' => 400]); }
            $value = $type === 'textarea' ? sanitize_textarea_field($value) : sanitize_text_field($value);
        }
        $previous[$key] = $value;
    }
    return bdk_complete_fields($previous, $fields);
}

function bdk_effective_copy($input, $post) {
    $definition = bdk_definition($post);
    if (!$definition) { return new WP_Error('bdk_definition', 'No fixed definition for this record.', ['status' => 400]); }
    $previous = bdk_fixed_copy($post) && ($post->post_status === 'publish' || get_post_status($post->ID) === 'publish') ? bdk_working_copy($post)['data'] : get_post_meta($post->ID, '_bdk_data', true);
    if (!is_array($previous)) { $previous = []; }
    // Trusted developer defaults, never a marketer ownership bypass or an overwrite.
    if (!metadata_exists('post', $post->ID, '_bdk_data')) {
        foreach ($definition['creationDefaults'] ?? [] as $key => $value) {
            if (!array_key_exists($key, $previous) && !array_key_exists($key, $input)) { $previous[$key] = $value; }
        }
    }
    if ($post->post_type === 'post') {
        $previous['title'] = $post->post_title;
        $previous['pubDate'] = get_post_time('c', true, $post) ?: get_post_time('c', false, $post);
        // get_post_time cannot resolve a not-yet-inserted WP_Post (ID 0).
        if (!$post->ID) {
            $date = DateTimeImmutable::createFromFormat('!Y-m-d H:i:s', $post->post_date_gmt, new DateTimeZone('UTC'));
            $previous['pubDate'] = $date ? $date->format('c') : false;
        }
        $previous['draft'] = $post->post_status !== 'publish';
    }
    $data = bdk_validate_fields($input, $definition['fields'], $previous);
    if (is_wp_error($data)) { return $data; }
    if ($post->post_type === 'post') {
        foreach (['title', 'pubDate', 'draft'] as $key) { $data[$key] = $previous[$key]; }
    }
    return bdk_complete_fields($data, $definition['fields']);
}

function bdk_update_copy($input, $post) {
    if (!current_user_can('edit_post', $post->ID)) { return new WP_Error('bdk_forbidden', 'Cannot edit this record.', ['status' => 403]); }
    $definition = bdk_definition($post);
    if (!$definition) { return new WP_Error('bdk_definition', 'No fixed definition for this record.', ['status' => 400]); }
    if (!is_array($input)) { return new WP_Error('bdk_shape', 'Copy must be an object.', ['status' => 400]); }
    return bdk_with_copy_lock($post->ID, function () use ($input, $post) {
        $post = get_post($post->ID);
        $data = bdk_effective_copy($input, $post);
        if (is_wp_error($data)) { return $data; }
        if (bdk_fixed_copy($post) && $post->post_status === 'publish') { return bdk_save_working_copy($input, $post); }
        if ($post->post_type === 'post') {
            foreach (['category' => 'category', 'tags' => 'post_tag'] as $key => $taxonomy) {
                if (array_key_exists($key, $input)) {
                    $terms = wp_set_object_terms($post->ID, (array) $data[$key], $taxonomy);
                    if (is_wp_error($terms)) { return $terms; }
                }
            }
        }
        wp_save_post_revision($post->ID);
        update_post_meta($post->ID, '_bdk_data', wp_slash($data));
        wp_save_post_revision($post->ID);
        return true;
    });
}

// Migration candidates never replace a present value, including falsey leaves.
function bdk_merge_missing_fields($current, $defaults, $fields, &$added, $prefix = '') {
    foreach ($defaults as $key => $value) {
        $path = $prefix . $key;
        if (!array_key_exists($key, $current)) {
            $current[$key] = $value;
            $added[] = $path;
        } elseif ($fields[$key]['type'] === 'group' && is_array($current[$key])) {
            $current[$key] = bdk_merge_missing_fields($current[$key], $value, $fields[$key]['fields'], $added, $path . '.');
        }
    }
    return $current;
}

function bdk_add_missing_copy($defaults, $post) {
    if (!current_user_can('manage_options') || !current_user_can('edit_post', $post->ID)) {
        return new WP_Error('bdk_forbidden', 'Missing-field migration requires manage_options.', ['status' => 403]);
    }
    return bdk_with_copy_lock($post->ID, function () use ($defaults, $post) {
        $post = get_post($post->ID);
        $definition = bdk_definition($post);
        if (!$definition) { return new WP_Error('bdk_definition', 'No fixed definition for this record.', ['status' => 400]); }
        $fields = $definition['fields'];
        // Validate every submitted candidate, even when the corresponding key exists.
        $defaults = bdk_validate_fields($defaults, $fields);
        if (is_wp_error($defaults)) { return $defaults; }
        if ($post->post_type === 'post') {
            $defaults = array_replace($defaults, array_intersect_key(bdk_copy_data($post), array_flip(['title', 'pubDate', 'draft'])));
        }
        $stores = ['live' => metadata_exists('post', $post->ID, '_bdk_data') ? get_post_meta($post->ID, '_bdk_data', true) : []];
        foreach (['working' => '_bdk_working_copy', 'scheduled' => '_bdk_scheduled_copy'] as $name => $key) {
            if (metadata_exists('post', $post->ID, $key)) { $stores[$name] = get_post_meta($post->ID, $key, true); }
        }
        $additions = [];
        $merged = [];
        foreach ($stores as $name => $store) {
            $current = $name === 'live' ? $store : ($store['data'] ?? null);
            if (!is_array($current)) { return new WP_Error('bdk_shape', 'Stored copy must be an object: ' . $name, ['status' => 400]); }
            $additions[$name] = [];
            $data = bdk_merge_missing_fields($current, $defaults, $fields, $additions[$name]);
            // Native blog identity is canonical for validation, not migration input.
            $effective = $post->post_type === 'post' ? array_merge($data, array_intersect_key(bdk_copy_data($post), array_flip(['title', 'pubDate', 'draft']))) : $data;
            $valid = bdk_complete_fields($effective, $fields);
            if (is_wp_error($valid)) { return $valid; }
            $merged[$name] = $name === 'live' ? $data : array_replace($store, ['data' => $data]);
        }
        // All stores have passed validation before the first write. No slot is created.
        if ($merged['live'] !== $stores['live']) { bdk_commit_copy($post, $merged['live']); }
        foreach (['working' => '_bdk_working_copy', 'scheduled' => '_bdk_scheduled_copy'] as $name => $key) {
            if (isset($merged[$name]) && $merged[$name] !== $stores[$name]) { update_post_meta($post->ID, $key, wp_slash($merged[$name])); }
        }
        return $additions;
    });
}

// Use the existing native record endpoint and Application Password permissions.
// Bypass core's native insert for this meta-only operation: even an identical
// wp_update_post fires publication hooks, defeating migration idempotence.
add_filter('rest_dispatch_request', function ($response, $request, $route, $handler) {
    if ($response !== null || !$request->has_param('bdk_missing_fields')) { return $response; }
    $callback = $handler['callback'];
    if (!is_array($callback) || !($callback[0] instanceof WP_REST_Posts_Controller) || $callback[1] !== 'update_item') {
        return new WP_Error('bdk_target', 'Missing-field migration requires an existing native record update.', ['status' => 400]);
    }
    if (array_diff(array_keys($request->get_params()), ['id', 'context', 'bdk_missing_fields'])) {
        return new WP_Error('bdk_migration', 'Missing-field migration cannot include native record changes or bdk_data.', ['status' => 400]);
    }
    $permission = $callback[0]->update_item_permissions_check($request);
    if (is_wp_error($permission)) { return $permission; }
    if (!$permission) { return new WP_Error('bdk_forbidden', 'Cannot edit this record.', ['status' => 403]); }
    $result = bdk_add_missing_copy($request['bdk_missing_fields'], get_post((int) $request['id']));
    if (is_wp_error($result)) { return $result; }
    $response = $callback[0]->get_item($request);
    if (is_wp_error($response)) { return $response; }
    $data = $response->get_data();
    $data['bdk_missing_fields'] = $result;
    $response->set_data($data);
    return $response;
}, 10, 4);

add_action('rest_api_init', function () {
    $types = ['post', 'service', 'location', 'testimonial', 'partner', 'pseo_service', 'pseo_industry', 'bdk_page', 'bdk_settings'];
    register_rest_field($types, 'bdk_missing_fields', [
        'update_callback' => 'bdk_add_missing_copy',
        'schema' => ['description' => 'Administrator-only additive migration candidates; cannot accompany native changes.', 'type' => 'object', 'context' => ['edit']],
    ]);
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

// REST additional fields are saved after core inserts: reject bad copy before that insert.
foreach (['post', 'service', 'location', 'testimonial', 'partner', 'pseo_service', 'pseo_industry', 'bdk_page', 'bdk_settings'] as $type) {
    add_filter('rest_pre_insert_' . $type, function ($prepared, $request) use ($type) {
        unset($GLOBALS['bdk_preinsert_copy']);
        if (is_wp_error($prepared)) { return $prepared; }
        $old = $request['id'] ? get_post((int) $request['id']) : null;
        $post = new WP_Post((object) array_merge($old ? $old->to_array() : ['ID' => 0, 'post_type' => $type, 'post_title' => '', 'post_name' => '', 'post_status' => 'draft', 'post_date' => current_time('mysql'), 'post_date_gmt' => current_time('mysql', true)], (array) $prepared));
        // Validate the identity core will actually retain, not a proposed locked slug.
        $post = new WP_Post((object) bdk_preserve_identity($post->to_array(), ['ID' => $post->ID]));
        // Core fills omitted dates during insertion, after this REST filter.
        if (!$post->post_date || $post->post_date === '0000-00-00 00:00:00') { $post->post_date = current_time('mysql'); }
        if (!$post->post_date_gmt || $post->post_date_gmt === '0000-00-00 00:00:00') { $post->post_date_gmt = get_gmt_from_date($post->post_date); }
        if (!bdk_definition($post)) {
            if ($old && bdk_definition($old)) { return new WP_Error('bdk_definition', 'No fixed definition for this record.', ['status' => 400]); }
            return $prepared;
        }
        $input = $request->has_param('bdk_data') ? $request['bdk_data'] : [];
        if (!is_array($input)) { return new WP_Error('bdk_shape', 'Copy must be an object.', ['status' => 400]); }
        $result = bdk_effective_copy($input, $post);
        if (is_wp_error($result)) { return $result; }
        $GLOBALS['bdk_preinsert_copy'] = ['id' => $post->ID, 'type' => $type];
        return $prepared;
    }, 10, 2);
}

add_filter('rest_request_after_callbacks', function ($response) {
    unset($GLOBALS['bdk_preinsert_copy']);
    return $response;
});

// Classic form errors abort before core changes content/status; non-form publication
// also requires valid stored copy. Auto-drafts remain available for initial editing.
add_filter('wp_insert_post_data', function ($data, $postarr) {
    if (in_array($data['post_status'], ['auto-draft', 'trash', 'inherit'], true)) { return $data; }
    $post = new WP_Post((object) array_merge($data, ['ID' => (int) ($postarr['ID'] ?? 0)]));
    $definition = bdk_definition($post);
    if (!$definition) { return $data; }
    $pending = $GLOBALS['bdk_preinsert_copy'] ?? null;
    if ($pending && $pending['id'] === $post->ID && $pending['type'] === $post->post_type) {
        unset($GLOBALS['bdk_preinsert_copy']);
        return $data; // The REST error-returning preflight already checked this payload.
    }
    $form = isset($_POST['bdk_copy_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['bdk_copy_nonce'])), 'bdk_copy');
    if (!$form && !in_array($post->post_status, ['publish', 'future', 'private'], true)) { return $data; }
    $input = $form ? bdk_form_values(wp_unslash($_POST['bdk_copy'] ?? []), $definition['fields']) : [];
    $result = bdk_effective_copy($input, $post);
    if (is_wp_error($result)) { wp_die($result); }
    return $data;
}, 20, 2);

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
function bdk_preserve_identity($data, $postarr) {
    if (!empty($postarr['ID'])) {
        $fixed = get_post($postarr['ID']);
        if (bdk_fixed_copy($fixed) && $fixed->post_status === 'publish' && in_array($data['post_status'], ['draft', 'pending', 'future'], true)) { $data['post_status'] = 'publish'; }
    }
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
}
add_filter('wp_insert_post_data', 'bdk_preserve_identity', 10, 2);
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
