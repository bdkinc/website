# Local headless WordPress

PHP and WP-CLI run **only in Docker**. Requires Docker Desktop and the current default Node/npm environment supported by root `package.json` `engines`. No public WordPress theme or page builder is used.

```sh
npm run wp:init -w apps/wp-cms
npm run wp:seed -w apps/wp-cms
```

`wp:init` generates ignored local secrets from `.env.example` only when `.env` is absent, starts database/WordPress, waits for startup, installs core if needed, activates the existing headless theme/content plugin/ACF Free, creates a marketer with the Editor role, and creates application passwords only when the corresponding private credential file is absent. Repeated initialization does not reset passwords or data. Existing invalid credentials cause an explicit failure rather than an automatic rotation. It writes server credential variables into ignored `apps/bdkinc/.env`, preserving unrelated variables.

- Admin/editor: http://localhost:8080/wp-admin/
- REST discovery: http://localhost:8080/wp-json/
- Docker project: `wp-cms`; normal services: `wordpress`, `db`.
- Named volumes: `wp_core`, `wp_db`; bind-mounted uploads: `wp-content/uploads/`.
- `cli` and optional `adminer` are tools-profile services. Adminer is not started by initialization.
- The CLI/web containers both mount `packages/content/editorial` read-only at `/var/www/bdk-editorial`. Preserve this mount in other deployments.

## Credentials (never commit or print)

- `apps/wp-cms/.env`: database credentials, salts, `WP_ADMIN_USER`, `WP_ADMIN_PASS`, `WP_EDITOR_USER`, `WP_EDITOR_PASS`.
- `apps/wp-cms/scripts/.local/credentials.json`: administrative migration application password.
- `apps/wp-cms/scripts/.local/preview-credentials.json`: Editor-level Astro preview application password.
- `apps/bdkinc/.env`: `WORDPRESS_URL`, `WORDPRESS_USERNAME`, `WORDPRESS_APPLICATION_PASSWORD`, `BDK_PREVIEW_SECRET`, `BDK_PREVIEW_AUDIENCE`. Do not prefix these with `PUBLIC_`.
- WordPress `BDK_PREVIEW_SECRET` must match Astro. Initialization creates/reuses the shared secret and copies it privately to the main app only.

### Three preview targets
Each frontend needs server-only `WORDPRESS_URL`, `WORDPRESS_USERNAME`, `WORDPRESS_APPLICATION_PASSWORD`, `BDK_PREVIEW_SECRET` and `BDK_PREVIEW_AUDIENCE`. Configure review-app environments separately; initialization does not populate them.

| WordPress target variable | Frontend | Matching local `BDK_PREVIEW_AUDIENCE` |
| --- | --- | --- |
| `FRONTEND_URL` | `apps/bdkinc` | `http://localhost:4321` |
| `BDK_PREVIEW_EDITORIAL_URL` | `apps/design-editorial` | `http://localhost:4322` |
| `BDK_PREVIEW_SYSTEMS_URL` | `apps/design-systems` | `http://localhost:4323` |

Origins must match even if the browser uses a `127.0.0.1` development URL. Start frontends with root scripts `npm run dev:site`, `npm run dev:editorial` and `npm run dev:systems`. Main and Systems provide `.env.example`; Editorial uses the same server-side keys listed above. Review designs are temporary, noindex and canonicalize to the main site.

The frontend published-content client is anonymous; only protected server preview calls use the Editor application password. Migration credentials never go into the Astro environment. Files are created mode 0600 where supported; Windows directory ACLs still govern local access. Keep these files and Docker volumes together. Losing a credential file while retaining the DB requires deliberate application-password cleanup; it is not a database reset procedure.

## Editing

Marketing pages and site settings have labeled fixed copy/media fields, no content canvas, no section controls and no marketer create/delete capability. Icons/order/display placement remain locked in the collection editor and in REST writes. Media controls open the WP media library. Blog uses native title/publication controls and a prose-block allowlist; its labeled fields cover summary/byline/category/tags/image. ACF Free is activated for scaffold compatibility; the small shared-definition editor does not require ACF Pro repeaters/options or expose a JSON textarea.

REST records expose `bdk_data`; updates are partial and preserve untouched fields. `/wp-json/bdk/v1/editorial` exposes labeled field metadata only to authenticated editors. `/wp-json/wp/v2/marketing-pages?slug=home` and `/wp-json/wp/v2/site-settings?slug=site` provide published fixed records. Source Markdown is archived separately as `bdk_original_markdown`; only migration administrators can change it. Public blog HTML is sanitized to supported prose markup.

