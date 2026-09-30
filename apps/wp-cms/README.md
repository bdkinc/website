# Local headless WordPress

PHP and WP-CLI run **only in Docker**. Requires Docker Desktop and the current default Node/npm environment supported by root `package.json` `engines`. No public WordPress theme or page builder is used.

```sh
npm run wp:init -w apps/wp-cms
npm run wp:seed -w apps/wp-cms
```

`wp:init` generates ignored local secrets from `.env.example` only when `.env` is absent, starts database/WordPress, waits for startup, installs core if needed, activates the existing headless theme/content plugin/ACF Free, creates a marketer with the Editor role, and creates application passwords only when the corresponding private credential file is absent. Repeated initialization does not reset passwords or data. Existing invalid credentials cause an explicit failure rather than an automatic rotation. It writes server credential variables into ignored `apps/bdkinc/.env`, preserving unrelated variables.

- Admin/editor: http://localhost:8080/wp-admin/
- REST discovery: http://localhost:8080/wp-json/
- Docker project: `wp-cms`; normal services: `wordpress`, `db`, `scheduler`.
- Named volumes: `wp_core`, `wp_db`; bind-mounted uploads: `wp-content/uploads/`.
- `cli` and optional `adminer` are tools-profile services. Adminer is not started by initialization.
- The CLI/web containers both mount `packages/content/editorial` read-only at `/var/www/bdk-editorial`. Preserve this mount in other deployments.

## Credentials (never commit or print)

- `apps/wp-cms/.env`: database credentials, salts, `WP_ADMIN_USER`, `WP_ADMIN_PASS`, `WP_EDITOR_USER`, `WP_EDITOR_PASS`, and, when used, the deployment secrets `BDK_DEPLOY_HOOK_TOKEN` and `BDK_DEPLOY_CALLBACK_SECRET`.
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

### What editors control
Developers own templates, routes, layout, icons and order. Marketing pages and site settings expose only labeled copy/media fields: no content canvas, section controls, or marketer create/delete. Fields marked `locked` in the definitions are omitted from the editor and rejected in REST writes (403) unless the user can `manage_options`. Media controls open the WP media library. Blog keeps native title, body, publication and scheduling controls with a prose-block allowlist; its labeled fields cover summary, byline, category, tags and image. ACF Free is activated for scaffold compatibility; the shared-definition editor needs no ACF Pro repeaters/options and exposes no JSON textarea.

REST records expose `bdk_data`; updates are partial and preserve untouched fields. `/wp-json/bdk/v1/editorial` exposes labeled field metadata to authenticated editors only. `/wp-json/wp/v2/marketing-pages?slug=home` and `/wp-json/wp/v2/site-settings?slug=site` return published fixed records. Source Markdown is archived as `bdk_original_markdown`, writable only by migration administrators. Public blog HTML is sanitized to supported prose markup.

### Fixed pages and settings: working draft, then publish
Once a fixed page or settings record is published, its edit screen shows a **Website publication** box beside the fields. Saving writes a private **working draft** (`_bdk_working_copy`) and the live copy does not change; the screen states the draft's save time and author. The working draft is not a revision and is never served by the public API. The box offers:

- **Save draft** stores the form as the working draft. Native Update also saves a draft, not a live change.
- **Publish now — replaces live copy** first saves the form, then commits the draft as the live copy, cancels any pending schedule and clears the draft. Users without the native publish permission see it disabled.
- **Schedule** (date/time field plus button, same permission) saves the form, then stores an immutable snapshot of the draft for a future time. The field is read in the **browser's local time zone**, not site time, and is sent as a Unix timestamp. Later edits stay in the draft and never alter the snapshot. The `scheduler` service must be running for it to fire.
- **Cancel schedule** (with confirmation) removes the pending snapshot only; the draft and live copy are untouched.
- **Discard draft** (with confirmation) deletes the draft and resets the form fields to the live copy. A pending schedule is kept; cancel it separately.

The box also reports site publication status. It shows **Retry failed deployment** only when the state is `failed`; the backend additionally accepts a retry from dispatched, building or not configured, but the screen does not offer it there.

These actions call `/wp-json/bdk/v1/working-copy/<id>` (`GET` reads; `POST` takes `action`: `save`, `publish`, `schedule` with a future Unix `publishAt`, `cancel`, `discard`). It requires the REST nonce and `edit_post`; publish and schedule also need the post type's publish capability. The endpoint's publish and schedule actions ignore submitted data and use the saved draft, so the screen saves first and stops if saving fails. Publication, cancellation and revision restore share one database lock per record, so a concurrent request gets 409 "busy" rather than interleaving.

### Images and alt text
Media controls use the native `wp.media` library. Selecting an image fills the alt field of its declared sibling **only when that field is blank and the attachment has alt text**. A custom contextual alt text is preserved. If the alt text is just a filename, ID or dimensions, treat it as a hint to replace it: clear the manual value or discard the change and write a real description. If a media field has a `<field>Recommendation` sibling with text, it is shown under the button as advisory only; it never blocks saving or publishing.

