# Implementation Plan: Headless WordPress CMS Integration

## Executive Decision & Architecture

BDK adopts headless WordPress as the monorepo CMS backend while retaining the Astro static frontend (`apps/bdkinc`). WordPress serves as the private editing origin—providing Gutenberg editing, media management, draft workflows, scheduled publishing, and role-based access control. Astro remains the public-facing, performance-optimized static frontend.

This strategy deliberately avoids any full WordPress theme development. WordPress outputs structured JSON via the WP REST API; Astro consumes this data at build time and on-demand for previews.

This decision explicitly supersedes and replaces:
- The legacy Payload CMS service (`apps/cms`).
- The abandoned Keystatic integration (`@keystatic/astro`, `@keystatic/core`).

---

## Architectural Invariants

Every phase of implementation must uphold these two non-negotiable rules:

1. **Zod Schema Primacy**: `apps/bdkinc/src/content.config.ts` is the single source of truth for content structure. WordPress loaders must ingest WP REST data, normalize it, and parse it through these exact Zod schemas. WordPress field conventions or REST payload structures must never dictate or distort Astro schema definitions.
2. **Media URL Normalization**: All absolute `WP_HOME` media URLs returned by the REST API must be normalized at load time. If media URLs point to the private WordPress host, Astro loaders must rewrite them to relative paths or CDN assets. Private origin URLs must never leak into public static HTML.

---

## Environment & Constraints

- **Host Environment**: Windows development workstation running Docker Desktop.
- **PHP Isolation**: Zero PHP or WP-CLI installations on the host system. All WordPress runtimes, WP-CLI commands, and database operations execute strictly inside Docker containers.
- **Workflow Protocol**: Fast, iterative development mode. Routine full production builds (`npm run build`) are prohibited during regular verification steps.
- **Keystatic Deprecation**: Complete removal of Keystatic dependencies, configs, and route integrations is directly in-scope for this project, not deferred.
- **Documentation Alignment**: Stale references to Payload (`apps/cms`) across repository guides must be rewritten to reflect the headless WordPress architecture.

---

## Phase 0: Workspace & Scaffolding (`apps/wp-cms`)

### Objectives
Establish the `apps/wp-cms` monorepo workspace package containing container configurations, scripts, and initial WordPress extensions without polluting git with WordPress core binaries or database state.

### Deliverables
1. **Workspace Registration**:
   - Register `apps/wp-cms` in root `package.json` workspaces.
   - Add `apps/wp-cms/package.json` with scripts: `wp:up`, `wp:down`, `wp:cli`, `wp:seed`.
2. **Configuration Files**:
   - `apps/wp-cms/docker-compose.yml`: Multi-container definition.
   - `apps/wp-cms/.env.example`: Environment variable template for database credentials, ports, and auth secrets.
3. **Custom Code Structure**:
   - `apps/wp-cms/wp-content/themes/bdk-headless/`: Minimal fallback theme (`index.php`, `style.css`) returning a 404 or redirecting to the Astro frontend.
   - `apps/wp-cms/wp-content/plugins/bdk-content/`: Custom plugin containing CPT registrations and ACF Local JSON definitions.
   - `apps/wp-cms/wp-content/mu-plugins/bdk-hardening.php`: Security rules and REST API customizations applied automatically.
   - `apps/wp-cms/scripts/`: Operational shell scripts executed inside the CLI container.
4. **Ignore Rules**:
   - Configure `apps/wp-cms/.gitignore` to ignore `.env`, `wp-content/uploads/`, third-party vendor plugins, WordPress core files, and persistent database mount directories.

### Phase 0 Acceptance Criteria
- `docker compose -f apps/wp-cms/docker-compose.yml config` validates without errors.
- `npm ls --workspaces` displays `apps/wp-cms`.

---

## Phase 1: Local Docker Development Stack

### Objectives
Create a reliable, containerized local WordPress and database environment with automated provisioning and deterministic reboots.

