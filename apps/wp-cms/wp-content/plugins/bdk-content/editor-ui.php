<?php
if (!defined('ABSPATH')) { exit; }

add_action('add_meta_boxes', function ($type, $post) {
    if (bdk_definition($post)) {
        add_meta_box('bdk-copy', 'Website copy and media — fixed layout', function ($post) {
            wp_nonce_field('bdk_copy', 'bdk_copy_nonce');
            echo '<p>Edit wording and media below. Layout, icons and ordering are maintained by the development team.</p>';
            if (bdk_editor_is_fixed_published($post)) {
                echo '<div class="bdk-draft-note"><p><strong>You are editing a private draft.</strong> The live website is unchanged until you choose Publish now. Saving never takes this page offline.</p>' . bdk_editor_draft_meta_html($post) . '</div>';
            }
            $data = bdk_editor_working_data($post);
            $fields = bdk_definition($post)['fields'];
            // Page sections first; search/structured-data groups, which are never visible on the page, last.
            $hidden = array_intersect_key($fields, array_flip(BDK_OFF_PAGE_SECTIONS));
            bdk_render_fields(array_diff_key($fields, $hidden) + $hidden, is_array($data) ? $data : [], 'bdk_copy');
        }, $type, 'normal', 'high');
    }
}, 10, 2);

function bdk_editor_is_fixed_published($post) {
    if (!$post || !($post instanceof WP_Post) || !in_array($post->post_type, ['bdk_page', 'bdk_settings'], true) || ($post->post_status ?? '') !== 'publish') { return false; }
    return (bool) bdk_definition($post);
}

// Editable fields render the saved working draft when the backend provides one; otherwise live copy.
function bdk_editor_working_data($post) {
    $live = get_post_meta($post->ID, '_bdk_data', true);
    if (!bdk_editor_is_fixed_published($post) || !function_exists('bdk_working_copy')) { return $live; }
    $working = bdk_working_copy($post);
    $data = is_array($working) ? ($working['data'] ?? null) : null;
    return is_array($data) ? $data : $live;
}

function bdk_editor_draft_meta_html($post) {
    if (!function_exists('bdk_working_copy')) { return ''; }
    $working = bdk_working_copy($post);
    if (!is_array($working)) { return ''; }
    $saved_at = $working['savedAt'] ?? null;
    $saved_by = $working['savedBy'] ?? null;
    if ($saved_at === null && $saved_by === null) { return '<p class="description">No draft saved yet — fields show the live copy.</p>'; }
    if (is_numeric($saved_by) && ($user = get_user_by('id', (int) $saved_by))) { $saved_by = $user->display_name; }
    if (is_numeric($saved_at)) { $saved_at = date_i18n(get_option('date_format') . ' ' . get_option('time_format'), (int) $saved_at); }
    return '<p class="description">Draft saved ' . esc_html((string) $saved_at) . ('' !== (string) $saved_by ? ' by ' . esc_html((string) $saved_by) : '') . '. Live copy unchanged.</p>';
}

// Flattened descriptor map (dotted path => field type) so the browser sends
// typed leaves: numbers as numbers, booleans as booleans, strings-lists as arrays.
function bdk_editor_field_types($fields, $prefix = '') {
    $map = [];
    foreach ($fields as $key => $field) {
        $path = $prefix === '' ? $key : $prefix . '.' . $key;
        $type = $field['type'] ?? 'text';
        $map[$path] = $type;
        if ($type === 'group' && isset($field['fields']) && is_array($field['fields'])) { $map += bdk_editor_field_types($field['fields'], $path); }
    }
    return $map;
}

// Durable draft controls: only already-published fixed records. Blog posts, new drafts and collections keep native controls.
add_action('add_meta_boxes', function ($type, $post) {
    if (!bdk_editor_is_fixed_published($post)) { return; }
    add_meta_box('bdk-publication', 'Website publication — draft workflow', 'bdk_editor_publication_box', $type, 'side', 'high');
}, 20, 2);

