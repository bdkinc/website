# Development Workflow

## Local development

This is an npm workspaces monorepo. Use the Node version in root `engines` (Node 24 recommended) and Docker Desktop for WordPress. PHP/WP-CLI run only in containers.

From the repository root (root scripts delegate through `vp run <workspace>#<script>`; workspace commands themselves stay `astro ...`):

```sh
npm run wp:init -w apps/wp-cms
npm run wp:seed -w apps/wp-cms
npm run dev:site
```

Initialization preserves existing data and writes ignored main-site server configuration. For credentials, review-app configuration and authoring, read [WordPress setup](../../apps/wp-cms/README.md) before running setup. Routine restarts use `npm run wp:up -w apps/wp-cms`; retain volumes and original migration files.

| Frontend                         | Root command            | Local port |
| -------------------------------- | ----------------------- | ---------- |
| Current public design            | `npm run dev:site`      | 4321       |
| Temporary light Editorial review | `npm run dev:editorial` | 4322       |
| Temporary dark Systems review    | `npm run dev:systems`   | 4323       |

WordPress runs on 8080. Check for an existing listener before starting another server. The review apps share published CMS content, not the main app's templates; they are noindex with main-site canonicals, not production replacements. `apps/bdkcloud` remains planned.

## Incremental validation and build protocol

**Do not run full builds (`npm run build`) without explicit user instruction.** Use dev mode, scoped diagnostics and HTTP/browser checks for the changed behavior. Examples of existing workspace checks:

```sh
npm run check -w packages/content
npm run check -w apps/bdkinc
npm run check -w apps/design-editorial
npm run check -w apps/design-systems
```

Coordinate workspace-wide checks after concurrent writers settle. A failed/crashed checker is not a pass. Windows native Node CLI runs have intermittently exited with `3221225477`; a dedicated PowerShell launcher has worked for dev servers, but does not establish a successful checker result. Prefer workspace scripts, which select app-local dependencies.

## Changing content and templates

1. For copy/media, edit the existing labeled WordPress fields. Use **Preview current copy** for an unsaved snapshot, not publication. Publishing requests an external static rebuild only when the deployment hook is configured.
2. For new developer-owned fields, update shared editorial definitions and their registry, then the consuming templates. Read [shared content contracts](../../packages/content/README.md) before running the explicit additive migration. Default seeding skips existing records.
3. For a new page/route, create the Astro template, use its layout/title conventions and update shared route/preview mappings deliberately. Keep published route generation separate from private snapshots.
4. Preserve collection slugs and original migration data. No runtime fallback to local files is supported.

## UI changes

Use `.astro` for static structure and isolated React components for interaction. Follow existing ShadCN primitive conventions and branding, including dark-mode compatibility where applicable. Keep state local and prefer `client:visible` when interaction need not initialize immediately.

- Hydrate only necessary interaction; avoid sending CMS clients or credentials to the browser.
- Use StyleX for React-owned styles and CSS variables for theme colors. Pass `xstyle` tokens to migrated shared/project components; their existing `style` prop remains inline CSS. Keep `className` for Astro callers and explicit legacy/structural interoperability, not new React utility strings.
- Keep the generated `stylex` layer after theme/base/components and before remaining Tailwind utilities (`@layer theme, base, components, stylex, utilities` on the main site). Dark-mode variables must work before hydration. Verify generated CSS as well as React hydration when changing the compiler integration.
- Keep section order, icons and layout in code rather than adding marketer controls.
- Existing ContactChat is simulated; verify real contact links without claiming lead delivery.

For production setup and the distinction between webhook acceptance and completed deployment, read [Dokploy + Traefik](../deployment/dokploy-traefik.md).
