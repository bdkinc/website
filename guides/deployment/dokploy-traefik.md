# Dokploy + Traefik deployment configuration

This is a configuration guide, **not evidence of a production deployment**. Full builds and deployments require explicit authorization. Local implementation/readiness is tracked in [the CMS implementation record](../../docs/plan/wordpress-headless-cms.md).

## Services and routing
- WordPress uses `apps/wp-cms/docker-compose.yml`, not a custom CMS Dockerfile. Its `wordpress` container listens on **80**; local Compose binds it to `127.0.0.1:8080`. Route the production CMS TLS hostname to container port 80 using the deployment's Traefik network configuration.
- The main Astro site uses `apps/bdkinc/Dockerfile` with **repository root** as build context. Its Node server listens on **4321**. Route the public TLS hostname to that port.
- The Compose `scheduler` service runs WP-CLI due-event processing every 30 seconds (WP's own cron is disabled). Deploy it alongside `wordpress` with the same mounts; deployment dispatch, retries and scheduled publication depend on it.
- Use separate services so a content rebuild does not recreate the database. Preserve `wp_db`, `wp_core`, the uploads bind mount and custom plugin/theme mounts. Both WordPress and CLI need `packages/content/editorial` mounted read-only at `/var/www/bdk-editorial`.
- `apps/design-editorial` (4322) and `apps/design-systems` (4323) are temporary review apps. Each has a root-context Dockerfile for the concept review deployment below; they are not production replacements. `apps/bdkcloud` remains planned.

The checked-in Compose setup is local/loopback-oriented. Production routing, TLS, network access and persistent storage must be configured for the actual host; do not delete original files or volumes to initialize it.

## Concept review deployment
Stakeholder review of all three sites runs on Dokploy behind neutral hostnames:

| Host | App | Port |
|---|---|---|
| `cms.concept.bdkcloud.com` | WordPress (`apps/wp-cms`) | 80 |
| `a.concept.bdkcloud.com` | `apps/bdkinc` | 4321 |
| `b.concept.bdkcloud.com` | `apps/design-editorial` | 4322 |
| `c.concept.bdkcloud.com` | `apps/design-systems` | 4323 |

One DNS record, `*.concept.bdkcloud.com` → the Dokploy host, covers all four; Dokploy issues a Let's Encrypt certificate per hostname. Domains and TLS are configured in the Dokploy UI, which injects the Traefik labels and `dokploy-network` at deploy time. Deploy from `main`.

**CMS (Dokploy Docker Compose)**
- Compose path `./apps/wp-cms/docker-compose.dokploy.yml`. It differs from the local file only in having no host ports, uploads in the named volume `wp_uploads`, `HTTP_HOST` from `CMS_HOSTNAME`, and no `cli`/`adminer`.
- Advanced → Command: take the default command shown and append `--force-recreate`. Dokploy re-clones the repository on every deploy; without recreating, the theme, plugin, mu-plugin and editorial bind mounts point at the deleted clone and come up empty.
- Domain: service `wordpress`, port 80, HTTPS. The WordPress image honours Traefik's `X-Forwarded-Proto`.
- Environment (Dokploy writes it to `.env` beside the Compose file): everything in `apps/wp-cms/.env.example` with new secrets, plus `WP_HOME`/`WP_SITEURL=https://cms.concept.bdkcloud.com`, `CMS_HOSTNAME=cms.concept.bdkcloud.com`, `FRONTEND_URL=https://a.concept.bdkcloud.com` (the "Current site" preview target), `BDK_PREVIEW_EDITORIAL_URL=https://b.concept.bdkcloud.com`, `BDK_PREVIEW_SYSTEMS_URL=https://c.concept.bdkcloud.com`, `WP_ENVIRONMENT_TYPE=staging`, `WP_DEBUG=false`. Leave the deploy hook variables blank: publishing still saves, status reads **not configured**, and the concepts are redeployed manually.

**Frontends (three Dokploy Applications)**
- Build type Dockerfile, build context `.`, Dockerfile `apps/<app>/Dockerfile`, container port from the table. The images set `HOST=0.0.0.0`; the concept Astro configs pin `127.0.0.1` for local dev.
- Build argument `WORDPRESS_URL=https://cms.concept.bdkcloud.com` for all three, plus `BDK_NOINDEX=true` for `apps/bdkinc` (the main site is indexable by default; the flag makes every page `noindex` and `robots.txt` disallow all). Leave `BDK_GA4_ID` unset. The build reads published content and fails if the CMS is unreachable, so the CMS must be restored and live first.
- `apps/bdkinc` trusts forwarded HTTPS only for hosts in `security.allowedDomains`; `a.concept.bdkcloud.com` is listed so `/contact` actions pass Astro's origin check.
- Runtime: `WORDPRESS_URL`, `WORDPRESS_USERNAME` and `WORDPRESS_APPLICATION_PASSWORD` (Editor), `BDK_PREVIEW_SECRET` (same as the CMS), `BDK_PREVIEW_AUDIENCE` (that app's own origin, matching its CMS preview target).
- `design-editorial` and `design-systems` always emit `noindex` and disallow crawling. Dokploy's per-application basic auth is optional if the concepts should not be publicly reachable.

**Restore the local CMS (first deploy only)**
1. Deploy the CMS once so the database, `wp_core` and `wp_uploads` volumes exist.
2. Locally, with the stack up: `npm run wp:cli -w apps/wp-cms -- db export /scripts/.local/concept.sql` (ignored path), and archive `apps/wp-cms/wp-content/uploads`. Copy both to the server.
3. Import into the Compose `db` container (`docker exec -i <db> mariadb -u<MYSQL_USER> -p<MYSQL_PASSWORD> <MYSQL_DATABASE> < concept.sql`). Copy uploads into the volume and give them to `www-data`: `docker run --rm -v <project>_wp_uploads:/dest -v <uploads-dir>:/src alpine sh -c 'cp -a /src/. /dest/ && chown -R 33:33 /dest'`. Use `docker volume ls` for the project prefix.
4. In the `scheduler` container (it has WP-CLI and the same mounts): `wp plugin install advanced-custom-fields --activate`, `wp search-replace http://localhost:8080 https://cms.concept.bdkcloud.com --all-tables`, `wp rewrite flush`.
5. The restored database keeps local logins. Because `wp-admin` is public, reset them (`wp user update <user> --user_pass=...`), revoke local application passwords, and create the concept preview credential with `wp user application-password create <editor> concept-preview --porcelain`.
6. Probe `https://cms.concept.bdkcloud.com/wp-json/`, then deploy the three frontends and open a preview from the editor's target dropdown.

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

Google Analytics 4 and the `/campaigns/it-consultation` template are implemented; see [marketing/SEO setup](../marketing-seo.md) for measurement ID, consent and stream configuration. Autotask CRM integration and automated lead capture are deliberately deferred. The contact page preserves a labeled conversation preview plus real phone/email links; live AI is not connected.

Short operations checklist (none verified in production): restore a backup of `wp_db`, `wp_core` and uploads; wire the real hook and completion callbacks; exercise redirects (301/308, unknown 404) on the production runtime.

After separately authorized deployment, probe `/wp-json/` on WordPress and representative public frontend routes; verify a real upload through `/api/cms-media/<upload-path>`, valid/invalid snapshot behavior and the host's completed deployment status, including a callback-driven **live** state. Do not use nonexistent CMS health/rebuild endpoints. TLS, the scheduler, the completion-callback adapter, production secrets/origins and the real deployment hook remain deployment prerequisites, not completed local work.
