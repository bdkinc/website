<?php
// Executed only by WP-CLI inside Docker. Never emit credential values.
$editor = get_user_by('login', getenv('WP_EDITOR_USER'));
if (!$editor) {
    $id = wp_insert_user(['user_login' => getenv('WP_EDITOR_USER'), 'user_pass' => getenv('WP_EDITOR_PASS'), 'user_email' => getenv('WP_EDITOR_EMAIL'), 'role' => 'editor']);
    if (is_wp_error($id)) { WP_CLI::error($id->get_error_message()); }
}
$file = '/scripts/.local/credentials.json';
if (!file_exists($file)) {
    $admin = get_user_by('login', getenv('WP_ADMIN_USER'));
    $result = WP_Application_Passwords::create_new_application_password($admin->ID, ['name' => 'BDK local migration and preview']);
    if (is_wp_error($result)) { WP_CLI::error($result->get_error_message()); }
    $data = ['url' => getenv('WP_SITEURL'), 'username' => $admin->user_login, 'applicationPassword' => $result[0]];
    if (file_put_contents($file, wp_json_encode($data)) === false) { WP_CLI::error('Could not persist local application credentials.'); }
    chmod($file, 0600);
}
$preview_file = '/scripts/.local/preview-credentials.json';
if (!file_exists($preview_file)) {
    $editor = get_user_by('login', getenv('WP_EDITOR_USER'));
    $result = WP_Application_Passwords::create_new_application_password($editor->ID, ['name' => 'BDK Astro preview']);
    if (is_wp_error($result)) { WP_CLI::error($result->get_error_message()); }
    if (file_put_contents($preview_file, wp_json_encode(['url' => getenv('WP_SITEURL'), 'username' => $editor->user_login, 'applicationPassword' => $result[0]])) === false) { WP_CLI::error('Could not persist preview credentials.'); }
    chmod($preview_file, 0600);
}
WP_CLI::success('Editor provisioned; migration and preview application credentials persisted privately.');
