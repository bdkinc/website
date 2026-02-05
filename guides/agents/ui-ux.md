# UI & UX Guidelines

## Visual Identity
**Aesthetic:** Professional, clean, and technical (Computers, Networking, Cloud Hosting).
**Design System:** ShadCN.
**Anti-Patterns:**
- **Avoid All-Caps:** Do not use all-caps for headings or body text.
- **Avoid Card Overload:** Balance cards with open grids and whitespace.

## Surfaces & Layout (When to Use Cards)
Default to **open layouts** (typography + whitespace). Use card-like surfaces intentionally.

**Use `TechCard` when:**
- Content is part of a **grid/list of comparable items** (capabilities, features, testimonials, blog cards).
- You want the site’s **technical card signature** (scanlines + footer motif) to unify repeated elements.

**Avoid `TechCard` when:**
- Content is a **single narrative callout** (pull-quote, leadership principle, section lead-in).
- The extra chrome (scanlines/footer motif) competes with the message.

**Preferred pull-quote pattern:**
- Use semantic `figure`/`blockquote` and a branded left rule.
- Optional decorative Phosphor quote icon in low opacity.

```astro
<figure class="relative mx-auto max-w-3xl">
  <PiQuotesFill
    className="text-secondary/10 pointer-events-none absolute -top-10 right-0 h-16 w-16"
    aria-hidden="true"
  />
  <blockquote class="border-l-2 border-secondary/40 pl-6 text-muted-foreground text-xl font-light leading-relaxed md:text-2xl">
    ... <span class="text-accent font-semibold">key phrase</span> ...
  </blockquote>
</figure>
```

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

## Interactive Components (Prefer ShadCN)
When you need interactivity (accordions, dialogs, dropdowns, selects, etc.), prefer **ShadCN UI** components (Radix-backed) over bespoke implementations.

Why:
- **Accessibility**: Radix primitives provide strong a11y defaults (ARIA, keyboard behavior, focus management).
- **Consistency**: Shared styling + interaction patterns across the site.

Notes:
- ShadCN interactive components typically require **Astro hydration** (use `client:visible` by default for below-the-fold).
- If the behavior can be achieved with **native HTML without hydration** (e.g., simple disclosure via `<details>`), that can still be appropriate when performance is paramount.

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