### Deliverables
1. **Pinned Docker Images**:
   - WordPress application: `wordpress:6.8-php8.3-apache`.
   - Database: `mariadb:11.4`.
   - Management CLI: `wordpress:cli` (configured to run as the web server user).
   - Database UI: `adminer` assigned to a compose `tools` profile (optional startup).
2. **Persistence**:
   - Dedicated named Docker volumes for database storage (`db_data`) and WordPress content uploads (`wp_uploads`).
   - Bind mounts targeting custom theme, custom plugins, and `mu-plugins` for live host editing.
3. **Automated Initialization (`scripts/init.sh`)**:
   - Run via the CLI container on initial startup.
   - Execute `wp core install` with local parameters.
   - Activate `bdk-headless` theme and `bdk-content` plugin.
   - Install and activate Advanced Custom Fields (ACF).
   - Configure `blog_public=0` to disable search engine indexing out of the box.
   - Provision a dedicated WordPress Application Password for the Astro frontend loader.

### Phase 1 Acceptance Criteria
- `curl http://localhost:8080/wp-json/` returns valid WordPress REST API discovery JSON.
- Content created persists across `docker compose down` and `docker compose up`.

---

## Phase 2: Content Architecture & Schema Synchronization

### Objectives
Mirror existing Astro content collections in WordPress using Custom Post Types (CPTs) and ACF fields, keeping configurations version-controlled in the codebase.

### Deliverables
1. **Custom Post Types**:
   - Register CPTs inside `bdk-content` matching Astro collections:
     - `service`
     - `location`
     - `post` (or standard WP post)
     - `testimonial`
     - `partner`
     - `pseo_service`
     - `pseo_industry`
   - Register shared taxonomies (e.g., categories, tags, service-industry relationships).
   - Ensure all CPTs have `show_in_rest = true` and dedicated REST base routes.
2. **ACF Local JSON**:
   - Configure ACF Local JSON save/load paths inside `apps/wp-cms/wp-content/plugins/bdk-content/acf-json/`.
   - Define custom fields matching every property defined in `apps/bdkinc/src/content.config.ts`.
   - Expose ACF fields directly in REST responses under predictable keys.
3. **Media Seam**:
   - Dev environment stores media on the local volume.
   - Document the cloud offload interface (e.g., S3/Cloudflare R2 plugin boundary) for future production deployment without code changes.

### Phase 2 Acceptance Criteria
- `/wp-json/wp/v2/` exposes all custom post types.
- REST API response payloads for each CPT match the property keys expected by `apps/bdkinc/src/content.config.ts` 1:1.

---

## Phase 3: Astro Headless Integration

### Objectives
Wire `apps/bdkinc` to fetch and validate WordPress content dynamically, implement a preview mode for draft content, and support content update webhooks.

### Deliverables
1. **Custom Loader Factory (`wpLoader`)**:
   - Implement `wpLoader({ endpoint, postType, mapItem })` for Astro content collections.
   - Authenticate REST requests using the generated Application Password.
   - Normalize media URLs: strip `WP_HOME` hostnames from image sources.
   - Validate parsed data using existing collection Zod schemas via `parseData`.
2. **Data Source Switch**:
   - Introduce `CONTENT_SOURCE=local|wp` environment flag in `apps/bdkinc/.env`.
   - When set to `local`, Astro reads local markdown/JSON files; when set to `wp`, Astro executes `wpLoader()`.
3. **Draft Preview Route**:
   - Leverage the existing `@astrojs/node` SSR adapter in `apps/bdkinc`.
   - Create a preview API route (`/api/preview`) protected by a shared secret token (`PREVIEW_SECRET`).
   - Fetch non-published/draft revisions from WP REST API and render the corresponding page template on-demand.
4. **Publish Webhook**:
   - Register a WordPress action on `transition_post_status` inside `bdk-content` or `bdk-hardening`.
   - Send an HMAC-signed POST request on post publish, update, or unpublish.
   - Debounce rapid sequential triggers.
   - Provide a hosting-agnostic receiver contract specification and local stub.
