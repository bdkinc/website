# @bdkinc/content

Framework-independent content contracts and a **server-only** WordPress client. No Astro, React, environment loading or source-fixture fallback. `zod/v4` matches Astro 7's schema API; the direct dependency is Zod 4.3.6+. The seven original collection schemas retain their existing field/default/optional semantics, including `pubDate: Date`. `src/schemas.ts` is their source of truth; `apps/bdkinc/src/content.config.ts` imports them for WordPress loaders. All three frontend workspaces consume this package.

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

## Fixed editorial definitions

`editorial/data/` contains 21 page catalogs plus site settings. Each JSON file defines one fixed page/template copy catalog or singleton settings record:

- `key`: stable route identity, `kind`: `page` or `settings`, `title`: editor label.
- `fields`: named scalar fields or nested `group` objects, each with `type` and `label`.
- `defaults`: actual migration copy with precisely the same shape.
- Supported controls: `text`, `textarea`, `url`, `media`, `number`, `boolean`, `date`, `strings` (tags/counties), `select` with `choices`, and `group` with `fields`.
- `locked: true` is for developer-owned fields, never exposed as marketer controls. Do not create layout/icon/section/order controls.

Add a JSON import and keyed entry in `editorial/data/index.ts` for each page. `PageKey`/`PageData<K>` are derived from that registry's default shapes, with schema/default agreement checked on module import. PHP discovers these same JSON files from its read-only mount; **no PHP changes needed per page**. `settings.json` supplies `SiteSettings`. Use stable named groups for cards/metrics/milestones, not reorderable arrays. The only list control is a list of plain strings for actual content metadata; it is not a page-builder primitive. Collection definitions live separately in `editorial/collections.json`.

Run the CMS seeder to create new records. Existing records are untouched by default. When adding new keys to existing page definitions, explicitly run:

```sh
npm run wp:seed -w apps/wp-cms -- --add-missing-fields
```

This adds only absent keys recursively, preserving all existing values, including empty text and false booleans. Removing/renaming fields requires a deliberate migration, not a silent replacement. No destructive replacement mode is provided. Keep original local source files.

## Media route contract

Default private/local media mapping is:

`<WORDPRESS_URL>/wp-content/uploads/<path>` -> `/api/cms-media/<path>`

Astro implements this as a non-prerendered route. It only reads the configured uploads base, rejects traversal/encoded second decoding, forbids redirects, sends no credentials, and forwards content/range/validator headers with nosniff and short public caching. It preserves WordPress core's public-upload policy; it is not private draft-media storage. Do not enable arbitrary active uploads in WordPress. App-owned paths such as `/logos/partners/ibm.svg` are unchanged.

For an actually public upload host use `media: {mode:'public', origin:'https://cms-assets.example.com'}`. That origin must serve `/wp-content/uploads/`; a hostname rewrite alone does not upload files or provision storage. The mapper also rewrites matching upload URLs inside live HTML.

## Integration ownership

The app dependency is installed. `npm run check -w packages/content` is a slice-local type check, not a site build.

## Astro runtime seam

`apps/bdkinc/src/lib/content.ts` exports `ContentProps` (`contentContext?`, `publicPath?`) and context-last helpers `getContentCollection(name, context?)`, `getContentEntry(name, slug, context?)`, `getPageCopy(key, context?)`, `getSettings(context?)`. Absent context means published-only. Collections use the build-time WP loader; dev reads published WP live for immediate publish verification. Production collections use Astro's published store. Fixed editorial records are read during page render/build. No source-default fallback exists.

`ContentContext` is server-only: `{mode:'preview', publicPath, target:{kind,key,postId}, snapshot}`. Only the authenticated outer route creates it. Collection results overlay only the selected snapshot on published entries. `ContentRecord` preserves slug/data/body; `wpId` is optional for Astro-store entries (the package's live `ContentEntry` always has a real `wpId`). Never hydrate the context; pass only presentation fields to React.

`lib/preview.ts:previewTemplate` plus static imports in `pages/preview/[...path].astro` form the main app's fixed-template registry. It covers fixed pages, blog detail and service/industry-location templates. `src/routes.ts` maps settings/partners/testimonials to home and generated copy/collection previews to representative published routes. New blog draft identities can resolve a detail preview before publication.

For a new developer-owned route, update `editorial/routes.json`, shared route mapping, WordPress target mapping and each consuming renderer deliberately. Resolve dynamic props before rendering and pass `{contentContext, publicPath, ...props}` in the main app. Do not run imported pages' `getStaticPaths` or use caller-selected module paths. Public route generation remains published-only.

## Routes, review apps and snapshot verification
`@bdkinc/content/routes` exports `getSiteRoutes` and `getPreviewRoute`. The migrated canonical inventory is **587 paths**: 19 fixed, 4 blog, 408 service/location and 156 industry/location. The 21 catalogs include generated-template copy; they are not 21 fixed routes. The reference-only geographic archive in `apps/wp-cms/migrations/location-reference.json` does not expand the route set.

`@bdkinc/content/preview` exports `verifyPreviewToken` and `previewHeaders`. Callers supply the server secret and audience; the package does not load environment variables. The 15-minute HMAC grant binds entity/snapshot/editor/path/audience/expiry. Consumers additionally verify snapshot identity and mapped path before rendering. Preview captures current form values without publishing; only that snapshot overlays published siblings, with private/no-store, noindex and no-referrer responses.

The two temporary review apps use independent templates and server-only clients rather than importing production page renderers. Their public pages are static and noindex, with main-site canonicals; private previews and real upload proxies use the Node adapter. Media endpoint details differ by app: the review proxies serve allowed image content, while the main proxy also forwards supported range/validator headers. All use the configured uploads origin, not arbitrary URL proxying.

See [WordPress authoring and audience configuration](../../apps/wp-cms/README.md) and [production prerequisites](../../guides/deployment/dokploy-traefik.md). A publish hook requests an external rebuild; it does not itself prove a deployment completed.