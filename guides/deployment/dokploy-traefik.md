# Dokploy + Traefik deployment configuration

This is a configuration guide, **not evidence of a production deployment**. Full builds and deployments require explicit authorization. Local implementation/readiness is tracked in [the CMS implementation record](../../docs/plan/wordpress-headless-cms.md).

## Services and routing
- WordPress uses `apps/wp-cms/docker-compose.yml`, not a custom CMS Dockerfile. Its `wordpress` container listens on **80**; local Compose binds it to `127.0.0.1:8080`. Route the production CMS TLS hostname to container port 80 using the deployment's Traefik network configuration.
- The main Astro site uses `apps/bdkinc/Dockerfile` with **repository root** as build context. Its Node server listens on **4321**. Route the public TLS hostname to that port.
- The Compose `scheduler` service runs WP-CLI due-event processing every 30 seconds (WP's own cron is disabled). Deploy it alongside `wordpress` with the same mounts; deployment dispatch, retries and scheduled publication depend on it.
- Use separate services so a content rebuild does not recreate the database. Preserve `wp_db`, `wp_core`, the uploads bind mount and custom plugin/theme mounts. Both WordPress and CLI need `packages/content/editorial` mounted read-only at `/var/www/bdk-editorial`.
- `apps/design-editorial` (4322) and `apps/design-systems` (4323) are temporary local review apps. They have Node adapters but no dedicated Dockerfiles; do not assume they have been deployed. `apps/bdkcloud` remains planned.

The checked-in Compose setup is local/loopback-oriented. Production routing, TLS, network access and persistent storage must be configured for the actual host; do not delete original files or volumes to initialize it.

## WordPress environment
Start from `apps/wp-cms/.env.example`, supplying values through protected server configuration:

- Database: `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`.
- Origins: `WP_HOME`, `WP_SITEURL` (the CMS HTTPS origin), `FRONTEND_URL` (the main frontend origin).
- WordPress salts/keys and initial administrator/editor variables are listed in that example. Set `WP_ENVIRONMENT_TYPE` and `WP_DEBUG` deliberately for production.
- `BDK_PREVIEW_SECRET`: matches frontend runtime verification.
- Optional review target origins: `BDK_PREVIEW_EDITORIAL_URL`, `BDK_PREVIEW_SYSTEMS_URL`; omit when not hosting the temporary concepts.
- `BDK_DEPLOY_HOOK_URL`: the actual Dokploy/CI deployment hook supplied by the user. `BDK_DEPLOY_HOOK_TOKEN` optionally supplies Bearer authentication.
- `BDK_DEPLOY_CALLBACK_SECRET`: dedicated bearer secret the deployment system uses to report status back. Blank disables callbacks. Keep it separate from the hook token and never commit it.

The repository does not configure a production deployment hook. Do not publish credentials, preview links or ignored local credential files.

## Astro build and runtime environment
The existing Dockerfile uses Node 24 and runs the main workspace build. It requires **`WORDPRESS_URL` as a Docker build argument**, reachable from the build worker. Published content reads are anonymous; preview credentials are not needed for the build.

Set runtime variables from `apps/bdkinc/.env.example`:

- `WORDPRESS_URL`: reachable CMS origin for previews and the upload proxy.
- `WORDPRESS_USERNAME`, `WORDPRESS_APPLICATION_PASSWORD`: authorized Editor-level preview credentials, not migration administrator credentials.
- `BDK_PREVIEW_SECRET`: same secret as WordPress.
- `BDK_PREVIEW_AUDIENCE`: exactly the frontend origin configured by WordPress's corresponding target.

Production fixed copy and settings come from the native content store built at sync; the running site makes no WordPress fallback read for them. The sitemap serializer reads the same production cache (`cacheDir/data-store.json`). Only dev and authorized private preview read WordPress live.

Redirects come from `settings.redirects`. The `404` route is server-rendered (`prerender = false`) for aliases: a matching alias issues a 301 for GET/HEAD and 308 for other methods. Canonical marketing pages stay static, except `/contact`, which is server-rendered for its query/referrer-aware suggestions; private preview is also server-rendered and is not canonical. No full production build was run, so the Node 301/308 behavior in production is **unverified**.

Public pages are static, but `/api/preview`, `/preview/[...path]` and `/api/cms-media/[...path]` require the Node runtime. A static-files-only deployment is insufficient. Remote authenticated WordPress calls require HTTPS. Keep these variables server-only, without `PUBLIC_` prefixes.

## Publish flow and completion reporting
1. A published record/meta change, publication transition (including scheduled fixed-page publication) or attachment change creates a deployment ID (**queued**) and schedules `bdk_dispatch_deployment` after a 30-second debounce.
2. The scheduler dispatches (**dispatched**) a JSON POST with `event: content.changed`, `site` and `at`, plus an `X-BDK-Deployment-ID` header; an optional token is sent as `Authorization: Bearer ...`. Invalid configured URLs fail without dispatch.
3. Network/non-2xx failure requeues at 60 then 120 seconds and is **failed** after three attempts. HTTP 2xx (for example 202) only means the request was accepted; the state stays **dispatched**.
4. The deployment system must carry the ID through the build and report back:

```http
POST https://<cms-origin>/wp-json/bdk/v1/deployment-status
Authorization: Bearer <BDK_DEPLOY_CALLBACK_SECRET>
Content-Type: application/json

{"deploymentId":"<ID>","state":"building","message":"optional, at most 500 bytes"}
```

   Send `building`, then `live` or `failed`. Send `live` only after the new build is actually serving traffic, not when compilation succeeds. A callback for a superseded or unknown ID returns 409 and is safe to ignore; a message over 500 bytes (not characters) or an otherwise invalid payload returns 400.

**Unwired prerequisite:** this repository does not include the sender. Native Dokploy does not call the callback on its own, so a real hosting adapter (a CI step or hook script that reads `X-BDK-Deployment-ID`) must be built. Until then, status stops at **dispatched** and editors never see completion.

Overlapping deployments must serialize or supersede: the adapter should build the newest content, skip or cancel older queued runs, and never activate an older build after a newer one. WordPress rejects a stale `live` report with 409 but cannot undo what the host already served. Editors view status and retry (the editor screen offers the button only for `failed`, while the backend also accepts retry from dispatched, building or not configured; `GET /wp-json/bdk/v1/deployment-status`, `POST /wp-json/bdk/v1/deployment-retry`) only with WordPress login, capability and REST nonce.

Backup, restore and retention of `wp_db`, `wp_core` and uploads are the operator's responsibility; no production restore is verified. Keep the hook token, callback secret and preview secret in protected server configuration. Preview does not enqueue publication.

**Not specified:** lead destination, analytics provider and campaign requirements. Automated lead delivery, measurement and campaign templates are not delivered.

Short operations checklist (none verified in production): restore a backup of `wp_db`, `wp_core` and uploads; wire the real hook and completion callbacks; exercise redirects (301/308, unknown 404) on the production runtime.

After separately authorized deployment, probe `/wp-json/` on WordPress and representative public frontend routes; verify a real upload through `/api/cms-media/<upload-path>`, valid/invalid snapshot behavior and the host's completed deployment status, including a callback-driven **live** state. Do not use nonexistent CMS health/rebuild endpoints. TLS, the scheduler, the completion-callback adapter, production secrets/origins and the real deployment hook remain deployment prerequisites, not completed local work.