See [shared content contracts](../../packages/content/README.md) for the type-safe page-definition/data seam and media-route contract. Structure, routes and layouts remain developer-owned. Existing main-site ContactChat is simulated; this CMS work adds no lead-delivery backend.

## Seeding

Seeder reads the actual seven local Astro collection directories, validates with shared schemas, preserves filename slugs, dates, enums, arrays, asset paths and original Markdown, and creates native blog taxonomy terms. Default reruns skip existing records (including trashed slugs) and never reset marketer copy. `--add-missing-fields` is an explicit additive schema migration; it does not replace existing values. Local files are retained. Starter WP sample records are retained but excluded from client blog reads via `bdk_managed=true`.

Current migration inventory: services 9, blog 4, locations 12, testimonials 5, partners 6, pSEO services 25, pSEO industries 13 = **74**, plus **21 marketing page catalogs and site settings**. Shared routes preserve **587 paths**: 19 fixed, 4 blog, 408 service/location and 156 industry/location.

`migrations/location-reference.json` preserves all 40 historical geographic records. Its 28 reference-only records are not seeded or activated; only 12 locations previously generated routes. Retain this archive and local collection originals; neither is a runtime fallback and neither authorizes inventing geography facts.

For a deliberate additive schema migration:

```sh
npm run wp:seed -w apps/wp-cms -- --add-missing-fields
```

## Incremental checks

```sh
docker compose -f apps/wp-cms/docker-compose.yml config --quiet
npm run check -w packages/content
npm run wp:cli -w apps/wp-cms -- core is-installed
```

From `apps/wp-cms`, PHP syntax checks use `docker compose exec wordpress php -l <container-file>` with the actual mounted PHP path. On Git Bash set `MSYS_NO_PATHCONV=1` to preserve container paths. No full Astro build is needed. Do not run `down -v` or remove volumes for routine setup.

## Preview current copy

Use **Preview current copy** in the Astro website preview panel. New blog posts must first be saved as drafts. If WordPress has not assigned a slug yet, preview uses a temporary snapshot identity without reserving a public URL; first publication uses WordPress's normal unique-slug assignment. The button collects the current labeled fields and current native blog title/body, including unsaved form edits. The authenticated, nonce-protected endpoint validates fields/capabilities and stores an immutable per-editor snapshot for 15 minutes; it does **not** update published post content or `_bdk_data`. Later changes require a new preview. Historical revision selection is not offered.

The signed grant binds parent ID, snapshot UUID, editor, fixed path, audience and expiry. Astro validates it and retrieves that exact snapshot using its server-only Editor application password. The URL is a short-lived bearer preview link: do not share or log its query string. This intentionally uses no extra session service. Preview responses use private/no-store, noindex and no-referrer; public URLs ignore preview flags. Preview navigation links lead back to published pages. Expired links require a new preview. The core WP Preview link directs editors to the explicit snapshot control instead of the headless theme.

The current registry covers fixed pages, blog detail and generated service/industry-location templates. Settings, partner and testimonial snapshots preview on home; generated copy/collection previews use a mapped representative published route. The main frontend imports its public templates; each review app renders its own templates with the same authorized snapshot contract. In production use HTTPS; application credentials over remote plain HTTP are rejected. Build workers need only `WORDPRESS_URL`; preview runtime needs the variables above. A static-files-only host cannot run the preview/media endpoints: deploy the existing Node adapter output or equivalent supported runtime.

## Static publication / deployment hook

Set server-only `BDK_DEPLOY_HOOK_URL` to the real host/CI webhook and optionally `BDK_DEPLOY_HOOK_TOKEN` for Bearer authentication. No local build command is run. With no URL, the admin notice reports **not configured**. For controlled local verification only, a WP-CLI-managed `bdk_deploy_hook_url` option is supported when the environment URL is blank.

Published record changes, fixed-meta edits, publish/unpublish/delete, scheduled publication and attachment changes queue `bdk_dispatch_deployment` once after 30 seconds. WP cron dispatches a JSON POST (`event: content.changed`, site, timestamp); non-2xx/network failure is recorded and retried up to three attempts. The `bdk_deploy_status` option/admin notice distinguishes queued, failed and **dispatch accepted (deployment pending)**. A 2xx response is not proof of a completed deployment. Configure a real system cron to invoke WordPress cron on quiet/private origins. The build must fetch the latest published content and successfully deploy before public static output changes.

Validation used a temporary local capture returning 202, not a production deployment. No production hook is configured; the user must supply the real URL/token. Production requires TLS and functioning WP cron. No full build or production deployment is verified or authorized by this setup. Media uses `/api/cms-media/<upload-path>` and preserves core public-media access; see [content contracts](../../packages/content/README.md) and [deployment configuration](../../guides/deployment/dokploy-traefik.md).
