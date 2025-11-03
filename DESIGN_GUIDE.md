# BDK Inc Design Guide

This comprehensive design guide ensures visual consistency across all components and pages throughout the BDK Inc website. All droids should reference this guide when creating or modifying UI elements.

## Design Philosophy

The BDK Inc design embodies a **dark technical aesthetic** with circuit board motifs, glowing accents, and glassmorphism effects. The design appeals to tech professionals and MSP/CSP businesses while maintaining readability, accessibility, and modern web standards.

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

## Layout Patterns

### Section Structure
```tsx
<section className="relative py-16 md:py-24 overflow-hidden">
  {/* Background effects (aurora, gradient-mesh, circuit-overlay) */}
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Section content */}
  </div>
</section>
```

### Page Layout
All pages follow this structure:
1. **Import Layout** from layouts with SEO meta tags
2. **Import Navigation** component with `client:load`
3. **Use client:visible** for below-the-fold React components
4. **Footer** with consistent company information

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

- [ ] Colors use semantic names or CSS variables, not hard-coded values
- [ ] Typography follows the established scale
- [ ] Spacing uses consistent utilities (no inline padding overrides)
- [ ] Responsive behavior tested on mobile and desktop
- [ ] Hover states and transitions are included
- [ ] Focus states are visible and match hover effects
- [ ] Component uses `cn()` utility for class merging
- [ ] Reduced motion is respected for CSS and JS animations
- [ ] ARIA labels and semantic HTML are correct
- [ ] Performance impact is minimal (no inline styles, efficient animations)
- [ ] Interactive elements have proper click/keyboard affordances
- [ ] Static elements use `interactive={false}` to avoid confusion

This design guide serves as the single source of truth for all visual and interactive elements across the BDK Inc website. All droids should consult this guide to ensure consistency and quality throughout the project.