function bdk_editor_publication_box($post) {
    $can_publish = current_user_can('publish_post', $post->ID);
    echo '<div id="bdk-publication">';
    echo '<p><strong>Step 1 — Save draft.</strong> <strong>Step 2 — Preview</strong> from the “Astro website preview” box. <strong>Step 3 — Publish now or schedule.</strong></p>';
    echo '<p id="bdk-working-status" role="status" aria-live="polite">Loading draft status…</p>';
    echo '<p id="bdk-draft-meta" class="description"></p>';
    echo '<p id="bdk-scheduled-meta" class="description"></p>';
    echo '<p class="bdk-btn-row"><button type="button" class="button" id="bdk-save-draft">Save draft</button>';
    if ($can_publish) { echo ' <button type="button" class="button button-primary" id="bdk-publish-now">Publish now — replaces live copy</button>'; }
    else { echo ' <button type="button" class="button button-primary" disabled aria-describedby="bdk-publish-cap">Publish now</button> <span id="bdk-publish-cap" class="description">Publishing needs the native publish permission.</span>'; }
    echo '</p>';
    echo '<p><label for="bdk-schedule-at"><strong>Schedule date &amp; time</strong></label><br>';
    echo '<input type="datetime-local" id="bdk-schedule-at" name="bdk_schedule_at" aria-describedby="bdk-schedule-tz">';
    echo '<br><span id="bdk-schedule-tz" class="description">Browser time — your time zone is detected when the page loads. The picked time is saved as a Unix timestamp.</span></p>';
    echo '<p class="bdk-btn-row">';
    if ($can_publish) { echo '<button type="button" class="button" id="bdk-schedule">Schedule</button> '; }
    echo '<button type="button" class="button-link" id="bdk-cancel-schedule">Cancel schedule</button> ';
    echo '<button type="button" class="button-link bdk-danger" id="bdk-discard-draft">Discard draft</button></p>';
    echo '<hr><h4>Site publication</h4>';
    echo '<p id="bdk-deploy-status" role="status" aria-live="polite">Checking publication status…</p>';
    echo '<p><button type="button" class="button" id="bdk-deploy-retry" hidden>Retry failed deployment</button></p>';
    echo '<p class="description">Publishing replaces the live copy on the next site rebuild. Nothing here unpublishes or deletes this page.</p>';
    echo '</div>';
}

// Native Update/Published messaging must not claim a draft went live: custom
// types ship no message arrays of their own, so initialize and REPLACE them.
// Fixed published records only; everything else keeps core messaging.
add_filter('post_updated_messages', function ($messages) {
    global $post;
    if (!bdk_editor_is_fixed_published($post)) { return $messages; }
    foreach (['bdk_page', 'bdk_settings'] as $type) {
        $messages[$type] = [
            0 => '',
            1 => 'Draft saved. Live website unchanged until you Publish.',
            4 => 'Draft saved. Live website unchanged until you Publish.',
            6 => 'Draft saved. Live website unchanged until you Publish.',
            7 => 'Draft saved. Live website unchanged until you Publish.',
            8 => 'Draft submitted. Live website unchanged until you Publish.',
            10 => 'Draft updated. Live website unchanged until you Publish.',
        ];
    }
    return $messages;
});

const BDK_OFF_PAGE_SECTIONS = ['seo', 'metadata', 'serviceSchema', 'organization'];

