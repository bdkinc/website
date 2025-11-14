# <span class="font-display font-extrabold">BDKinc</span> Design Guide

This comprehensive design guide ensures visual consistency across all components and pages throughout the <span class="font-display font-extrabold">BDKinc</span> website. All droids should reference this guide when creating or modifying UI elements.

## Design Philosophy

The <span class="font-display font-extrabold">BDKinc</span> design embodies a **dark technical aesthetic** with circuit board motifs, glowing accents, and glassmorphism effects. The design appeals to tech professionals and MSP/CSP businesses while maintaining readability, accessibility, and modern web standards.

### Core Design Principles
- **Technical Sophistication**: Circuit board overlays and tech iconography
- **Visual Hierarchy**: Clear typography scale and spacing system
- **Interactive Depth**: Glassmorphism, animations, and micro-interactions
- **Accessibility**: WCAG 2.1 AA+ compliance throughout
- **Performance**: Optimized animations with reduced motion support

## Color System

### Primary Palette (CSS Variables)
```css
--color-primary: oklch(0.52 0.18 210)      /* Cyan Blue */
--color-secondary: oklch(0.55 0.22 280)     /* Purple */
--brand-primary: oklch(0.52 0.18 210)       /* Primary brand color */
--brand-secondary: oklch(0.55 0.22 280)     /* Secondary brand color */
```

### Semantic Colors
```css
--color-background: oklch(0.145 0 0)        /* Dark background */
--color-foreground: oklch(0.985 0 0)       /* Light text */
--color-card: oklch(0.205 0 0)             /* Card background */
--color-muted: oklch(0.269 0 0)            /* Muted elements */
--color-accent: oklch(0.269 0 0)           /* Accent background */
```

### Usage Guidelines
- **Primary**: Call-to-action buttons, links, important highlights
- **Secondary**: Secondary actions, accents, complementary elements
- **Background**: Page backgrounds, section containers
- **Foreground**: Body text, headings, primary content
- **Muted**: Secondary text, borders, subtle elements

## Typography

### Font Stack
```css
--font-sans: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif
--font-display: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif
```

### Typography Scale
| Class | Size | Usage |
|-------|------|-------|
| `.text-7xl` | 4.5rem (72px) | H1 Primary |
| `.text-6xl` | 3.75rem (60px) | H1 Secondary |
| `.text-5xl` | 3rem (48px) | H2 |
| `.text-4xl` | 2.25rem (36px) | H4/Headings |
| `.text-3xl` | 1.875rem (30px) | H3 |
| `.text-2xl` | 1.5rem (24px | ) Large text |
| `.text-xl` | 1.25rem (20px) | Subheadings |
| `.text-lg` | 1.125rem (18px) | Lead text |
| `.text-base` | 1rem (16px) | Body text |
| `.text-sm` | 0.875rem (14px) | Small text |
| `.text-xs` | 0.75rem (12px) | Caption text |

### Typography Rules
- **Headings (h1-h6)**: Use `--font-display`, weight 700, line-height 1.2
- **Body Text**: Use `--font-sans`, weight 400-500, line-height 1.6
- **Links**: Use `--color-primary` with underline hover states
- **Emphasis**: Use `text-muted-foreground` for secondary information

## Spacing System

### Responsive Spacing
Use Tailwind's spacing scale consistently:
- `p-1` to `p-8`: Padding utilities
- `m-1` to `m-8`: Margin utilities
- `gap-1` to `gap-8`: Gap utilities for grids and flexbox

### Layout Containers
```css
max-w-7xl mx-auto   /* Main content container */
px-4 sm:px-6 lg:px-8  /* Responsive horizontal padding */
```

## Component Design Patterns

### 1. Glassmorphism Effect
Apply to cards and floating elements:
```tsx
className={cn("glass")}
```

#### Glass Variants

**`.glass`** - For cards and content containers:
- 65% opacity background for strong readability
- 12px backdrop blur for depth
- Use for: Cards, modals, content sections

**`.glass-nav`** - For navigation bars:
- 40% opacity background for lighter transparency
- 12px backdrop blur for depth
- Use for: Navigation bars, headers, toolbars

```tsx
// Card components (default)
<Card className="glass">Content</Card>

// Navigation bar
<nav className="glass-nav">Navigation</nav>
```

Custom CSS classes:
- `.glass` - Base glassmorphism effect (65% opacity + backdrop blur)
- `.glass-nav` - Navigation glassmorphism (40% opacity + backdrop blur)
- `.gradient-primary` - Primary to secondary gradient
- `.gradient-mesh` - Radial gradient mesh background
- `.circuit-overlay` - Circuit board pattern overlay

