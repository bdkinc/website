#!/bin/sh
set -eu

WP_PATH="${WP_PATH:-/var/www/html}"

wp core is-installed --path="$WP_PATH" || wp core install \
  --path="$WP_PATH" \
  --url="${WP_SITEURL}" \
  --title="BDK Headless CMS" \
  --admin_user="${WP_ADMIN_USER}" \
  --admin_password="${WP_ADMIN_PASS}" \
  --admin_email="${WP_ADMIN_EMAIL}" \
  --skip-email

wp theme activate bdk-headless --path="$WP_PATH"
wp plugin activate bdk-content --path="$WP_PATH" || true

wp plugin is-installed advanced-custom-fields --path="$WP_PATH" || \
  wp plugin install advanced-custom-fields --activate --path="$WP_PATH"
wp plugin activate advanced-custom-fields --path="$WP_PATH" || true

wp option update blog_public 0 --path="$WP_PATH"

APP_PASS="$(wp user application-password create "${WP_ADMIN_USER}" "astro" --porcelain --path="$WP_PATH")"
printf 'ASTRO_WP_APP_PASSWORD=%s\n' "$APP_PASS"
