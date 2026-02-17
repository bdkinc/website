# Development Workflow

## Build Protocol
**DO NOT** run `npm run build` unless explicitly instructed.
Trust the linter and type-checker for incremental changes.

## Common Tasks

### Adding a New Page
1. Create `src/pages/pagename.astro`.
2. Wrap content in `<Layout>`.
3. Add `title` prop.

### Adding a New UI Component
1. Create `src/components/ui/name.tsx`.
2. Follow strict ShadCN pattern (forwardRef, cva, cn).
3. Ensure dark-mode compatibility.

If the component already exists in ShadCN, prefer adding it via the ShadCN registry (agents can also use the ShadCN MCP server for lookups):
- `npx shadcn@latest add @shadcn/<component>`

### Adding Interactivity
1. Create isolated component in `src/components/`.
2. Keep state local to the component.
3. Import in `.astro` file with `client:visible` (default preference).

For interactive behaviors (accordion, dialog, dropdown, select, etc.), prefer ShadCN UI (Radix-backed) components for a11y.

## Performance Checklist
- [ ] Directives are as lazy as possible (`client:visible` preferred).
- [ ] No unnecessary JavaScript sent to client.
- [ ] CSS variables used for coloring (for theme switching).
- [ ] Zero `class` usage on React components in Astro files.