### 2. Button Variants
Based on shadcn UI button system:

```tsx
// Primary CTAs
<Button className="bg-brand-primary hover:bg-brand-primary/90">
  Get Started
</Button>

// Secondary Actions  
<Button variant="outline" className="border-brand-primary text-brand-primary">
  Explore Services
</Button>

// Ghost/Interactive
<Button variant="ghost className="hover:bg-accent">
  Learn More
</Button>
```

### 3. Card Components
#### Unified Card System
All website cards use the `<Card>` component from `@/components/ui/card` with CVA-based variants.

**Component Location**: `src/components/ui/card.tsx`

The Card component provides:
- **Glass background** with 65% opacity for readability
- **Size variants**: `sm`, `default`, `lg`, `xl` with consistent padding
- **Interactive variants**: Hover/focus effects for clickable cards
- **Accessibility**: Built-in focus-visible states and keyboard support

```tsx
import { Card } from '@/components/ui/card';

// Interactive card (clickable, with hover effects)
<Card size="lg" interactive={true}>
  {/* Card content */}
</Card>

// Static card (display only, no hover effects)
<Card size="default" interactive={false}>
  {/* Card content */}
</Card>

// With animations
<Card 
  size="lg" 
  interactive={true}
  className="animate-in fade-in slide-in-from-bottom-6 duration-600 delay-200"
>
  {/* Card content */}
</Card>

// Wrapped in link for navigation (like services.astro)
<a 
  href="/service" 
  className="group block animate-in fade-in slide-in-from-bottom-6 duration-600"
  style={{ animationDelay: `${delayMs}ms` }}
>
  <Card size="lg" interactive={true} className="h-full cursor-pointer flex flex-col justify-center">
    <div className="flex h-full flex-col items-center text-center">
      {/* Icon with interactive animation */}
      <div className="mb-6">
        <div className="bg-primary/5 inline-flex items-center justify-center rounded-lg p-3 transition-transform duration-300 group-hover:scale-115 group-hover:rotate-5">
          <ServiceIcon className="icon-lg text-primary" />
        </div>
      </div>
      
      {/* Title */}
      <h2 className="text-foreground group-hover:text-primary mb-3 text-2xl font-bold transition-colors duration-300">
        Service Title
      </h2>
      
      {/* Description */}
      <p className="text-muted-foreground mb-6 grow">
        Brief service description
      </p>
      
      {/* CTA indicator */}
      <div className="text-primary flex items-center font-medium">
        <span>Learn More</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </div>
  </Card>
</a>
```

#### Card Size Variants
```tsx
// Small cards - 1rem (16px) padding
<Card size="sm">Compact content</Card>

// Default cards - 1.5rem (24px) padding
<Card size="default">Standard content</Card>

// Large cards - 2rem (32px) padding
<Card size="lg">Spacious content</Card>

// Extra large cards - 2.5rem (40px) padding
<Card size="xl">Hero content</Card>
```

#### Card Design Rules
1. **Always use the Card component** - Never create custom card styles
2. **Use appropriate size variants** - No inline padding overrides
3. **Set interactive prop correctly**:
   - `interactive={true}` for clickable/hoverable cards (default)
   - `interactive={false}` for display-only cards
4. **Use fill-mode-both** with animate-in classes for proper animation state
5. **Maintain consistent grid spacing** - Use `gap-6` for card grids
6. **Wrap cards in semantic elements**:
   - `<a>` for navigation
   - `<button>` for actions
   - `<div>` for static display
7. **Accessibility first**: Interactive states are built-in, ensure parent links/buttons have proper ARIA labels

### 4. Navigation Pattern
Fixed navigation with lighter glassmorphism for better transparency:
```tsx
<nav className="fixed top-0 left-0 right-0 z-50 glass-nav shadow-md">
  <div className="max-w-7xl mx-auto">
    <div className="flex justify-between items-center h-16">
      {/* Logo on left */}
      {/* Navigation items centered */}
      {/* Theme toggle on right */}
    </div>
  </div>
</nav>
```

**Navigation Design Rules:**
- Use `.glass-nav` (40% opacity) instead of `.glass` for better transparency
- Fixed positioning with `z-50` to stay above content
- Shadow-md for depth separation
- Centered navigation items with absolute positioning
- Responsive mobile menu with backdrop

## Icon System