// Readable identity for a stored media URL, resolved only through native
// attachment APIs. External URLs stay blank — never faked.
function bdk_media_meta_text($value) {
    if (!is_string($value) || trim($value) === '' || !function_exists('attachment_url_to_postid')) { return ''; }
    $attachment_id = attachment_url_to_postid($value);
    if (!$attachment_id) { return ''; }
    $parts = [];
    $file = function_exists('get_attached_file') ? get_attached_file($attachment_id) : '';
    $filename = $file ? wp_basename($file) : wp_basename($value);
    if ($filename !== '') { $parts[] = $filename; }
    $parts[] = 'ID ' . $attachment_id;
    if (function_exists('wp_get_attachment_metadata')) {
        $meta = wp_get_attachment_metadata($attachment_id);
        if (is_array($meta) && !empty($meta['width']) && !empty($meta['height'])) {
            $parts[] = (int) $meta['width'] . ' × ' . (int) $meta['height'];
        }
    }
    if (!$parts) { return ''; }
    return 'Selected: ' . implode(', ', $parts);
}

function bdk_render_fields($fields, $data, $prefix) {
    foreach ($fields as $key => $field) {
        if (!empty($field['locked'])) { continue; }
        $name = $prefix . '[' . $key . ']';
        $id = 'bdk-' . md5($name);
        $value = $data[$key] ?? '';
        // Top-level keys are page sections; the website preview links to them by key.
        $section = $prefix === 'bdk_copy' ? ' id="bdk-section-' . esc_attr($key) . '" class="bdk-section" data-bdk-section="' . esc_attr($key) . '"' : '';
        if ($field['type'] === 'group') {
            echo '<fieldset' . $section . ' style="border:1px solid #ccc;padding:12px;margin:16px 0"><legend><strong>' . esc_html($field['label']) . '</strong></legend>';
            if ($section && in_array($key, BDK_OFF_PAGE_SECTIONS, true)) { echo '<p class="description">Not shown on the page. Used by search engines and link previews.</p>'; }
            bdk_render_fields($field['fields'], is_array($value) ? $value : [], $name);
            echo '</fieldset>';
            continue;
        }
        echo '<p' . $section . '><label for="' . esc_attr($id) . '"><strong>' . esc_html($field['label']) . '</strong></label><br>';
        if (in_array($field['type'], ['textarea', 'strings'], true)) {
            $text = is_array($value) ? implode("\n", $value) : $value;
            echo '<textarea class="widefat" rows="4" id="' . esc_attr($id) . '" name="' . esc_attr($name) . '">' . esc_textarea($text) . '</textarea>';
        } elseif ($field['type'] === 'select') {
            echo '<select id="' . esc_attr($id) . '" name="' . esc_attr($name) . '">';
            foreach ($field['choices'] as $choice) { echo '<option ' . selected($choice, $value, false) . '>' . esc_html($choice) . '</option>'; }
            echo '</select>';
        } elseif ($field['type'] === 'boolean') {
            echo '<input type="hidden" name="' . esc_attr($name) . '" value="0"><input type="checkbox" id="' . esc_attr($id) . '" name="' . esc_attr($name) . '" value="1" ' . checked(true, (bool) $value, false) . '>';
        } else {
            $type = $field['type'] === 'number' ? 'number' : 'text';
            echo '<input class="widefat" type="' . $type . '" step="any" id="' . esc_attr($id) . '" name="' . esc_attr($name) . '" value="' . esc_attr($value) . '">';
            if ($field['type'] === 'media') {
                $alt_attr = '';
                $alt_key = $key . 'Alt';
                if (isset($fields[$alt_key]) && ($fields[$alt_key]['type'] ?? 'text') !== 'group') {
                    $alt_attr = ' data-alt-target="' . esc_attr('bdk-' . md5($prefix . '[' . $alt_key . ']')) . '"';
                }
                $desc_id = $id . '-desc';
                echo '<button type="button" class="button bdk-media" data-target="' . esc_attr($id) . '"' . $alt_attr . ' data-desc-target="' . esc_attr($desc_id) . '">Choose image</button>';
                $rec_key = $key . 'Recommendation';
                if (isset($fields[$rec_key]) && isset($data[$rec_key]) && is_string($data[$rec_key]) && trim($data[$rec_key]) !== '') {
                    echo '<br><span class="description">' . esc_html(trim($data[$rec_key])) . '</span>';
                }
                echo '<br><span class="description bdk-media-meta" id="' . esc_attr($desc_id) . '" role="status" aria-live="polite">' . esc_html(bdk_media_meta_text($value)) . '</span>';
            }
        }
        echo '</p>';
    }
}

