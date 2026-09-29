# Systems — temporary independent review frontend

Black-canvas architecture-led concept, served at **http://127.0.0.1:4323**. WordPress issues Systems previews for **http://localhost:4323**. This is a review application, not a production replacement. All HTML is noindex/nofollow and canonical URLs point to `https://www.bdkinc.com`.

## Design and content

| Before | After |
| --- | --- |
| Manifest-only workspace | Independent Astro shell, masthead, narrow vertical rail, responsive navigation and footer |
| No visual language | Pure-black brand background, existing cyan/purple/amber tokens, Montserrat/Open Sans, open editorial grids, fine rules and large typography |
| No page rendering | Dedicated home, service, article, index, about, contact, legal, regional and generated-location templates |
| No interaction | Native menu/FAQ disclosures, visible focus, skip link, 44px navigation targets, reduced-motion support and restrained press feedback |
| No content integration | Server-only shared WordPress client, all 21 page catalogs, settings and all collection families; no fixture/default fallback |
| No preview/media integration | Request-local authorized snapshot overlay and upload-only public media proxy |

The service renderer recognizes catalog narrative, heading, quote, comparison, specification, lifecycle, FAQ and list structures. It does not flatten arbitrary scalars or print JSON. Service ordering is code-owned. Legal sections retain all current paragraphs, lists and contact links. Articles render the shared package's WordPress-sanitized HTML.

Contact leads with the shared `ContactChat` from `@bdkinc/design-system` (simulated replies, themed through the `.contact-chat` variable map in `site.css`), followed by real direct phone/email/map links; simulated routing promises and operational status are still not displayed. Generated-location pages use global real contact settings instead of the catalogs' placeholder 555 phone numbers. Simulated console/telemetry fields and empty image placeholders are not displayed. Existing non-upload brand asset paths resolve against the canonical public site; actual WP uploads resolve through this app's media proxy. No production/Editorial renderer imports, iframe or page proxy.

## Run

From the repository root, with dependencies already installed:

```sh
npm run dev:systems
npm run check -w @bdkinc/design-systems
```

Reuse an existing listener on port 4323. The root dev script delegates through project-local Vite+ to Astro. Follow [Development Workflow](../../guides/agents/workflow.md) for normal startup, failure diagnosis and background-job ownership. Consult manifests, the lockfile and root `engines` for current dependency/runtime support.

`.env` is ignored by the repository's `.env` rule. It contains only the copied WordPress server credentials/preview secret and the Systems audience. Never expose it to client props, logs or source control. Required keys: `WORDPRESS_URL`, `WORDPRESS_USERNAME`, `WORDPRESS_APPLICATION_PASSWORD`, `BDK_PREVIEW_SECRET`; audience is explicitly validated as `http://localhost:4323`.

Public pages use `getStaticPaths()` and static output. Only preview and CMS media endpoints opt into Node SSR. Publishing the static review output would require an explicitly authorized build/deployment; neither was performed.

## Historical validation record

- Shared manifest: **587 unique routes** (19 fixed, 4 articles, 408 service/location, 156 industry/location).
- Scoped AstroCheck programmatic `lint({ fileNames })`: **21 owned source files, 0 errors, 0 warnings, 0 hints**. Dependencies were read for resolution; no other workspace diagnostics were run.
- HTTP: **21 distinct public pages returned 200**, spanning every template family and all nine service pages. Both regional pages were rechecked for real city content after correcting state matching from abbreviations to the collection's full names.
- Unknown route returned **404**. Invalid `/api/preview` and `/preview/` tokens returned **401**.
- **Three real WP-issued Systems previews**: home hero, nested AI/watsonx foundation-model title, and settings footer tagline. All showed snapshot edits, retained public canonical URLs, and sent private/no-store, noindex and no-referrer headers. Published HTML stayed unchanged. All three wrong-path requests returned 401. No published editorial values were modified.
- Temporary real PNG upload: proxy returned **200 image/png**, 68 bytes. Arbitrary-origin syntax, double-encoded traversal and backslash inputs each returned **400**. Only the created probe attachment was deleted afterward.
- All nine service pages: no missing long-form catalog body strings in an HTTP text-content audit (SEO/schema and conditional resources excluded).
- Full legal audit: **94 content fields**, zero missing (44 privacy, 50 terms).
- Formatting succeeded.

During that implementation, scoped ESLint attempts encountered project-configuration errors and native-process failures; no code rule failures were established and no lint rules were disabled. Three initial unused-import hints were fixed. A later AstroCheck rerun also failed at the native-process level, so the completed 21-file result above does not certify that final rerun. Final HTTP rechecks of home and EDI returned 200.

No browser interaction or visual proof was attempted in that verification. No full build or deployment was performed. These historical outcomes are not current validation or instructions for selecting a different runtime; current checks follow the normal workflow above.