### Icon Sizing
Using consistent icon size classes:
```css
.icon-xs { width: 1rem; height: 1rem; }    /* 16px */
.icon-sm { width: 1.5rem; height: 1.5rem; } /* 24px */
.icon-md { width: 2rem; height: 2rem; }     /* 32px */
.icon-lg { width: 2.5rem; height: 2.5rem; } /* 40px */
.icon-xl { width: 4rem; height: 4rem; }     /* 64px */
```

### Icon Usage
- Use **lucide-react** for consistent iconography
- Apply `text-brand-primary` or `text-brand-secondary` for accent colors
- Use `text-muted-foreground` for secondary icons
- Maintain consistent sizing within component groups

## Animation Guidelines

### Animation Libraries
- **tw-animate-css**: CSS animations with `animate-in` classes
- **GSAP**: JavaScript animations for complex sequences
- **Always include `fill-mode-both`** with `animate-in` classes

### Animation Principles
- **Purposeful**: Animations should guide user attention
- **Subtle**: Avoid jarring or distracting movements
- **Respectful**: Honor `prefers-reduced-motion` settings
- **Performant**: Use CSS transforms and opacity for smooth animations

### Common Animation Patterns
```tsx
// Fade and slide animations (always include fill-mode-both)
className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"

// Hover transitions
className="transition-all duration-300 hover:scale-105"

// Floating animation (background elements)
className="animate-float"

// GSAP animations for complex effects (for decorative background elements)
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to(element, {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, containerRef);
  
  return () => ctx.revert();
}, []);
```

### Animation Classes
- `.animate-float` - Gentle floating animation for decorative elements
- `.animate-in` - Entry animations with configurable directions
- **`fill-mode-both`** - Must be included with animate-in for proper state handling
- `transition-all duration-300` - Standard hover transitions
- `hover:scale-105` - Subtle scale effect on hover
- `hover:shadow-[--shadow-glow-sm]` - Glowing shadow on hover

## View Transitions API

### Overview
The BDK Inc website uses the HTML View Transitions API to create smooth, morphing transitions between pages. This creates a native app-like experience where elements seamlessly transform from one page to another.

**Implemented Transitions:**
- **Services**: Icon, title, and description morph from services index/navigation → service detail pages
- **Blog**: Title and description morph from blog index → blog detail pages
- **Duration**: 0.75s with easeOutQuad easing for smooth, natural motion

### Architecture Setup

#### 1. Enable ClientRouter
In `src/layouts/Layout.astro`, the ClientRouter component enables view transitions:

```astro
---
import { ClientRouter } from 'astro:transitions';
---

<html>
  <head>
    <!-- Meta tags -->
  </head>
  <body>
    <ClientRouter />
    <slot />
    
    <script is:inline>
      // Preserve theme on page transitions
      document.addEventListener('astro:after-swap', () => {
        const theme = localStorage.getItem('theme');
        if (theme) {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      });
    </script>
  </body>
</html>
```

**Key Points:**
- `<ClientRouter />` must be placed in Layout.astro before `<slot />`
- Use `astro:after-swap` event for post-transition logic (e.g., theme persistence)
- All pages inherit transition capability automatically

#### 2. Configure CSS Timing
In `src/styles/global.css`, view transition timing is defined:

```css
/* View Transitions Configuration */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom element transitions (icons, titles, descriptions) */
::view-transition-group(*):not(::view-transition-group(root)) {
  animation-duration: 0.75s;
  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); /* easeOutQuad */
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root),
  ::view-transition-group(*) {
    animation-duration: 0.01s !important;
  }
}
```

**Timing Strategy:**
- **Root transitions** (full page fade): 0.3s for quick page changes
- **Element morphs**: 0.75s for smooth, visible transformations
- **Easing**: easeOutQuad creates natural deceleration
- **Accessibility**: Reduced motion support built-in

### Implementation Patterns

#### Astro Elements (Recommended)
For static Astro templates, use `transition:name` and `transition:animate`:

```astro
<!-- Services grid card -->
<a href={`/services/${service.slug}`}>
  <Card>
    <div transition:name={`service-icon-${service.slug}`} transition:animate="initial">
      <Icon className="icon-lg text-primary" />
    </div>
    
    <h2 transition:name={`service-title-${service.slug}`} transition:animate="initial">
      {service.title}
    </h2>
    
    <p transition:name={`service-description-${service.slug}`} transition:animate="initial">
      {service.description}
    </p>
  </Card>
</a>

<!-- Service detail page -->
<section>
  <div transition:name={`service-icon-${service.slug}`} transition:animate="initial">
    <Icon className="h-12 w-12 text-primary" />
  </div>
  
  <h1 transition:name={`service-title-${service.slug}`} transition:animate="initial">
    {service.title}
  </h1>
  
  <p transition:name={`service-description-${service.slug}`} transition:animate="initial">
    {service.description}
  </p>
</section>
```