function bdk_form_values($input, $fields) {
    $result = [];
    foreach ($fields as $key => $field) {
        if (!empty($field['locked']) || !array_key_exists($key, $input)) { continue; }
        $value = $input[$key];
        if ($field['type'] === 'group') { $value = bdk_form_values((array) $value, $field['fields']); }
        elseif ($field['type'] === 'number') { $value = is_numeric($value) ? 0 + $value : null; }
        elseif ($field['type'] === 'boolean') { $value = $value === '1'; }
        elseif ($field['type'] === 'strings') { $value = array_values(array_filter(array_map('trim', explode("\n", $value)), 'strlen')); }
        $result[$key] = $value;
    }
    return $result;
}
add_action('save_post', function ($id, $post) {
    if (!isset($_POST['bdk_copy_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['bdk_copy_nonce'])), 'bdk_copy') || wp_is_post_autosave($id) || wp_is_post_revision($id) || !current_user_can('edit_post', $id)) { return; }
    $definition = bdk_definition($post);
    if (!$definition) { return; }
    $result = bdk_update_copy(bdk_form_values(wp_unslash($_POST['bdk_copy'] ?? []), $definition['fields']), $post);
    if (is_wp_error($result)) { wp_die(esc_html($result->get_error_message())); }
}, 10, 2);

// Website preview "edit section" links name a fixed record and section, never a database ID.
add_action('admin_menu', function () {
    $hook = add_submenu_page('', 'Edit website section', '', 'edit_posts', 'bdk-edit', '__return_null');
    add_action('load-' . $hook, function () {
        $record = sanitize_key(wp_unslash($_GET['record'] ?? ''));
        $section = sanitize_text_field(wp_unslash($_GET['section'] ?? ''));
        $post = $record === 'settings' ? get_page_by_path('site', OBJECT, 'bdk_settings') : get_page_by_path($record, OBJECT, 'bdk_page');
        $definition = $post ? bdk_definition($post) : null;
        if (!$definition || !current_user_can('edit_post', $post->ID)) { wp_die('This website section is not editable.', 403); }
        $anchor = isset($definition['fields'][$section]) ? '#bdk-section-' . $section : '';
        wp_safe_redirect(admin_url('post.php?post=' . $post->ID . '&action=edit' . $anchor));
        exit;
    });
});

add_action('admin_enqueue_scripts', function ($hook) {
    if (!in_array($hook, ['post.php', 'post-new.php'], true)) { return; }
    wp_enqueue_media();
    wp_enqueue_script('bdk-editor', plugins_url('editor.js', __FILE__), ['jquery', 'media-editor'], '1.7', true);
    wp_enqueue_style('bdk-editor', plugins_url('editor.css', __FILE__), [], '1.7');
    global $post;
    if ($post instanceof WP_Post && bdk_editor_is_fixed_published($post)) {
        $bdk_editor_definition = bdk_definition($post);
        wp_localize_script('bdk-editor', 'bdkEditorial', [
            'postId' => $post->ID,
            'nonce' => wp_create_nonce('wp_rest'),
            'workingCopy' => rest_url('bdk/v1/working-copy/' . $post->ID),
            'deployStatus' => rest_url('bdk/v1/deployment-status'),
            'deployRetry' => rest_url('bdk/v1/deployment-retry'),
            'canPublish' => current_user_can('publish_post', $post->ID),
            'isFixedPublished' => true,
            'fieldTypes' => $bdk_editor_definition ? bdk_editor_field_types($bdk_editor_definition['fields']) : [],
        ]);
    }
});
