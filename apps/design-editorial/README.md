# Editorial review concept

Temporary, independently designed BDKinc review frontend. Local review URL: **http://127.0.0.1:4322**. This is not a production deployment.

## Design and content

White canvas, oversized Montserrat typography, Open Sans body text, asymmetric grids, fine rules, and restrained cyan/purple/amber accents. Native links and disclosure elements keep the interface usable without hydrated components. Mobile layouts, visible keyboard focus, a skip link, and reduced-motion styling are included.

All marketing copy comes from the shared WordPress client: page catalogs, published collections, and global settings. There are no production-page imports, iframe wrappers, layout switches, or runtime editorial-default fallbacks. Local brand assets are copied into `public/`; WordPress upload URLs use the same-origin media endpoint.

- `src/pages/[...path].astro` consumes `getSiteRoutes()` from `@bdkinc/content/routes`. Its static paths plus the explicit `404.astro` cover the shared canonical route set (587 at verification).
- `src/components/RouteView.astro` selects this concept's home, service, fixed-page, article, and generated regional templates.
- `CopySection.astro` renders defined editorial structures as narrative, ordered service entries, comparisons, lists, specifications, and FAQs in the surrounding service template—not JSON dumps.
- Legal pages retain their authored prose. Contact leads with the shared `ContactChat` from `@bdkinc/design-system` (simulated replies, same as bdkinc), themed via the `.contact-chat` variable map in `editorial.css`, above the real CMS phone/email/map directory. It does not simulate submissions or notifications.
- All concept pages are noindex/nofollow; `public/robots.txt` disallows crawling. Canonical URLs point to `https://www.bdkinc.com`.

## Local configuration

Use an ignored `.env` with these server-side variables; do not commit or expose their values:

```dotenv
WORDPRESS_URL=http://localhost:8080
WORDPRESS_USERNAME=<authorized WordPress username>
WORDPRESS_APPLICATION_PASSWORD=<application password>
BDK_PREVIEW_SECRET=<shared WordPress preview secret>
BDK_PREVIEW_AUDIENCE=http://localhost:4322
```

The preview audience must match WordPress's configured Editorial target exactly, even when accessing the local app through `127.0.0.1`. Credentials stay in server-only code and are never serialized into browser props.

From the repository root, with dependencies already installed:

```sh
npm run dev -w @bdkinc/design-editorial
npm run check -w @bdkinc/design-editorial
```

Public pages are statically prerendered by default. Publishing changed copy requires a rebuild. The existing `build`, `start`, and `preview` scripts support the Astro/Node workflow, but a build or deployment must be separately authorized; none was performed for this review implementation. Development reads current published WordPress data.

Do not start a second listener if the lead already owns port 4322. On Windows, if a Bash npm shim fails, invoke the installed Windows `node.exe` and npm CLI directly rather than changing dependencies.

## Private previews

In WordPress, select **Editorial concept** and create a preview. `/api/preview?token=…` verifies the signed grant and redirects to `/preview/[...path]`. The outer preview route checks audience, expiry, canonical path, entity identity, target mapping, and record schema before rendering the same concept templates.

`src/lib/content.ts` overlays only the authorized immutable snapshot onto published siblings within that request. There is no global draft cache or draft enumeration. Preview responses send `private, no-store`, `noindex, nofollow`, and `no-referrer`. Links expire according to the shared 15-minute grant contract.

## Media

`/api/cms-media/[...path]` fetches only the configured WordPress `/wp-content/uploads/` subtree. It rejects traversal and malformed paths, does not follow redirects, forwards image content only, and sends `nosniff` plus a restrictive sandbox policy. It does not forward WordPress credentials.

A real temporary PNG attachment was uploaded for acceptance, successfully served byte-for-byte through this endpoint, then permanently deleted. Only the probe attachment was removed; both its attachment endpoint and source file returned 404 afterward.

## Verification record

- Final app-scoped diagnostics: **16 files, 0 errors, 0 warnings, 0 hints** after the renderer refinements.
- The actual catchall static-path function plus explicit `/404` matches the shared manifest exactly: **587 routes, zero missing, zero extra**.
- Representative home/service/blog/legal/contact/regional/generated routes returned HTTP 200; an unknown route returned 404. Four additional HTTP checks confirmed the refined lifecycle, comparison, role-benefit, and regional-copy rendering.
- Three real WordPress-issued Editorial previews (home, nested service copy, settings) displayed private edits while public pages remained unchanged. Wrong audience and wrong path returned 401.
- Desktop/mobile browser evidence is in ignored `review-evidence/`: `desktop-home.png`, `mobile-home.png`, `mobile-service.png`, and `mobile-faq.png`. CTA navigation, native FAQ disclosure, and absence of horizontal overflow were checked. Existing user tabs were preserved.
- Real upload probe: upload HTTP 201; proxy HTTP 200, `image/png`, 68 identical bytes; verified cleanup.
- Earlier native-process failures prevented an optional exhaustive HTTP sweep. They are not an app-code defect demonstrated by the successful final scoped diagnostics. No exhaustive sweep, full build, production deployment, or final integrated browser pass is claimed.