**Key Attributes:**
- `transition:name={unique-id}` - Pairs elements between pages (must be unique per page)
- `transition:animate="initial"` - Uses browser's built-in morph animation

#### React Elements (Special Syntax)
For React components, use bracket notation for the CSS property:

```tsx
// Navigation.tsx
<div 
  {...(showTransitions && {
    style: { ['view-transition-name']: `service-icon-${service.slug}` } as any
  })}
>
  <Icon className="h-8 w-8 text-primary" />
</div>

<h3
  {...(showTransitions && {
    style: { ['view-transition-name']: `service-title-${service.slug}` } as any
  })}
>
  {service.title}
</h3>
```

**Why Bracket Notation?**
- React doesn't recognize `viewTransitionName` as a standard CSS property
- Using `['view-transition-name']` directly sets the CSS property name
- Cast to `as any` to bypass TypeScript type checking

### Transition Naming Conventions

Use descriptive, unique names following this pattern:
```
{type}-{element}-{identifier}
```

**Examples:**
- `service-icon-managed-it`
- `service-title-cybersecurity`
- `service-description-cloud-hosting`
- `blog-title-network-infrastructure-upgrade-guide`
- `blog-description-getting-started-with-cloud-security`

**Critical Rules:**
1. **Must be unique per page** - No duplicate transition names on the same page
2. **Must match exactly** - Source and destination must use identical names
3. **Use slug/identifier** - Ensures uniqueness across dynamic content

### Preventing Duplicate Transition Names

When the same element appears multiple times (e.g., Navigation dropdown showing all services), use conditional logic:

```tsx
// Navigation.tsx
const isServicesPage = currentPath.startsWith('/services');
const showTransitions = !isServicesPage;

// Only apply transitions when NOT on services pages
<div 
  {...(showTransitions && {
    style: { ['view-transition-name']: `service-icon-${service.slug}` } as any
  })}
>
  <Icon className="h-8 w-8 text-primary" />
</div>
```

**Rationale:**
- Navigation dropdown includes ALL services (including current page)
- If on `/services/managed-it`, don't add transition name to "Managed IT" in dropdown
- Prevents duplicate `service-icon-managed-it` names on same page
- Only show transitions when navigating FROM non-services pages

### Removing Conflicting Animations

**CRITICAL:** View Transitions API takes snapshots of elements before/after navigation. CSS animations that run immediately on page load (like `animate-in`) break forward transitions.

#### ❌ Broken (Animation Conflicts)
```astro
<!-- Destination page - BREAKS forward transitions -->
<h1 
  class="animate-in fade-in slide-in-from-bottom-4 duration-700"
  transition:name="service-title-managed-it"
>
  Managed IT Services
</h1>
```

**Why it breaks:**
- Browser captures "before" snapshot on source page
- Navigation begins
- Destination page loads with `animate-in` classes
- Element immediately animates with CSS, destroying "after" snapshot
- View Transitions API can't morph between snapshots

#### ✅ Fixed (Clean Elements)
```astro
<!-- Destination page - Works perfectly -->
<h1 
  class="text-foreground text-5xl font-bold"
  transition:name="service-title-managed-it"
  transition:animate="initial"
>
  Managed IT Services
</h1>
```

**What to remove from morphing elements:**
- `animate-in`
- `fade-in`
- `slide-in-from-*`
- `zoom-in`
- `duration-*`
- `delay-*`
- `fill-mode-both`

**What to keep:**
- Static styling classes (`text-foreground`, `text-5xl`, `mb-6`, etc.)
- Interactive classes (`hover:`, `group-hover:`, `transition-colors`, etc.)

### DOM Structure Requirements

Transition names must be on the **same structural level** on both pages.

#### ❌ Structure Mismatch
```astro
<!-- Source: transition:name on outer wrapper -->
<a href="/service">
  <div transition:name="service-icon-managed-it">
    <div class="bg-primary/10 p-3 rounded-lg">
      <Icon className="icon-lg" />
    </div>
  </div>
</a>

<!-- Destination: transition:name on inner styled div -->
<section>
  <div>
    <div class="bg-primary/10 p-3 rounded-lg" transition:name="service-icon-managed-it">
      <Icon className="h-12 w-12" />
    </div>
  </div>
</section>
```

