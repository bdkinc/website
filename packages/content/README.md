# @bdkinc/content

Framework-independent content contracts and a **server-only** WordPress client. No Astro, React, environment loading or source-fixture fallback. `zod/v4` matches Astro 7's schema API; the direct dependency is Zod 4.3.6+. The seven original collection schemas retain their existing field/default/optional semantics, including `pubDate: Date`. They are generated into `src/schemas.ts` from `editorial/collections.json` (see below); `apps/bdkinc/src/content.config.ts` imports them for WordPress loaders. All three frontend workspaces consume this package.

## Consumer API

```ts
import { createContentClient } from '@bdkinc/content/client';
const content = createContentClient({
  url: serverEnvironment.WORDPRESS_URL,
  username: serverEnvironment.WORDPRESS_USERNAME,
  applicationPassword: serverEnvironment.WORDPRESS_APPLICATION_PASSWORD,
  media: { mode: 'proxy', prefix: '/api/cms-media' },
});
const services = await content.getCollection('services');
const home = await content.getPage('home');
const settings = await content.getSettings();
```

- `getCollection<K extends CollectionName>(name): Promise<ContentEntry<K>[]>`
- `getPage<K extends PageKey>(key): Promise<PageData<K>>`
- `getSettings(): Promise<SiteSettings>`
- `preview.getEntry<K>(collection, wpId): Promise<ContentEntry<K>>`
- `preview.getPage<K>(key): Promise<PageData<K>>`
- `preview.getSnapshot(token)`: fetch the immutable editor snapshot through the authenticated plugin endpoint.
- `preview.mapEntry(collection, snapshot)`, `preview.mapPage(key, snapshot)`, `preview.mapSettings(snapshot)`: validate and normalize that snapshot using the same public schemas/media mapping.
- `normalizeMediaUrl(value): string`

Entries contain `{ id: slug, wpId, data, body? }`. Blog `body` is `{format: 'html', html, originalMarkdown?}`. Render **live sanitized HTML**, not the archival original Markdown. The archive preserves the source body byte-for-byte and is migration-admin-only writable. Retained local Markdown is migration input only, not a runtime fallback; never infer the body format from a string. The plugin sanitizes rendered blog output to safe prose tags/attributes; it deliberately excludes arbitrary layout/style/script markup.

Public methods always request published content **without Authorization**, even when credentials are supplied. Only `preview` sends credentials. The application must protect preview routes itself and use private/no-store responses. Never import this client from a hydrated island or serialize credentials into props. Use `@bdkinc/content/schemas` for browser-safe schema imports. Credentials are never read implicitly. Remote credential use requires HTTPS; local loopback HTTP is allowed. Redirects fail closed. HTTP/schema/missing-singleton errors propagate, never fall back to fixtures. Pagination consumes `X-WP-TotalPages` and rejects duplicate slugs.

Blog queries use `bdk_managed=true` to exclude WordPress's unstructured starter post. This is a plugin-defined, metadata-backed filter, not a slug denylist.

## Render-local reading

```ts
import { createContentReader } from '@bdkinc/content/reader';
const reader = createContentReader({ published: content });
```

Create one reader per render or authorization operation and pass that same instance to metadata, templates and nested server-rendered modules. `ContentSource` supplies `getCollection`, `getPage` and `getSettings`; `ContentReader` exposes those same methods. Collection records allow an optional `wpId` so an app can supply Astro's published store without fabricating WordPress identity.

The reader reuses pending and resolved reads by key, evicts rejected reads for retry, and returns a fresh structured clone to each caller. Sorting a result or mutating its nested data cannot change another caller's value; `Date` values remain dates. Each reader has its own lifetime: no module-global cache, cross-render reuse or global draft state.

`authorizePreview` returns an already-authorized reader. Its selected-record overlay uses the existing client mapper, captures the authorized context, preserves published siblings and replaces only matching slug/defined WordPress identity. Page and settings overlays apply only to their selected target. Reader/context objects stay server-only; hydrate presentation data, not read functions or snapshots.

Domain terms are defined in [CONTEXT.md](../../CONTEXT.md).

## Fixed editorial definitions

`editorial/data/` contains 21 page catalogs plus site settings. Each JSON file defines one fixed page/template copy catalog or singleton settings record:

- `key`: stable route identity, `kind`: `page` or `settings`, `title`: editor label.
- `fields`: named scalar fields or nested `group` objects, each with `type` and `label`.
- `defaults`: actual migration copy with precisely the same shape.
- Supported controls: `text`, `textarea`, `url`, `media`, `number`, `boolean`, `date`, `strings` (tags/counties), `select` with `choices`, and `group` with `fields`.
- `locked: true` is for developer-owned fields, never exposed as marketer controls. Do not create layout/icon/section/order controls.

