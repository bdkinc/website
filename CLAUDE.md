# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BDK Inc website - A modern, technical-themed marketing site built with Astro 5, React 19, and Tailwind CSS 4. The site uses Astro's islands architecture where React components are selectively hydrated for interactivity while most content remains static HTML.

## Development Commands

```bash
# Start development server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Architecture

### Astro Islands Architecture

The project uses Astro's partial hydration model:
- **Static by default**: All `.astro` files render to static HTML
- **Interactive islands**: React components are hydrated using client directives:
  - `client:load` - Hydrates immediately on page load (e.g., Navigation)
  - `client:visible` - Hydrates when component enters viewport (e.g., Services)
  - Use these directives sparingly to maintain performance

### File Organization

- `src/pages/*.astro` - File-based routing (each file = route)
- `src/layouts/Layout.astro` - Base HTML template with SEO meta tags
- `src/components/` - React components (both interactive and presentational)
- `src/components/ui/` - shadcn-style UI components
- `src/lib/utils.ts` - Contains `cn()` utility for Tailwind class merging
- `src/styles/global.css` - Theme system using Tailwind v4 `@theme` directive

### Import Aliases

`@/` is aliased to `./src/` (configured in [astro.config.mjs](astro.config.mjs) and [tsconfig.json](tsconfig.json)):

```typescript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

## Styling System

### Theme Variables

The dark technical theme is defined in [src/styles/global.css](src/styles/global.css) using Tailwind v4's `@theme` block:

- Primary: `#00d4ff` (cyan blue) - accessible via `--color-primary`
- Secondary: `#7c3aed` (purple) - accessible via `--color-secondary`
- Background: `#0a0e27` (dark navy)
- Use CSS variables in Tailwind: `bg-[--color-primary]` or `text-[--color-text-secondary]`

### Utility Classes

- `.glass` - Glassmorphism effect with backdrop blur
- `.gradient-primary` - Primary to secondary gradient
- `.gradient-mesh` - Radial gradient mesh background
- Custom shadows: `shadow-[--shadow-glow]` and `shadow-[--shadow-glow-sm]`

### Component Styling

All UI components use the `cn()` utility for class merging. When styling components:

```typescript
import { cn } from '@/lib/utils'

<div className={cn("base-classes", conditionalClass && "conditional-classes")} />
```

## Key Dependencies

- **react-bits** - Animation library (installed but not yet used extensively)
- **lucide-react** - Icon library used throughout (e.g., Menu, X icons)
- **@radix-ui/react-slot** - Polymorphic component utilities for shadcn UI
- **class-variance-authority** - For component variant management in UI components

## Navigation

Navigation items are defined in [src/components/Navigation.tsx](src/components/Navigation.tsx) in the `navItems` array. To modify routes or add pages, update this array and create corresponding files in `src/pages/`.

## Page Structure

All pages follow this pattern:
1. Import `Layout` from layouts
2. Import `Navigation` component
3. Use `client:load` for Navigation (needs immediate interactivity)
4. Use `client:visible` for below-the-fold React components (lazy hydration)