#### ✅ Structure Match
```astro
<!-- Source: transition:name on styled wrapper -->
<a href="/service">
  <div>
    <div class="bg-primary/10 p-3 rounded-lg" transition:name="service-icon-managed-it">
      <Icon className="icon-lg" />
    </div>
  </div>
</a>

<!-- Destination: transition:name on styled wrapper (same level) -->
<section>
  <div>
    <div class="bg-primary/10 p-3 rounded-lg" transition:name="service-icon-managed-it">
      <Icon className="h-12 w-12" />
    </div>
  </div>
</section>
```

### Implementation Examples

#### Services Transitions
```astro
<!-- services.astro -->
{services.map(service => (
  <a href={`/services/${service.slug}`}>
    <Card>
      <!-- Icon wrapper -->
      <div transition:name={`service-icon-${service.slug}`} transition:animate="initial">
        <div class="bg-primary/5 p-3 rounded-lg">
          <ServiceIcon className="icon-lg text-primary" />
        </div>
      </div>
      
      <!-- Title -->
      <h2 
        class="text-2xl font-bold"
        transition:name={`service-title-${service.slug}`}
        transition:animate="initial"
      >
        {service.title}
      </h2>
      
      <!-- Description -->
      <p 
        class="text-muted-foreground"
        transition:name={`service-description-${service.slug}`}
        transition:animate="initial"
      >
        {service.description}
      </p>
    </Card>
  </a>
))}

<!-- services/[slug].astro -->
<section>
  <!-- Icon (matches structure) -->
  <div transition:name={`service-icon-${service.slug}`} transition:animate="initial">
    <div class="bg-primary/5 p-3 rounded-lg">
      <ServiceIcon className="h-12 w-12 text-primary" />
    </div>
  </div>
  
  <!-- Title (no animate-in classes) -->
  <h1 
    class="text-5xl font-bold"
    transition:name={`service-title-${service.slug}`}
    transition:animate="initial"
  >
    {service.title}
  </h1>
  
  <!-- Description (no animate-in classes) -->
  <p 
    class="text-xl"
    transition:name={`service-description-${service.slug}`}
    transition:animate="initial"
  >
    {service.description}
  </p>
</section>
```

#### Blog Transitions
```astro
<!-- blog.astro -->
{posts.map(post => (
  <a href={`/blog/${post.slug}`}>
    <Card>
      <h2 
        class="text-2xl font-semibold"
        transition:name={`blog-title-${post.slug}`}
        transition:animate="initial"
      >
        {post.data.title}
      </h2>
      
      <p 
        class="text-sm text-muted-foreground"
        transition:name={`blog-description-${post.slug}`}
        transition:animate="initial"
      >
        {post.data.description}
      </p>
    </Card>
  </a>
))}

<!-- blog/[slug].astro -->
<section>
  <h1 
    class="text-4xl font-bold md:text-5xl lg:text-6xl"
    transition:name={`blog-title-${entry.slug}`}
    transition:animate="initial"
  >
    {entry.data.title}
  </h1>
  
  <p 
    class="text-xl text-muted-foreground"
    transition:name={`blog-description-${entry.slug}`}
    transition:animate="initial"
  >
    {entry.data.description}
  </p>
</section>
```

### Navigation Dropdown Transitions

```tsx
// Navigation.tsx
interface NavigationProps {
  services: Array<Service>;
  currentPath?: string;
}

export default function Navigation({ services, currentPath = "" }: NavigationProps) {
  const isServicesPage = currentPath.startsWith('/services');
  const showTransitions = !isServicesPage;
  
  return (
    <nav>
      {/* Desktop dropdown */}
      <div>
        {services.map(service => (
          <a href={`/services/${service.slug}`} key={service.slug}>
            {/* Icon */}
            <div
              {...(showTransitions && {
                style: { ['view-transition-name']: `service-icon-${service.slug}` } as any
              })}
            >
              <ServiceIcon className="h-8 w-8 text-primary" />
            </div>
            
            {/* Title */}
            <div
              {...(showTransitions && {
                style: { ['view-transition-name']: `service-title-${service.slug}` } as any
              })}
            >
              {service.title}
            </div>
            
            {/* Description */}
            <p
              {...(showTransitions && {
                style: { ['view-transition-name']: `service-description-${service.slug}` } as any
              })}
            >
              {service.description}
            </p>
          </a>
        ))}
      </div>
    </nav>
  );
}
```

**Pass currentPath from all pages:**
```astro
<Navigation 
  client:load 
  services={servicesData} 
  blogPosts={recentPosts}
  currentPath={Astro.url.pathname}
/>
```

### Common Pitfalls & Solutions

