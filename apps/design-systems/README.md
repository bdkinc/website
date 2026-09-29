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

From `apps/design-systems` on Windows:

```sh
node.exe node_modules/astro/bin/astro.mjs dev --host 127.0.0.1 --port 4323
```

The lead-created manifest/scripts/dependency versions are unchanged. Use the **workspace-local** Astro executable (7.1.6); the root-hoisted executable is 7.3.5 in this environment and crashed during the initial request. No build was run.

`.env` is ignored by the repository's `.env` rule. It contains only the copied WordPress server credentials/preview secret and the Systems audience. Never expose it to client props, logs or source control. Required keys: `WORDPRESS_URL`, `WORDPRESS_USERNAME`, `WORDPRESS_APPLICATION_PASSWORD`, `BDK_PREVIEW_SECRET`; audience is explicitly validated as `http://localhost:4323`.

Public pages use `getStaticPaths()` and static output. Only preview and CMS media endpoints opt into Node SSR. Publishing the static review output would require an explicitly authorized build/deployment; neither was performed.

## Validation performed

- Shared manifest: **587 unique routes** (19 fixed, 4 articles, 408 service/location, 156 industry/location).
- Scoped AstroCheck programmatic `lint({ fileNames })`: **21 owned source files, 0 errors, 0 warnings, 0 hints**. Dependencies were read for resolution; no other workspace diagnostics were run.
- HTTP: **21 distinct public pages returned 200**, spanning every template family and all nine service pages. Both regional pages were rechecked for real city content after correcting state matching from abbreviations to the collection's full names.
- Unknown route returned **404**. Invalid `/api/preview` and `/preview/` tokens returned **401**.
- **Three real WP-issued Systems previews**: home hero, nested AI/watsonx foundation-model title, and settings footer tagline. All showed snapshot edits, retained public canonical URLs, and sent private/no-store, noindex and no-referrer headers. Published HTML stayed unchanged. All three wrong-path requests returned 401. No published editorial values were modified.
- Temporary real PNG upload: proxy returned **200 image/png**, 68 bytes. Arbitrary-origin syntax, double-encoded traversal and backslash inputs each returned **400**. Only the created probe attachment was deleted afterward.
- All nine service pages: no missing long-form catalog body strings in an HTTP text-content audit (SEO/schema and conditional resources excluded).
- Full legal audit: **94 content fields**, zero missing (44 privacy, 50 terms).
- Formatting succeeded using the native Node executable and Prettier CLI.

Root ESLint is configured for `apps/bdkinc/tsconfig.json`; its first scoped invocation reported four project-configuration errors for Systems TS files. Supplying the Systems project to the existing flat config triggered a native Node segmentation fault (including programmatic FlatESLint). The legacy ESLint API also selected the wrong parser. No code rule failures were established; no lint rules were disabled. Scoped Astro diagnostics above are clean. Three initial unused-import hints were fixed.

A later final AstroCheck rerun also hit the same native segmentation fault twice, after an additive transaction-code badge binding and README edit. The most recent completed checker result remains 21 files / zero diagnostics; it is not a claim that the crashing final run passed. Final HTTP rechecks of home and EDI still returned 200. This environment-level checker instability needs the lead's integrated gate.

No browser interaction or visual proof was attempted. The lead's integrated desktop/mobile visual pass is still required.

## Operations at handoff

- Running: background job `bg_3`, launcher PID **700**, listener PID **13396**, port **4323**.
- Launcher: `node.exe node_modules/astro/bin/astro.mjs dev --host 127.0.0.1 --port 4323`, working directory `apps/design-systems`.
- Earlier jobs exited: `bg_1` (Windows quoted-executable launch failure), `bg_2` (wrong root Astro version, native crash). No lingering processes from those jobs.
- Main site 4321, Editorial 4322 and WordPress 8080 were not stopped or reconfigured.
- No dependency/manifests/lockfile changes, commits, deployment, full build or test files.
