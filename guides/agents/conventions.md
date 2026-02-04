# Code Conventions

## Directory Structure
- `src/components/ui/` -> Reusable atomic UI (shadcn)
- `src/components/react/` -> Interactive React components (stateful)
- `src/layouts/` -> Astro layouts
- `src/pages/` -> Route handling
- `src/lib/` -> Utilities and constants

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