#### Problem 1: Transitions only work backward
**Symptom:** Transitions work when going back, but not forward

**Cause:** Animation classes on destination elements interfere with View Transitions API

**Solution:** Remove all `animate-in`, `fade-in`, `slide-in-*`, etc. from morphing elements on destination pages

#### Problem 2: Elements don't morph, just fade
**Symptom:** No morphing effect, just default cross-fade

**Cause:** Transition names don't match exactly, or duplicate names on same page

**Solution:** 
- Verify exact name matching between source and destination
- Check for duplicates with browser DevTools
- Use conditional logic to prevent duplicates (e.g., Navigation)

#### Problem 3: React inline styles not working
**Symptom:** `viewTransitionName` in React doesn't apply

**Cause:** React doesn't recognize `viewTransitionName` as a CSS property

**Solution:** Use bracket notation `['view-transition-name']` instead:
```tsx
// ❌ Doesn't work
style={{ viewTransitionName: 'value' }}

// ✅ Works
style={{ ['view-transition-name']: 'value' } as any}
```

#### Problem 4: Awkward morphs
**Symptom:** Elements morph but look strange or janky

**Cause:** Structure mismatch between source and destination

**Solution:** 
- Place `transition:name` on the same structural level
- Match wrapper elements (styled divs, containers, etc.)
- Consider whether elements are similar enough to morph

### Testing Checklist

Before committing view transitions:
- [ ] Build succeeds without errors (`npm run build`)
- [ ] Transitions work **bidirectionally** (forward and backward)
- [ ] No duplicate transition names on any page
- [ ] Removed all conflicting `animate-in` classes from morphing elements
- [ ] Timing feels smooth (0.75s is good, adjust if needed)
- [ ] Reduced motion is respected (test with browser DevTools)
- [ ] Test with keyboard navigation (transitions should work)
- [ ] Test on different page combinations (index → detail, navigation → detail)

### When NOT to Use View Transitions

**Skip transitions when:**
1. **Structure is too different** - Elements don't have similar positions/sizes
2. **No matching elements** - Source and destination have completely different content
3. **Performance concerns** - Very large images or complex layouts
4. **Accessibility issues** - Motion might cause disorientation

**Better with default fade:**
- Navigation blog items (structure too different from detail page)
- Footer links
- Utility pages (404, contact form)
- External links

### Accessibility Considerations

View transitions respect `prefers-reduced-motion` automatically via global CSS:

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root),
  ::view-transition-group(*) {
    animation-duration: 0.01s !important;
  }
}
```

**Best Practices:**
- Keep transitions subtle and purposeful
- Don't rely on transitions to convey critical information
- Test with reduced motion enabled
- Provide alternative visual cues (focus states, active states)

### Performance Notes

View transitions are highly performant because:
- Browser handles animation natively (GPU accelerated)
- No JavaScript overhead for morphing
- Snapshots are optimized by the browser
- Works with browser's navigation cache

**Optimize for best results:**
- Keep morphing elements simple (avoid deeply nested structures)
- Use `transition:animate="initial"` for browser's optimized morph
- Don't morph very large images or complex SVGs
- Limit number of simultaneous morphs (3-5 elements max per page)

## Layout Patterns

### Page Structure Pattern
All pages follow a consistent visual hierarchy with circuit board overlay on hero sections only:

#### 1. Hero Section (with Circuit Overlay)
```astro
<section class="relative overflow-hidden px-4 pt-24 pb-12 sm:px-6 lg:px-8">
  <!-- Background layers -->
  <div class="gradient-mesh absolute inset-0 opacity-30"></div>
  <div class="circuit-overlay absolute inset-0 opacity-40"></div>
  
  <!-- Hero content -->
  <div class="relative z-10 mx-auto max-w-4xl text-center">
    <h1 class="text-5xl font-bold md:text-6xl">
      {/* Page title */}
    </h1>
    <p class="text-muted-foreground text-xl md:text-2xl">
      {/* Hero description */}
    </p>
  </div>
  
  <!-- Gradient break at bottom -->
  <div class="from-brand-primary to-brand-secondary absolute right-0 bottom-0 left-0 h-2 bg-linear-to-br"></div>
</section>
```

**Hero Section Rules:**
- Circuit overlay and gradient-mesh are **ONLY** applied to hero sections
- Hero section contains title and primary description only
- Must end with 2px horizontal gradient break bar
- Use `relative overflow-hidden` on section for proper positioning
- Background layers positioned with `absolute inset-0`
- Content wrapped in `relative z-10` to appear above backgrounds

#### 2. Content Sections (Clean Zone)
```astro
<section class="px-4 py-24 sm:px-6 lg:px-8">
  <!-- NO circuit overlay, NO gradient-mesh -->
  <!-- Clean background (inherits from body) -->
  <div class="mx-auto max-w-7xl">
    {/* Content here */}
  </div>