### SEO and redirects
Pages and collection records may carry optional SEO fields (`title`, `description`, `image`, `imageAlt`, `noindex`). Leave them empty to keep the generated defaults. Fixed pages keep their existing SEO rules. There is no canonical-URL override. `noindex` removes the URL from the sitemap; the page stays reachable. Precedence is in [content contracts](../../packages/content/README.md#seo-and-redirects).

Site settings hold `redirects`, a list of strings in the form `/old-path -> /new-path`. It has no default and no migration writes to it. The whole list is validated on save and rejects duplicates, self-redirects, loops, non-internal or reserved targets, sources that collide with a canonical page, and targets that dangle at a terminal. Redirects use the same working-draft, publish, schedule and revision guardrails as other settings. The same checks run in PHP on save and again before publish, schedule and revision restore. Delivery is described in the [deployment guide](../../guides/deployment/dokploy-traefik.md); native production redirect runtime is not proven.

### Copy validation
Every save of a described record (classic form, REST `bdk_data`, working draft) is validated against the effective object, meaning existing values plus your changes plus defaults, before core writes anything. Required fields must be present, optional fields may be absent but not null, a field `default` fills an absent value, and nested groups are checked the same way. Types are not coerced (numbers stay numbers, selects must match a choice). A failure returns 400 (REST) or an error page (classic form), and REST rejects it before the post insert. Publishing or scheduling through core also requires valid stored copy. `creationDefaults` (developer-owned values such as service `icon` and `order`) are added once, only when a record has no copy yet, and never overwrite submitted or existing values. Locked fields still reject marketer changes.

### History and blog
Each publication and each direct save of a collection record creates a native WordPress revision that includes the `_bdk_data` meta (meta revisions need WordPress 6.4+; the container runs 6.8). Restoring an older revision that predates this meta keeps the current `_bdk_data` rather than deleting it. Any restore cancels a pending schedule and records a new revision. Blog posts are not fixed pages: they use native draft/publish/schedule/revision behavior with `_bdk_data` saved alongside, and have no working-draft slot.

See [shared content contracts](../../packages/content/README.md) for the type-safe page-definition/data seam and media-route contract. Existing main-site ContactChat is simulated; this CMS work adds no lead-delivery backend.

## Seeding

Seeder reads the actual seven local Astro collection directories, validates with shared schemas, preserves filename slugs, dates, enums, arrays, asset paths and original Markdown, and creates native blog taxonomy terms. Default reruns skip existing records (including trashed slugs) and never reset marketer copy. `--add-missing-fields` is an explicit additive schema migration; it does not replace existing values. Local files are retained. Collection fields come from `packages/content/editorial/collections.json` (see [content contracts](../../packages/content/README.md)); after a source change, add new fields with `--add-missing-fields` below. Starter WP sample records are retained but excluded from client blog reads via `bdk_managed=true`.

Current migration inventory: services 9, blog 4, locations 12, testimonials 5, partners 6, pSEO services 25, pSEO industries 13 = **74**, plus **21 marketing page catalogs and site settings**. Shared routes preserve **587 paths**: 19 fixed, 4 blog, 408 service/location and 156 industry/location.

`migrations/location-reference.json` preserves all 40 historical geographic records. Its 28 reference-only records are not seeded or activated; only 12 locations previously generated routes. Retain this archive and local collection originals; neither is a runtime fallback and neither authorizes inventing geography facts.

For a deliberate additive schema migration (adds only missing keys, never overwrites existing content):

```sh
npm run wp:seed -w apps/wp-cms -- --add-missing-fields
```

For each existing record the seeder sends one normal record POST with `bdk_missing_fields`, using an administrator (`manage_options`) Application Password. Candidate values are the fixed descriptor defaults plus retained local migration data only, never a runtime fallback. The server computes missing fields recursively and separately for the live copy and for any existing working (private draft) or scheduled snapshot. It preserves every existing value, including draft-only fields, empty text and `false`, and never creates a draft or schedule. Missing live fields are filled immediately, with a revision and a deployment when the copy changed. Existing working and scheduled snapshots receive the same new fields, so a later publish cannot drop newly required schema. A rerun with nothing missing creates no revisions and no deployment. Against an older CMS plugin the seeder stops with an explicit upgrade error. Pausing editing during a migration is prudent procedure; drafts do not need to be discarded.

## Incremental checks

```sh
docker compose -f apps/wp-cms/docker-compose.yml config --quiet
npm run check -w packages/content
npm run wp:cli -w apps/wp-cms -- core is-installed
```

From `apps/wp-cms`, PHP syntax checks use `docker compose exec wordpress php -l <container-file>` with the actual mounted PHP path. On Git Bash set `MSYS_NO_PATHCONV=1` to preserve container paths. No full Astro build is needed. Do not run `down -v` or remove volumes for routine setup.

## Preview current copy

Use **Preview current copy** in the Astro website preview panel. New blog posts must first be saved as drafts. If WordPress has not assigned a slug yet, preview uses a temporary snapshot identity without reserving a public URL; first publication uses WordPress's normal unique-slug assignment. The button collects the current labeled fields and current native blog title/body, including unsaved form edits. For fixed pages and settings the baseline is the saved working draft, so a preview shows saved and unsaved changes together; either way the published copy is untouched. The authenticated, nonce-protected endpoint validates fields/capabilities and stores an immutable per-editor snapshot for 15 minutes; it does **not** update published post content or `_bdk_data`. Later changes require a new preview. Historical revision selection is not offered.

The signed grant binds parent ID, snapshot UUID, editor, fixed path, audience and expiry. Astro validates it and retrieves that exact snapshot using its server-only Editor application password. The URL is a short-lived bearer preview link: do not share or log its query string. This intentionally uses no extra session service. Preview responses use private/no-store, noindex and no-referrer; public URLs ignore preview flags. Preview navigation links lead back to published pages. Expired links require a new preview. The core WP Preview link directs editors to the explicit snapshot control instead of the headless theme.

The current registry covers fixed pages, blog detail and generated service/industry-location templates. Settings, partner and testimonial snapshots preview on home; generated copy/collection previews use a mapped representative published route. The main frontend imports its public templates; each review app renders its own templates with the same authorized snapshot contract. In production use HTTPS; application credentials over remote plain HTTP are rejected. Build workers need only `WORDPRESS_URL`; preview runtime needs the variables above. A static-files-only host cannot run the preview/media endpoints: deploy the existing Node adapter output or equivalent supported runtime.

## Static publication / deployment status

Set server-only `BDK_DEPLOY_HOOK_URL` to the real host/CI webhook and optionally `BDK_DEPLOY_HOOK_TOKEN` for Bearer authentication. With no URL the admin notice reports **not configured**. A WP-CLI-managed `bdk_deploy_hook_url` option is honored for local verification when the environment URL is blank. No local build command is run.

Published record changes, fixed-meta edits, publish/unpublish/delete, scheduled publication and attachment changes create a new deployment ID (state **queued**) and schedule `bdk_dispatch_deployment` 30 seconds out. Dispatch (state **dispatched**) posts `event: content.changed`, `site` and `at` as JSON with an `X-BDK-Deployment-ID` header; the header is the only addition to the existing payload, so CI must carry it through. A non-2xx or network failure requeues (60 s, then 120 s) up to three attempts, then **failed**. A 2xx response only means the hook accepted the request: the state stays **dispatched**, never live.

Later states come from a completion callback:

```http
POST /wp-json/bdk/v1/deployment-status
Authorization: Bearer <BDK_DEPLOY_CALLBACK_SECRET>
{"deploymentId":"<X-BDK-Deployment-ID value>","state":"building|live|failed","message":"optional, up to 500 bytes"}
```

The secret is dedicated (separate from the hook token); with it unset the callback answers 401. A callback for a superseded or non-awaiting deployment gets 409; an invalid payload, or a message over 500 bytes (not characters), gets 400. `live` must mean the new site is actually serving, not that the compile succeeded. **The host-side sender is external and required**: nothing in this repository calls it, and native Dokploy does not do so automatically. Authenticated editors (`edit_posts` plus REST nonce) can read `GET /wp-json/bdk/v1/deployment-status` and `POST /wp-json/bdk/v1/deployment-retry` (the backend allows retry from failed, dispatched, building or not configured; the editor screen shows its button only for failed; the fresh ID invalidates late callbacks from the earlier attempt).

### Scheduler
`DISABLE_WP_CRON` is set, so the `scheduler` Compose service runs `wp cron event run --due-now` every 30 seconds. It drives the dispatch debounce, dispatch retries and scheduled page publication; without it none of these fire. Production must keep an equivalent (this sidecar or a system cron).

### Operations
Production checklist, all unverified: (1) back up `wp_db`, `wp_core` and uploads and test a restore; (2) configure the real deploy hook and a host-side completion callback sender; (3) confirm the scheduler is running; (4) exercise redirects on the production runtime. Backup and restore of `wp_db`, `wp_core` and `wp-content/uploads/`, and their retention, are the operator's responsibility; do not delete these volumes for routine setup. No production restore has been verified. No production hook is configured, and nothing here verifies a production deployment. Never commit `BDK_DEPLOY_HOOK_TOKEN` or `BDK_DEPLOY_CALLBACK_SECRET`. Media uses `/api/cms-media/<upload-path>`; see [content contracts](../../packages/content/README.md) and [deployment configuration](../../guides/deployment/dokploy-traefik.md).
