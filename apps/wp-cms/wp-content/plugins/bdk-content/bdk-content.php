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
    $cpts = [
        'service' => ['slug' => 'service', 'rest' => 'services', 'plural' => 'Services', 'singular' => 'Service'],
        'location' => ['slug' => 'location', 'rest' => 'locations', 'plural' => 'Locations', 'singular' => 'Location'],
        'testimonial' => ['slug' => 'testimonial', 'rest' => 'testimonials', 'plural' => 'Testimonials', 'singular' => 'Testimonial'],
        'partner' => ['slug' => 'partner', 'rest' => 'partners', 'plural' => 'Partners', 'singular' => 'Partner'],
        'pseo_service' => ['slug' => 'pseo-service', 'rest' => 'pseo-services', 'plural' => 'pSEO Services', 'singular' => 'pSEO Service'],
        'pseo_industry' => ['slug' => 'pseo-industry', 'rest' => 'pseo-industries', 'plural' => 'pSEO Industries', 'singular' => 'pSEO Industry'],
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
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'],
            'menu_icon' => 'dashicons-admin-post',
        ]);
    }

    register_taxonomy('industry', ['pseo_service', 'pseo_industry'], [
        'labels' => [
            'name' => 'Industries',
            'singular_name' => 'Industry',
        ],
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'industries',
        'hierarchical' => true,
    ]);
}

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
