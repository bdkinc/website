#!/bin/sh
set -eu
wp core is-installed || wp core install --url="$WP_SITEURL" --title="BDK Headless CMS" --admin_user="$WP_ADMIN_USER" --admin_password="$WP_ADMIN_PASS" --admin_email="$WP_ADMIN_EMAIL" --skip-email
wp theme activate bdk-headless
wp plugin activate bdk-content
wp plugin is-installed advanced-custom-fields || wp plugin install advanced-custom-fields
wp plugin activate advanced-custom-fields
wp option update blog_public 0
wp option update permalink_structure '/%postname%/'
wp rewrite flush
wp eval-file /scripts/provision.php