</section>
```

**Content Section Rules:**
- NO circuit overlay or gradient-mesh on section level
- Each section is self-contained with its own padding (`py-24` standard)
- Use different backgrounds for visual variety:
  - Transparent/default background (most sections)
  - Subtle gradients: `bg-gradient-to-b from-transparent via-primary/5 to-transparent`
  - Card containers with `.glass` effect for featured content
- Maintain consistent max-width containers (`max-w-7xl`, `max-w-5xl`, etc.)

#### 3. Visual Separation Techniques
- **Gradient break bar**: 2px horizontal gradient after hero section
- **Alternating backgrounds**: Transparent → subtle gradient → transparent pattern
- **Card grouping**: Use Card components with `.glass` effect for content blocks
- **Spacing**: Consistent `py-24` (96px) between sections, `py-12` (48px) for tighter spacing

### Complete Page Structure Example
```astro
---
import Layout from '../layouts/Layout.astro';
import Navigation from '../components/Navigation';
---

<Layout title="Page Title">
  <Navigation client:load services={servicesData} blogPosts={recentPosts} />
  <main id="main-content">
    
    {/* Hero Section with Circuit Overlay */}
    <section class="relative overflow-hidden px-4 pt-24 pb-12 sm:px-6 lg:px-8">
      <div class="gradient-mesh absolute inset-0 opacity-30"></div>
      <div class="circuit-overlay absolute inset-0 opacity-40"></div>
      <div class="relative z-10 mx-auto max-w-4xl text-center">
        <h1>Page Title</h1>
        <p>Description</p>
      </div>
      <div class="from-brand-primary to-brand-secondary absolute right-0 bottom-0 left-0 h-2 bg-linear-to-br"></div>
    </section>

    {/* Clean Content Section 1 */}
    <section class="px-4 py-24 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        {/* Content */}
      </div>
    </section>

    {/* Content Section 2 with Subtle Gradient */}
    <section class="via-primary/5 bg-gradient-to-b from-transparent to-transparent px-4 py-24 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        {/* Content */}
      </div>
    </section>

    {/* CTA Section */}
    <CTASection client:visible />
  </main>

  {/* Footer */}
  <footer class="px-4 py-12 sm:px-6 lg:px-8">
    {/* Footer content */}
  </footer>
</Layout>
```

### Page Layout Checklist
All pages must follow this structure:
1. **Import Layout** from layouts with SEO meta tags
2. **Import Navigation** component with `client:load`
3. **Hero section** with circuit overlay + gradient break
4. **Content sections** with clean backgrounds (NO circuit overlay)
5. **Use client:visible** for below-the-fold React components
6. **Footer** with consistent company information

### Anti-Patterns (DO NOT DO)
❌ Circuit overlay on entire page wrapper
❌ Gradient-mesh on main element covering all sections
❌ Nested relative/absolute wrappers causing z-index issues
❌ Missing gradient break after hero section
❌ Inconsistent section padding

### Design Rationale
This pattern creates:
- **Visual hierarchy**: Tech aesthetic on hero, clean reading experience in content
- **User engagement**: Circuit overlay grabs attention, then content takes focus
- **Performance**: Reduced complexity in CSS rendering
- **Consistency**: Matches Home and blog detail pages throughout the site

## Responsive Design

### Breakpoint Strategy
- **Mobile**: `sm:` breakpoint (640px+)
- **Tablet**: `md:` breakpoint (768px+) 
- **Desktop**: `lg:` breakpoint (1024px+)
- **Large Desktop**: `xl:` breakpoint (1280px+)

### Mobile-First Approach
Start with mobile styles, then enhance for larger screens:
```tsx
className="flex flex-col md:flex-row gap-4"
```

## Accessibility Guidelines

### WCAG 2.1 AA+ Compliance
- **Color Contrast**: All text meets minimum contrast ratios
- **Focus States**: Visible focus indicators with `:focus-visible`
- **Screen Readers**: Proper semantic HTML structure
- **Reduced Motion**: Respect `prefers-reduced-motion` settings
- **Keyboard Navigation**: All interactive elements accessible via keyboard

### Semantic HTML
```html
<!-- Proper heading hierarchy -->
<h1>Main page title</h1>
<h2>Section title</h2>
<h3>Subsection title</h3>

