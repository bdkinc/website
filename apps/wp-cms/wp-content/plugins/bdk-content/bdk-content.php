<?php
/**
 * Plugin Name: BDK Content
 * Description: Custom post types and taxonomies for the BDK marketing site.
 * Version: 0.1.0
 * Author: BDK Inc
 * Text Domain: bdk-content
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', 'bdk_content_register');

function bdk_content_register()
{
    // One "Website" menu: Marketing pages is the parent; submenus follow registration order.
    $website_menu = 'edit.php?post_type=bdk_page';
    foreach (['bdk_page' => ['Marketing pages', 'marketing-pages'], 'bdk_settings' => ['Site settings', 'site-settings']] as $type => $config) {
        register_post_type($type, [
            'label' => $config[0], 'public' => false, 'show_ui' => true, 'show_in_rest' => true,
            'labels' => $type === 'bdk_page' ? ['menu_name' => 'Website', 'all_items' => 'Marketing pages'] : [],
            'show_in_menu' => $type === 'bdk_page' ? true : $website_menu,
            'menu_position' => 3, 'menu_icon' => 'dashicons-admin-site-alt3',
            'rest_base' => $config[1], 'supports' => ['title', 'revisions'],
            'capability_type' => 'post', 'map_meta_cap' => true,
            'capabilities' => ['create_posts' => 'manage_options'],
        ]);
    }

    $cpts = [
        'service' => ['slug' => 'service', 'rest' => 'services', 'plural' => 'Services', 'singular' => 'Service'],
        'location' => ['slug' => 'location', 'rest' => 'locations', 'plural' => 'Locations', 'singular' => 'Location'],
        'pseo_service' => ['slug' => 'pseo-service', 'rest' => 'pseo-services', 'plural' => 'pSEO Services', 'singular' => 'pSEO Service'],
        'pseo_industry' => ['slug' => 'pseo-industry', 'rest' => 'pseo-industries', 'plural' => 'pSEO Industries', 'singular' => 'pSEO Industry'],
        'testimonial' => ['slug' => 'testimonial', 'rest' => 'testimonials', 'plural' => 'Testimonials', 'singular' => 'Testimonial'],
        'partner' => ['slug' => 'partner', 'rest' => 'partners', 'plural' => 'Partners', 'singular' => 'Partner'],
    ];

    foreach ($cpts as $key => $cfg) {
        register_post_type($key, [
            'labels' => [
                'name' => $cfg['plural'],
                'singular_name' => $cfg['singular'],
            ],
            'public' => true,
            'show_in_rest' => true,
            'rest_base' => $cfg['rest'],
            'has_archive' => false,
            'rewrite' => ['slug' => $cfg['slug']],
            'supports' => ['title', 'revisions'],
            'show_in_menu' => $website_menu,
        ]);
    }
}

// The headless site has no native pages or comments; only administrators keep those screens.
add_action('admin_menu', function () {
    if (current_user_can('manage_options')) { return; }
    remove_menu_page('edit.php?post_type=page');
    remove_menu_page('edit-comments.php');
}, 99);
add_action('admin_bar_menu', function ($bar) {
    if (current_user_can('manage_options')) { return; }
    $bar->remove_node('new-page');
    $bar->remove_node('comments');
}, 99);

require_once __DIR__ . '/editorial.php';

add_filter('acf/settings/save_json', 'bdk_content_acf_json_save');
add_filter('acf/settings/load_json', 'bdk_content_acf_json_load');

function bdk_content_acf_json_save($path)
{
    if (!function_exists('acf_get_setting')) {
        return $path;
    }
    return plugin_dir_path(__FILE__) . 'acf-json';
}

function bdk_content_acf_json_load($paths)
{
    if (!function_exists('acf_get_setting')) {
        return $paths;
    }
    $paths[] = plugin_dir_path(__FILE__) . 'acf-json';
    return $paths;
}

require_once __DIR__ . '/preview.php';
require_once __DIR__ . '/deployment.php';
