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

### Adding Interactivity
1. Create isolated component in `src/components/react/`.
2. Keep state local to the component.
3. Import in `.astro` file with `client:visible` (default preference).

## Performance Checklist
- [ ] Directives are as lazy as possible (`client:visible` preferred).
- [ ] No unnecessary JavaScript sent to client.
- [ ] CSS variables used for coloring (for theme switching).
- [ ] Zero `class` usage on React components in Astro files.
