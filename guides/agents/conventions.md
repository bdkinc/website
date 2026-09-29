# Code Conventions

This guide focuses on the Astro marketing site in `apps/bdkinc`.
The CMS in `apps/wp-cms` is containerized WordPress/PHP. The temporary review apps have independent Astro templates. Shared content contracts belong in `packages/content`, not duplicated app schemas.

## Directory Structure
- `src/components/ui/` -> Reusable atomic UI (shadcn)
- `src/layouts/` -> Astro layouts
- `src/pages/` -> Route handling
- `src/lib/` -> Utilities and constants

## Content ownership
- `packages/content/src/schemas.ts` owns collection Zod schemas; `apps/bdkinc/src/content.config.ts` binds them to WordPress loaders.
- `packages/content/editorial/data/` owns fixed labeled page/settings definitions and migration defaults. `editorial/collections.json` defines collection editor fields; `editorial/routes.json` and `src/routes.ts` define canonical route mapping.
- Treat defaults and retained `apps/bdkinc/src/content/` files as migration input, never runtime fallback. Preserve originals and `apps/wp-cms/migrations/location-reference.json`.
- Keep the WordPress client, credentials and preview contexts server-only. Hydrated components receive presentation data only.
- Marketing owns copy/media; developers own structure, icons, order, routes and layouts. Schema additions must preserve existing edits; see [content migrations](../../packages/content/README.md).

## File Naming
- **React Components:** PascalCase (`Hero.tsx`, `Services.tsx`)
- **Astro Components:** PascalCase (`Layout.astro`, `Footer.astro`)
- **Pages:** lowercase (`index.astro`, `services.astro`)

## Import Paths
**ALWAYS** use the `@/` alias for src imports:
```tsx
import { Button } from '@/components/ui/button'; // ✅
import { Button } from '../components/ui/button'; // ❌
```

## TypeScript
**Props:** Prefer `interface` over `type`.
```tsx
export interface HeroProps { src: string; }
```

**Astro Props:** Always type props in frontmatter.
```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---
```

**Strictness:** No `any` without justification.
