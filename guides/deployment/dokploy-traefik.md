# Dokploy + Traefik deployment configuration

This is a configuration guide, **not evidence of a production deployment**. Full builds and deployments require explicit authorization. Local implementation/readiness is tracked in [the CMS implementation record](../../docs/plan/wordpress-headless-cms.md).

## Services and routing
- WordPress uses `apps/wp-cms/docker-compose.yml`, not a custom CMS Dockerfile. Its `wordpress` container listens on **80**; local Compose binds it to `127.0.0.1:8080`. Route the production CMS TLS hostname to container port 80 using the deployment's Traefik network configuration.
- The main Astro site uses `apps/bdkinc/Dockerfile` with **repository root** as build context. Its Node server listens on **4321**. Route the public TLS hostname to that port.
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

The repository does not configure a production deployment hook. Do not publish credentials, preview links or ignored local credential files.

## Astro build and runtime environment
The existing Dockerfile uses Node 24 and runs the main workspace build. It requires **`WORDPRESS_URL` as a Docker build argument**, reachable from the build worker. Published content reads are anonymous; preview credentials are not needed for the build.

Set runtime variables from `apps/bdkinc/.env.example`:

- `WORDPRESS_URL`: reachable CMS origin for previews and the upload proxy.
- `WORDPRESS_USERNAME`, `WORDPRESS_APPLICATION_PASSWORD`: authorized Editor-level preview credentials, not migration administrator credentials.
- `BDK_PREVIEW_SECRET`: same secret as WordPress.
- `BDK_PREVIEW_AUDIENCE`: exactly the frontend origin configured by WordPress's corresponding target.

Public pages are static, but `/api/preview`, `/preview/[...path]` and `/api/cms-media/[...path]` require the Node runtime. A static-files-only deployment is insufficient. Remote authenticated WordPress calls require HTTPS. Keep these variables server-only, without `PUBLIC_` prefixes.

## Publish flow and operational checks
1. A published record/meta change, publication transition or attachment change queues `bdk_dispatch_deployment`, debounced for 30 seconds.
2. Working WP cron sends a JSON POST to the configured hook with `event: content.changed`, `site` and `at`; an optional token is sent as `Authorization: Bearer ...`.
3. Network/non-2xx failure is recorded in `bdk_deploy_status` and retried up to three attempts, with retry delays of 60 then 120 seconds. Invalid configured URLs fail without dispatch.
4. A 2xx response records **dispatch accepted (deployment pending)**. Confirm the host's build and deployment separately before expecting changed public static HTML.

Configure a system cron to invoke WordPress cron on quiet/private origins. No Astro rebuild receiver or old CMS operations endpoint is part of this flow. Preview does not enqueue publication.

After separately authorized deployment, probe `/wp-json/` on WordPress and representative public frontend routes; verify a real upload through `/api/cms-media/<upload-path>`, valid/invalid snapshot behavior and the host's completed deployment status. Do not use nonexistent CMS health/rebuild endpoints. TLS, functioning cron, production secrets/origins and the real deployment hook remain deployment prerequisites, not completed local work.
