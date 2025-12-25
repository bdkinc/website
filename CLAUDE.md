# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BDKinc website - A modern, technical-themed marketing site built with Astro 5, React 19, and Tailwind CSS 4. The site uses Astro's islands architecture where React components are selectively hydrated for interactivity while most content remains static HTML.

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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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

### React Components in Astro Files

When using React components (like Phosphor icons) **inside Astro files**, always use `className` instead of `class`, even though `.astro` files allow `class` for HTML elements:

```typescript
// CORRECT: React components use className
import { PiCode, PiShieldCheck, PiLock } from 'react-icons/pi'

<PiCode className="w-16 h-16 text-primary" />
<PiShieldCheck className="w-8 h-8 text-primary" />
<PiLock className="w-5 h-5 text-primary mt-1 shrink-0" />

// WRONG: Do not use class with React components
<PiCode class="w-16 h-16 text-primary" />  // ❌ Won't work properly
```

This is because React expects the `className` prop regardless of the file format. Using `class` in Astro files will not properly apply styles to React components.

## Key Dependencies

- **react-bits** - Animation library (installed but not yet used extensively)
- **react-icons/pi** - Phosphor icon library used throughout (Standardized)
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

## Services Management

Services are maintained in **two locations** that must stay synchronized:

### 1. Content Collection (`src/content/services/`)

Each service has a JSON data file (e.g., `src/content/services/application-development.json`):

```json
{
  "title": "Custom Application Development",
  "description": "Enterprise-grade custom applications built for your business",
  "icon": "Code2",
  "order": 1
}
```

- **Required fields**: `title`, `description`, `icon`, `order`
- `icon` must be a valid lucide-react icon name
- `order` controls the display sequence in navigation and service listings

### 2. Page Files (`src/pages/services/`)

Each service has a dedicated Astro page (e.g., `src/pages/services/application-development.astro`):

- Fetches service data via `getEntry('services', 'service-slug')`
- Returns 404 if service entry doesn't exist (required for type safety)
- Contains full service content, features, and marketing copy

### Adding a New Service

When adding a new service, **always do both**:

1. Create `src/content/services/[slug].json` with required fields
2. Create `src/pages/services/[slug].astro` page file
3. Ensure the slug matches exactly in both locations
4. Run `npm run build` to verify both files are recognized
5. Update navigation if the service should appear in menus

### Updating an Existing Service

- **Data changes** (title, description, icon, order): Update `src/content/services/[slug].json`
- **Content/layout changes** (features, sections, copy): Update `src/pages/services/[slug].astro`
- Both files can be edited independently, but always verify with `npm run build` after changes

### Type Safety

Service pages include a null check on the `getEntry()` result:

```typescript
const service = await getEntry('services', 'service-slug');
if (!service) {
  return new Response(null, { status: 404 });
}
```

This ensures TypeScript recognizes `service.data` as defined and prevents runtime errors.

## Current Design Patterns (Home Page)

The home page (`src/pages/index.astro`) implements a refined hi-tech aesthetic with the following key patterns:

### Interactive Effects

1. **Particle Network (Hero Section)**
   - Canvas-based particle system with 60 interconnected nodes
   - Mouse repulsion effect (particles move away from cursor)
   - Brand-colored particles (cyan, purple, orange)
   - Always checks `prefers-reduced-motion`
   - Implementation: `src/components/Hero.tsx`

2. **Mouse-Tracking Spotlight (Service Cards)**
   - Radial gradient follows cursor across card surface
   - Glassmorphism with `backdrop-blur-xl` and `bg-card/60`
   - Dual-color gradient (cyan → purple → transparent)
   - Implementation: `src/components/Services.tsx`, `src/components/InteractiveServiceCard.tsx`

3. **Pulsing Glow (CTA Buttons)**
   - Subtle breathing animation on primary CTAs
   - 24px maximum glow radius (refined for professionalism)
   - 2-second pulse cycle with `ease-in-out`
   - CSS class: `.pulse-glow` in `global.css`

4. **Tri-Color Gradient Bars**
   - 1px horizontal bars using all three brand colors
   - 50% opacity: `from-primary/50 via-secondary/50 to-[--brand-accent]/50`
   - Used at bottom of Hero, top/bottom of sections

### Design Philosophy

**Balance Guidelines:**

- **Hero Section**: Maximum visual interest (particles + Aurora + circuit overlay + gradients)
- **Content Sections**: Clean backgrounds for readability (NO circuit overlay)
- **Interactive Elements**: Mouse effects on cards only, not entire page
- **Button CTAs**: Pulsing glow for primary actions only
- **Section Breaks**: Tri-color gradient bars for visual rhythm

**Effect Intensity Scale:**

1. Hero Background (Highest) - Multiple layered effects
2. Interactive Cards (Medium) - Mouse-tracking + glassmorphism
3. CTA Buttons (Medium) - Subtle pulsing glow
4. Section Breaks (Low) - Gradient bars
5. Content Areas (Minimal) - Clean, typography-focused

**Anti-Patterns:**

- ❌ Don't apply particle effects to entire page
- ❌ Don't use circuit overlay outside hero sections
- ❌ Don't exceed 30px glow radius on buttons
- ❌ Don't add mouse-tracking to static content
- ❌ Don't create multiple competing animations in same viewport

### Key Component Files

- **Hero**: `src/components/Hero.tsx` - Particle network, pulsing CTA button
- **Services**: `src/components/Services.tsx` - Mouse-tracking spotlight cards (homepage)
- **InteractiveServiceCard**: `src/components/InteractiveServiceCard.tsx` - Reusable card with spotlight
- **WhyChooseUs**: `src/components/WhyChooseUs.tsx` - Gradient bars
- **Footer**: `src/components/Footer.astro` - Purple-focused gradient with tri-color bar
- **CTASection**: `src/components/CTASection.tsx` - Clean background (effects removed per user feedback)

### Performance Considerations

All advanced effects include:

- `prefers-reduced-motion` checks for canvas animations
- `requestAnimationFrame` for smooth 60fps rendering
- Proper cleanup (event listeners, canvas elements)
- `pointer-events-none` on decorative overlays
- GPU-accelerated CSS animations (`transform`, `opacity`)
