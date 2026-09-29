# Headless WordPress: implementation and readiness

## Implemented architecture
WordPress in `apps/wp-cms` is the editing origin; Astro remains the static public frontend. This replaces the former CMS direction rather than introducing a public WordPress theme. The npm workspaces are:

- `apps/wp-cms`: Docker WordPress/PHP and MariaDB, local WordPress port 8080.
- `packages/content`: shared Zod schemas, server-only REST client, editorial JSON definitions, canonical routes and HMAC preview verifier.
- `apps/bdkinc`: current public design on 4321, static pages with Node preview/media endpoints.
- `apps/design-editorial` and `apps/design-systems`: temporary independent light/dark review frontends on 4322/4323. Both consume the same content/routes, use noindex and canonicalize to the main site.

Consult workspace manifests and the lockfile for Astro/adapter versions, and root `package.json` `engines` for Node/npm support. Use the normal root development scripts documented in [Development Workflow](../../guides/agents/workflow.md). Preserve branding and selective hydration. Full builds still require explicit user instruction.

## Content and migration contract
`packages/content/src/schemas.ts` is the collection-schema source of truth; `apps/bdkinc/src/content.config.ts` imports those schemas for WordPress loaders. Page/settings definitions and migration defaults live in `packages/content/editorial/data/`. Clients validate published data and fail on missing/invalid content; there is no local-source switch or runtime fixture fallback.

Migrated inventory:

- **74 collection records:** 9 services, 4 blog posts, 12 locations, 5 testimonials, 6 partners, 25 pSEO services and 13 pSEO industries.
- **21 marketing page catalogs plus site settings:** includes shared generated-page copy, not 21 additional fixed routes.
- **587 canonical paths preserved:** 19 fixed, 4 blog, 408 service/location and 156 industry/location.

Retain original local content as migration input. `apps/wp-cms/migrations/location-reference.json` preserves all 40 historical geographic records; 28 are reference-only and are neither imported nor activated because only 12 locations generated routes. Historical facts are preserved, not supplemented with invented population or geography data.

Default seeding skips existing records, including trashed slugs. The explicit `--add-missing-fields` mode recursively adds absent fields while preserving existing values. It is not a replacement/reset operation. See [setup and seed commands](../../apps/wp-cms/README.md).

## Authoring boundary
Marketers use real labeled fixed copy/media fields and the native WordPress media chooser. Developers retain section structure, icons, placement/order, routes and layouts. Blog bodies use limited safe Gutenberg prose. There is no JSON editor, page builder or ACF Pro requirement; ACF Free remains scaffold compatibility, not the authoring model.

The main site's existing ContactChat remains simulated. This migration does not add lead delivery. Review designs use real direct contact links without establishing a submission backend.

## Preview and publication
**Preview current copy** captures current form values without publishing or updating the published parent. An immutable snapshot expires after 15 minutes. Its HMAC grant binds entity, snapshot, editor, path, audience and expiry; server-only credentials retrieve the exact snapshot. Private routes validate it before overlaying only that record onto published siblings. Responses use private/no-store, noindex and no-referrer. New blog records need a saved draft identity before preview.

WordPress target origins are `FRONTEND_URL`, `BDK_PREVIEW_EDITORIAL_URL` and `BDK_PREVIEW_SYSTEMS_URL`. Each frontend uses matching `BDK_PREVIEW_AUDIENCE`, `BDK_PREVIEW_SECRET` and authorized server preview credentials. See [preview configuration](../../apps/wp-cms/README.md). Review apps have private SSR preview routes while public pages remain static.

WordPress upload URLs map to real `/api/cms-media/<upload-path>` endpoints, not host-stripped paths without backing storage. Proxies fetch the configured uploads subtree without forwarding credentials; uploads retain WordPress's public-media policy. See [media contracts](../../packages/content/README.md).

Publication queues a debounced outbound host/CI hook through WP cron. Network/non-2xx failures are recorded and retried; a 2xx means **dispatch accepted (deployment pending)**, not deployment success. Public static output changes only after a successful rebuild and deployment. There is no extra generic receiver stub to provision in the Astro app.

## Gates and remaining production work
The following is a historical implementation verification record, not a runtime-selection recommendation or current validation.

Final Linux Node 24 verification passed shared-content TypeScript and all three Astro checks: **111 main-site files, 17 Editorial files and 23 Systems files, with zero errors/warnings/hints**. Root lint passed with zero errors and one pre-existing accessibility warning in the unchanged `TestimonialsCarousel.tsx`. Five authoring-plugin PHP syntax checks and Git diff checks passed. Earlier Windows native checker/linter failures did not reproduce in Linux; their underlying cause is unproven.

Real Editor workflows verified new saved drafts with unsaved-copy previews on all three frontends, public draft exclusion, working relative internal links, stable published slugs across unpublishing, and unique first-publication slugs. Desktop/mobile, media and local webhook-dispatch checks also passed. After owned probe cleanup, the inventory remained 74 collection records, 21 catalogs, site settings and 587 routes. These are local gates, not a build/deployment certificate.

**No full build or production deployment has been verified or authorized.** Production still requires:

1. User-supplied `BDK_DEPLOY_HOOK_URL` and optional Bearer `BDK_DEPLOY_HOOK_TOKEN`, with a real host/CI rebuild-and-deploy action.
2. Functioning WP cron, TLS and reachable published WordPress content for build workers.
3. Main Docker build argument `WORDPRESS_URL`, plus runtime WordPress URL, preview credentials, shared secret and matching audience.
4. Persistent database/core/uploads and the shared editorial mount, plus deliberate production origin configuration. Temporary review targets may be omitted.
5. A separately authorized build/deploy and post-deployment verification; webhook acceptance alone cannot close this gate.

Production provisioning, media offload and public WordPress theme development are not implemented here. Fixed marketing-page CMS copy and marketer setup documentation are implemented scope, not deferred work. Read [deployment configuration](../../guides/deployment/dokploy-traefik.md), [WordPress authoring](../../apps/wp-cms/README.md) and [shared package contracts](../../packages/content/README.md) for task-specific instructions.
