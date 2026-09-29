<?php
if (!defined('ABSPATH')) { exit; }

add_action('add_meta_boxes', function ($type, $post) {
    if (bdk_definition($post)) {
        add_meta_box('bdk-copy', 'Website copy and media — fixed layout', function ($post) {
            wp_nonce_field('bdk_copy', 'bdk_copy_nonce');
            echo '<p>Edit wording and media below. Layout, icons and ordering are maintained by the development team.</p>';
            $data = get_post_meta($post->ID, '_bdk_data', true);
            $fields = bdk_definition($post)['fields'];
            // Page sections first; search/structured-data groups, which are never visible on the page, last.
            $hidden = array_intersect_key($fields, array_flip(BDK_OFF_PAGE_SECTIONS));
            bdk_render_fields(array_diff_key($fields, $hidden) + $hidden, is_array($data) ? $data : [], 'bdk_copy');
        }, $type, 'normal', 'high');
    }
}, 10, 2);

const BDK_OFF_PAGE_SECTIONS = ['seo', 'metadata', 'serviceSchema', 'organization'];

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
            if ($field['type'] === 'media') { echo '<button type="button" class="button bdk-media" data-target="' . esc_attr($id) . '">Choose image</button>'; }
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
    wp_enqueue_script('bdk-editor', plugins_url('editor.js', __FILE__), ['jquery', 'media-editor'], '1.4', true);
    wp_enqueue_style('bdk-editor', plugins_url('editor.css', __FILE__), [], '1.4');
});