5. **Gutenberg Typography Allowlist**:
   - Define `.wp-content` styles in Tailwind CSS using `@tailwindcss/typography`.
   - Configure allowlist classes to sanitize and cleanly style raw Gutenberg HTML output without breaking site design.

### Phase 3 Acceptance Criteria
- `npx astro check` passes with zero type errors.
- Pages built using `CONTENT_SOURCE=wp` render visual output identical to local content source builds.
- Preview route responds with `401 Unauthorized` without token, and `200 OK` with valid token and draft content.
- WordPress post status transitions fire the outbound signed webhook payload.

---

## Phase 4: Migration & Keystatic Removal

### Objectives
Migrate all static content files into WordPress, verify routing equivalence, and completely remove Keystatic from the project.

### Deliverables
1. **Node Content Seeder (`scripts/seed.ts`)**:
   - Read local JSON and Markdown files from `apps/bdkinc/src/content/`.
   - Ingest records into WordPress via REST API with application credentials.
   - Retain exact slug strings, dates, taxonomy assignments, and nested object fields.
2. **URL Audit**:
   - Verify 1:1 slug matching between existing Astro routes and WP-sourced routes.
   - Assert zero route differences or 404 regressions.
3. **Keystatic Cleanup**:
   - Uninstall `@keystatic/astro` and `@keystatic/core` from `apps/bdkinc`.
   - Delete `apps/bdkinc/keystatic.config.tsx`.
   - Remove Keystatic integration routes and middleware from `apps/bdkinc/astro.config.mjs`.
4. **Documentation & Guide Updates**:
   - Update `AGENTS.md` and `guides/agents/*` to remove references to Payload (`apps/cms`) and Keystatic.
   - Document WordPress headless setup, credentials, and local workflow commands.
5. **Content Pruning**:
   - Compare item counts across every collection between local files and WordPress REST endpoints.
   - Delete local content directories (`apps/bdkinc/src/content/*`) only after exact counts and content integrity are verified.

### Phase 4 Acceptance Criteria
- `npx astro check` passes cleanly after Keystatic removal.
- `grep -ri "keystatic"` returns zero active references across `apps/bdkinc`.
- Total post counts across all collections match 1:1 between migrated WordPress instances and prior local datasets.

---

## Phase 5: Security Baseline & Production Hardening

### Objectives
Secure the WordPress instance as an isolated, private origin invisible to search indexing and resistant to automated web attacks.

### Deliverables
1. **Filesystem & Core Protection**:
   - Define `DISALLOW_FILE_EDIT = true` in WordPress configuration.
   - Completely disable XML-RPC (`xmlrpc.php`).
   - Enforce automatic minor core and security updates.
2. **REST API & User Lockdown**:
   - Disable unauthenticated user enumeration endpoints (`/wp-json/wp/v2/users`).
   - Require authentication headers for sensitive REST endpoints while leaving read-only content endpoints accessible to the loader.
3. **Search Engine Blocking**:
   - Emit `X-Robots-Tag: noindex, nofollow, noarchive` HTTP headers across all WordPress responses via `mu-plugins/bdk-hardening.php`.
   - Keep `blog_public = 0` in WordPress settings.
4. **Surface Area Reduction**:
   - Keep plugins restricted exclusively to required dependencies: Advanced Custom Fields (ACF) and internal custom plugins (`bdk-content`, `bdk-hardening`).
   - Prohibit installation of superfluous administrative or styling plugins.

---

## Out of Scope

The following items are outside the scope of this implementation plan:
- Production hosting provisioning and cloud infrastructure setup.
- Production SSL/TLS certificate configuration and reverse proxy edge rules.
- Production object storage / media offload implementation (e.g., S3/R2 plugin setup).
- Production webhook listener deployment on hosting platforms.
- Public WordPress theme development or custom front-end styling inside WordPress.
- Refactoring static marketing pages (e.g., `index.astro`, `about.astro`) into dynamic CMS-driven pages.
- Non-technical documentation or marketer end-user onboarding materials.