Add a JSON import and keyed entry in `editorial/data/index.ts` for each page. `PageKey`/`PageData<K>` are derived from that registry's default shapes, with schema/default agreement checked on module import. PHP discovers these same JSON files from its read-only mount; **no PHP changes needed per page**. `settings.json` supplies `SiteSettings`. Use stable named groups for cards/metrics/milestones, not reorderable arrays. The only list control is a list of plain strings for actual content metadata; it is not a page-builder primitive. Collection definitions live separately in `editorial/collections.json`, described next.

Run the CMS seeder to create new records. Existing records are untouched by default. When adding new keys to existing page definitions, explicitly run:

```sh
npm run wp:seed -w apps/wp-cms -- --add-missing-fields
```

This adds only absent keys recursively, preserving all existing values, including empty text, false booleans and draft-only fields. The seeder POSTs `bdk_missing_fields` candidates (fixed defaults plus retained migration data) as an administrator; the server computes missing fields separately for the live copy and any existing working or scheduled snapshot, never creates a draft or schedule, fills live immediately with a revision and deployment when changed, and backfills the snapshots so a later publish cannot drop new required schema. A rerun with nothing missing is a no-op. Removing/renaming fields requires a deliberate migration, not a silent replacement. No destructive replacement mode is provided. Keep original local source files.

## Collections: one source, generated schemas

`editorial/collections.json` is the single definition of the seven collections: post type, REST endpoint and per-field `type`, `label`, `optional`, `default`, `choices` and `locked`. Do not hand-edit `src/schemas.ts`; it is generated static Zod and TypeScript types. After changing the JSON:

```sh
npm run generate:collections -w packages/content
npm run check:collections -w packages/content   # fails on drift
```

`exercise:collections` additionally parses every retained local record against the generated schemas. Existing WordPress content adopts a new field only through the explicit `--add-missing-fields` migration above; it is missing-only and never overwrites values.

Some definitions carry `creationDefaults` (for example `icon` and `order` for services). The WordPress plugin (`editorial.php`) applies them missing-only when a record has no copy yet, never overwriting submitted or existing values, alongside required/optional/default validation of the effective object before insert; the exercise script reads them too.

## SEO and redirects
`editorial/seo.json` is the canonical editorial SEO definition: optional `title`, `description`, `image`, `imageAlt` and `noindex`. Existing fixed-page SEO/metadata rules win. Blog, services, pSEO and locations expose it as optional groups; there is no canonical override.

`getRouteSeo` resolves per route. Fixed pages are isolated. Blog records use their own overrides. Generated routes use the first non-empty value in the priority order location, then record, then recipe (a merge in which later layers overwrite earlier ones), and `noindex` is true if any layer sets it. Generated defaults and interpolation are retained. The layout lets CMS values override title, description, Open Graph/Twitter fields, image and alt text; article image and contextual alt defaults survive when no override exists.

Sitemap `serialize` reads the same production native `cacheDir/data-store.json`, decoded with Astro's installed devalue codec after sync, not dev-mode content. A `noindex` URL is left out of the sitemap without removing the page.

`settings.redirects?: string[]` holds entries such as `"/old-path -> /new-path"`, with no default and no migration writes. `parseRedirects` validates the entire list: internal targets only, no duplicates, self-redirects, loops, private/reserved paths, sources colliding with a canonical route, or dangling terminals. Direct targets are normalized. The TypeScript parser and the app's unknown-404 consumer (`apps/bdkinc/src/pages/404.astro`) are implemented. The WordPress PHP guards mirror the parser on save and before publish, schedule and revision restore. Production runtime behavior is unverified.

## Media route contract

Default private/local media mapping is:

`<WORDPRESS_URL>/wp-content/uploads/<path>` -> `/api/cms-media/<path>`

Astro implements this as a non-prerendered route. It only reads the configured uploads base, rejects traversal/encoded second decoding, forbids redirects, sends no credentials, and forwards content/range/validator headers with nosniff and short public caching. It preserves WordPress core's public-upload policy; it is not private draft-media storage. Do not enable arbitrary active uploads in WordPress. App-owned paths such as `/logos/partners/ibm.svg` are unchanged.

For an actually public upload host use `media: {mode:'public', origin:'https://cms-assets.example.com'}`. That origin must serve `/wp-content/uploads/`; a hostname rewrite alone does not upload files or provision storage. The mapper also rewrites matching upload URLs inside live HTML.

