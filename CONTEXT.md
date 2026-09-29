# Domain vocabulary

## Published content

- **Fixed editorial copy:** named copy/media fields for a developer-owned page or template. Editors change values; developers own layout, icons, ordering and routes.
- **Collection entry:** a record such as a service, location or blog post. Its slug is route identity; its WordPress ID identifies the stored record. Astro's published store may retain only slug identity.
- **Published route inventory:** the canonical paths derived from fixed routes and published entries. Main services take precedence over pSEO services with the same slug. A draft blog preview does not add a public route.

## Preview

- **Preview grant:** a short-lived signed authorization binding a snapshot, editor, record, path, audience and expiry.
- **Preview snapshot:** immutable captured editor values, separate from publication. WordPress validates the stored grant and editor; the frontend validates the grant, record identity, mapped route and content shape before rendering.
- **Selected-record overlay:** the authorized snapshot replaces only its matching record or singleton; other content remains published.
- **Content reader:** the server-only read interface owned by one render or authorization operation. It reuses pending/resolved reads within that scope and returns independent values to callers. Separate renders and snapshots do not share its cache.

See [shared content contracts](packages/content/README.md) for implementation details and [WordPress authoring](apps/wp-cms/README.md) for the editing workflow.

## Site interaction

- **Theme preference:** the current light/dark choice, initialized before paint from saved preference or system preference and observed by both navigation controls.
- **Contact conversation:** the shared text-only simulated interaction. Typed messages and suggestions use the same submission lifecycle. It does not deliver leads or contact a real responder.
