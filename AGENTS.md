# AGENTS.md

Guidelines for AI coding agents (Claude, Cursor, Copilot, etc.) working in this repository.

## Project Context

This is an Astro-based marketing website with selective React hydration. Performance is critical - ship as little JavaScript as possible to the client while maintaining rich interactivity where needed.

## Critical Patterns to Follow

### 1. Astro Islands Hydration Strategy

**Always prefer static HTML over JavaScript hydration.** Only use React components when interactivity is required.

```astro
<!-- ✅ Good: Only hydrate what needs interactivity -->
<Navigation client:load />          <!-- Needs immediate state for mobile menu -->
<Hero client:visible />              <!-- Lazy load when scrolled into view -->

<!-- ❌ Bad: Unnecessary hydration -->
<StaticContent client:load />        <!-- Should be plain Astro/HTML -->
```

**Hydration directive decision tree:**
- `client:load` - Only for above-the-fold interactive components (Navigation)
- `client:visible` - For below-the-fold interactive components (modals, animations)
- `client:idle` - For low-priority interactive components
- No directive - Default for static React components (avoid if possible, use Astro instead)

### 2. Component Creation Guidelines

**When to use `.astro` vs `.tsx`:**
- `.astro` files - For ALL static content, layouts, pages
- `.tsx` files in `components/react/` - Only when you need useState, useEffect, or event handlers
- `.tsx` files in `components/ui/` - Reusable UI primitives (buttons, cards) that may be used in interactive contexts

**Component file naming:**
- React components: PascalCase (e.g., `Hero.tsx`, `Services.tsx`)
- Astro components: PascalCase (e.g., `Layout.astro`, `Footer.astro`)
- Pages: lowercase (e.g., `index.astro`, `services.astro`)

### 3. Styling Patterns

**Always use shadcn semantic color utilities:**

```tsx
// ✅ Good: Use shadcn semantic color classes
<div className="bg-card text-foreground border-border" />
<div className="text-muted-foreground" />

// ✅ Good: Use brand colors for accents
<div className="text-brand-primary" />
<div className="bg-linear-to-r from-brand-primary to-brand-secondary" />

// ❌ Bad: Hardcoded colors
<div className="bg-gray-800 text-white border-gray-700" />
```

**Use the `cn()` utility for all conditional classes:**

```tsx
import { cn } from '@/lib/utils'

// ✅ Good
<div className={cn("base-class", isActive && "active-class", className)} />

// ❌ Bad
<div className={`base-class ${isActive ? "active-class" : ""} ${className}`} />
```

**Leverage existing utility classes from global.css:**
- `.glass` - For glassmorphism effects (nav, modals, cards)
- `.gradient-primary` - Primary to secondary gradient
- `.gradient-mesh` - Radial gradient background overlay
- `shadow-[--shadow-glow]` - Glowing shadow effect for interactive elements

### 4. UI Component Patterns

**shadcn-style component structure:**

All UI components in `components/ui/` follow this pattern:
1. Use `React.forwardRef` for ref forwarding
2. Use `class-variance-authority` (cva) for variant management
3. Export both the component and variants
4. Include the `cn()` utility for className merging

```tsx
// Example from button.tsx
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", outline: "...", ghost: "..." },
    size: { default: "...", sm: "...", lg: "..." }
  },
  defaultVariants: { variant: "default", size: "default" }
})

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean  // Allow polymorphic behavior via Radix Slot
}
```

### 5. Icon Usage

**Use lucide-react for all icons:**

```tsx
import { Server, Shield, Cloud, ArrowRight } from 'lucide-react'

// Icons automatically inherit color and size from parent
<ArrowRight className="w-4 h-4 text-[--color-primary]" />
```

### 6. Animation Patterns

**For simple animations, use inline styles or Tailwind:**

```tsx
// Example from Hero.tsx
<style>{`
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
`}</style>
```

**For complex animations, use react-bits:**
- Installed but not yet extensively used
- Prefer react-bits over heavier libraries like Framer Motion
- Only import what you need to minimize bundle size

### 7. Import Path Rules

**Always use the `@/` alias for src imports:**

```tsx
// ✅ Good
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ❌ Bad
import { Button } from '../components/ui/button'
import { cn } from '../../lib/utils'
```

### 8. TypeScript Patterns

**Prefer interfaces over types for component props:**

```tsx
// ✅ Good
export interface HeroProps {
  title: string
  subtitle?: string
}

// ❌ Avoid
export type HeroProps = { ... }
```

**Always type Astro.props in .astro files:**

```astro
---
interface Props {
  title: string
  description?: string
}

const { title, description = "Default description" } = Astro.props
---
```

## Common Tasks

### Adding a New Page

1. Create `src/pages/pagename.astro`
2. Import and use the Layout component
3. Add Navigation with `client:load`
4. Add the route to `navItems` in `src/components/Navigation.tsx`

```astro
---
import Layout from '@/layouts/Layout.astro'
import Navigation from '@/components/Navigation'
---

<Layout title="Page Title">
  <Navigation client:load />
  <main>
    <!-- Content -->
  </main>
</Layout>
```

### Adding a New UI Component

1. Create in `src/components/ui/componentname.tsx`
2. Use the shadcn pattern (forwardRef, cva, cn utility)
3. Export component and any variants
4. Match the dark technical theme styling

### Adding Interactive Functionality

1. Create React component in `src/components/react/`
2. Use `client:visible` for below-the-fold components
3. Import and use in `.astro` page files
4. Minimize state and keep components focused

## Performance Checklist

Before committing new features, verify:
- [ ] React components are only used when interactivity is required
- [ ] Hydration directives are as lazy as possible (`client:visible` > `client:load`)
- [ ] Images are optimized and use appropriate formats
- [ ] CSS variables are used instead of hardcoded colors
- [ ] No unnecessary dependencies are imported
- [ ] Bundle size impact is minimal (check with `npm run build`)

## Code Quality Standards

- Use TypeScript strictly - no `any` types without justification
- All interactive components must be keyboard accessible
- Maintain consistent spacing (2-space indentation)
- Follow existing patterns for consistency
- Prefer composition over complex component hierarchies