## Integration ownership

The app dependency is installed. `npm run check -w packages/content` is a slice-local type check, not a site build.

## Astro runtime seam

`apps/bdkinc/src/lib/content.ts` exports `ContentProps` (`reader?`, `contentContext?`, `publicPath?`) and `createAppContentReader(context?)`. A page root uses its supplied reader or creates one scope, then passes it to Layout, Footer and content-reading helpers. Nested consumers require that reader rather than silently creating another. Helpers retain navigation, blog and geographic transformations; direct copy/settings/collection reads use the reader interface.

Absent preview context means published-only. Native Astro loads the 21 `marketingPages` entries and the `siteSettings` singleton as canonically validated content at sync, and production fixed copy and settings are read from that deployed native store with no WordPress fallback. Dev and authorized private preview stay live; `/contact` keeps its SSR query/referrer suggestions. Dev and preview collections read published WordPress live; production public collections use Astro's published store populated by the WordPress loader. No source-default fallback exists. Static path enumeration creates its own published scope and serializes only route/post data, never the reader.

`ContentContext` aliases shared `PreviewContext`: `{mode:'preview', publicPath, target:{kind,key,postId}, snapshot}`. Keep it separate from the reader: its presence controls preview-only rendering, headers and editing UI, not public read reuse. `ContentRecord` preserves slug/data/body; `wpId` is optional for Astro-store entries (live `ContentEntry` always has a real `wpId`). Only presentation fields pass to hydrated React islands.

`lib/preview.ts:resolvePreview` delegates to shared authorization and returns the resolved route, context and warmed reader once. Static imports in `pages/preview/[...path].astro` select fixed pages, blog detail and service/industry-location renderers. `src/routes.ts` maps settings/partners/testimonials to home and generated copy/collection previews to representative published routes. New blog draft identities can resolve a detail preview before publication.

For a new developer-owned route, update `editorial/routes.json`, shared route mapping, WordPress target mapping and each consuming renderer deliberately. Resolve dynamic props before rendering and pass `{reader, contentContext, publicPath, ...props}` in the main app. Do not run imported pages' `getStaticPaths` or use caller-selected module paths. Public route generation remains published-only.

## Routes, review apps and snapshot verification
`@bdkinc/content/routes` exports `getSiteRoutes` and `getPreviewRoute`. Production dynamic paths, both review frontends and preview selection consume the same published inventory. Main services win a main/pSEO slug collision; app renderers translate the shared descriptors into their own props. The migrated canonical inventory is **587 paths**: 19 fixed, 4 blog, 408 service/location and 156 industry/location. The 21 catalogs include generated-template copy; they are not 21 fixed routes. The reference-only geographic archive in `apps/wp-cms/migrations/location-reference.json` does not expand the route set.

`@bdkinc/content/preview` exports `authorizePreview`, `verifyPreviewToken`, `PreviewContext` and `previewHeaders`. Callers supply the server secret, audience and client; the package does not load environment variables. `authorizePreview({ token, path?, secret, audience, client, publishedReader? })` verifies the grant, requested path, snapshot parent, allowed target, mapped published route and complete targeted schema. It returns `{ route, context, reader }`; use the returned route and reader rather than reconstructing the inventory or overlay policy. If `path` is omitted, the signed grant path is used. A supplied published source is scoped through the same reader mechanism, so inventory acquisition can be reused by rendering.

The 15-minute HMAC grant binds entity/snapshot/editor/path/audience/expiry. WordPress additionally enforces the immutable stored grant and editor capability when retrieving the snapshot. Preview captures current form values (for fixed pages and settings, layered on the saved working draft) without publishing; only that snapshot overlays published siblings. Public reads never see working drafts or scheduled snapshots: those become public only after explicit publish or the scheduled time. Apps own environment access, redirects, renderers and private/no-store, noindex and no-referrer responses.

The two temporary review apps use independent templates and server-only clients rather than importing production page renderers. Their public pages are static and noindex, with main-site canonicals; private previews and real upload proxies use the Node adapter. Media endpoint details differ by app: the review proxies serve allowed image content, while the main proxy also forwards supported range/validator headers. All use the configured uploads origin, not arbitrary URL proxying.

See [WordPress authoring and audience configuration](../../apps/wp-cms/README.md) and [production prerequisites](../../guides/deployment/dokploy-traefik.md). A publish hook requests an external rebuild; only the authenticated completion callback described in the deployment guide marks it live.