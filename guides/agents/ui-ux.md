# UI & UX Guidelines

## Visual Identity
**Aesthetic:** Professional, clean, and technical (Computers, Networking, Cloud Hosting).
**Design System:** ShadCN.
**Anti-Patterns:**
- **Avoid All-Caps:** Do not use all-caps for headings or body text.
- **Avoid Card Overload:** Balance cards with open grids and whitespace.

## Styling Patterns
**Semantic Colors:**
Always use shadcn semantic color utilities (defined in `src/styles/global.css`):
- `bg-card`, `text-foreground`, `border-border`
- `text-brand-primary`, `gradient-primary`

**Class Management:**
Use the `cn()` utility for all conditional classes:
```tsx
import { cn } from '@/lib/utils'
<div className={cn("base-class", isActive && "active-class", className)} />
```

**Global Utilities:**
- `.glass`: Glassmorphism effects
- `.gradient-primary`: Primary to secondary gradient
- `.gradient-mesh`: Radial gradient overlay

## Component Patterns (ShadCN)
UI components in `components/ui/` must follow this pattern:
1. `React.forwardRef`
2. `class-variance-authority` (cva)
3. Export component + variants
4. `cn()` utility for merging

## Section Titling Standards
**H2 (Display):** Bold, tracking-tight.
```astro
<h2 class="text-foreground font-bold tracking-tight">
  <span class="text-foreground">Title</span>{' '}
  <span class="gradient-primary">Highlight</span>
</h2>
```

**Subtitle:** Muted text + emphasized key phrase.
```astro
<p class="text-muted-foreground">
  Subtitle copy with a <span class="text-accent font-semibold">Key Phrase</span>.
</p>
```

## Icons & React in Astro
**Icon Set:** Phosphor Icons (`react-icons/pi`).
```tsx
<PiArrowRight className="h-4 w-4 text-primary" />
```

**Service Card Decoration:**
Use specific styling for footer decorations on cards:
- **Standard:** Bar + Circle (Right-aligned, Primary)
- **Partner/Testimonial:** Circle + Bar (Left-aligned, Secondary)
- **Feature:** Bar + Circle + Bar (Center-aligned, Primary)

**CRITICAL: className vs class**
React components in `.astro` files MUST use `className`:
```astro
<!-- ✅ RIGHT -->
<PiCode className="text-primary" />
<!-- ❌ WRONG -->
<PiCode class="text-primary" />
```

## Animation
- **Simple:** Use CSS keyframes in `global.css` (e.g., `.pulse-glow`).
- **Complex:** use `react-bits` or `canvas` (check `prefers-reduced-motion`).
- **Performance:** Prefer `transform`/`opacity`. Avoid layout-thrashing properties.