<!-- Semantic sectioning -->
<section aria-labelledby="services-heading">
  <h2 id="services-heading">Our Services</h2>
  <!-- content -->
</section>

<!-- Accessible buttons -->
<button 
  aria-label="Get started with our services"
  className="bg-brand-primary text-white px-6 py-3 rounded-lg"
>
  Get Started
</button>
```

## Code Examples

### Consistent Component Structure
```tsx
import { cn } from "@/lib/utils";

export default function ComponentName({ className, ...props }) {
  return (
    <div
      className={cn(
        "base-classes",
        "conditional-classes",
        className
      )}
      {...props}
    >
      {/* Component content */}
    </div>
  );
}
```

### Utility Class Usage
```tsx
// Always use cn() for class merging
const className = cn(
  "base-classes",
  isActive && "active-classes", 
  variant === "primary" && "primary-classes",
  className
);
```

## Design System Maintenance

### Theme Variables Location
All theme variables are defined in `src/styles/global.css` using Tailwind v4's `@theme` directive.

### Component Location
- **UI Components**: `src/components/ui/` (shadcn-style)
- **Feature Components**: `src/components/` (custom business logic)
- **Layout Components**: `src/layouts/`
- **Page Components**: `src/pages/`

### Color Reference
Use CSS variables when accessing theme colors:
```tsx
className="text-[--color-primary] bg-[--color-background]"
```

Or use Tailwind's semantic color classes:
```tsx
className="text-primary bg-background"
```

## Accessibility Implementation Checklist

### Keyboard Navigation
```tsx
// Always include focus-visible states matching hover effects
className="hover:scale-105 focus-visible:scale-105 hover:shadow-[--shadow-glow-sm] focus-visible:shadow-[--shadow-glow-sm]"

// Additional focus rings for interactive elements
className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
```

### Reduced Motion Support
```tsx
// CSS animations are automatically handled by global.css
// For JavaScript animations (GSAP):
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  // Only run animations if user didn't request reduced motion
  const ctx = gsap.context(() => {
    // Animation code
  }, containerRef);
}
```

### Interactive vs Static Elements
```tsx
// For clickable cards (default behavior)
<Card interactive={true}>
  {/* Interactive content */}
</Card>

// For display-only cards
<Card interactive={false}>
  {/* Static content */}
</Card>

// Explicit focus states for links wrapping cards
<a 
  href="/service"
  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
>
  <Card interactive={true}>
    {/* Card content */}
  </Card>
</a>
```

## Implementation Checklist

Before submitting any UI changes, ensure:

### Page Structure
- [ ] Hero section has circuit overlay + gradient-mesh backgrounds
- [ ] Gradient break bar (2px horizontal) at bottom of hero section
- [ ] Content sections have NO circuit overlay (clean backgrounds)
- [ ] Each section is self-contained with proper padding (`py-24` or `py-12`)
- [ ] Sections use varied backgrounds for visual separation

### Design System
- [ ] Colors use semantic names or CSS variables, not hard-coded values
- [ ] Typography follows the established scale
- [ ] Spacing uses consistent utilities (no inline padding overrides)
- [ ] Component uses `cn()` utility for class merging
- [ ] Cards use the Card component with appropriate size/interactive props

### Interactivity & Accessibility
- [ ] Responsive behavior tested on mobile and desktop
- [ ] Hover states and transitions are included
- [ ] Focus states are visible and match hover effects
- [ ] Reduced motion is respected for CSS and JS animations
- [ ] ARIA labels and semantic HTML are correct
- [ ] Interactive elements have proper click/keyboard affordances
- [ ] Static elements use `interactive={false}` to avoid confusion

### Performance
- [ ] Performance impact is minimal (no inline styles, efficient animations)
- [ ] Animations include `fill-mode-both` with `animate-in` classes
- [ ] Images are optimized and use appropriate formats

### View Transitions (if applicable)
- [ ] Transition names are unique per page (no duplicates)
- [ ] Transition names match exactly between source and destination
- [ ] Removed all `animate-in` classes from morphing elements on destination pages
- [ ] DOM structure matches on same level for transition:name placement
- [ ] React elements use bracket notation `['view-transition-name']` for inline styles
- [ ] Conditional logic prevents duplicate names (e.g., Navigation)
- [ ] Transitions work bidirectionally (forward and backward)
- [ ] Elements are appropriate for morphing (similar positions/sizes)

This design guide serves as the single source of truth for all visual and interactive elements across the <span class="font-display font-extrabold">BDKinc</span> website. All droids should consult this guide to ensure consistency and quality throughout the project.
