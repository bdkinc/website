# BDKinc Brand Styling

## Overview

Use this skill to apply BDKinc’s official website look-and-feel: professional and clean, dark-first UI with subtle technical accents (glassmorphism + gradients) and high contrast for accessibility.

**Keywords**: branding, corporate identity, visual identity, styling, brand colors, typography, BDKinc, shadcn, Tailwind, dark mode, glassmorphism

## Brand Guidelines

### Colors

BDKinc uses a shadcn-style semantic color system backed by CSS variables (see `src/styles/global.css`). Prefer semantic tokens/classes over hard-coded colors.

**Brand Colors (CSS variables)**

- Primary (Cyan): `--primary: oklch(0.65 0.18 210)`
- Secondary (Purple): `--secondary: oklch(0.65 0.22 280)`
- Accent (Amber): `--accent: oklch(0.7 0.18 45)` (slightly brighter in dark mode)

**Semantic Surface Colors (CSS variables)**

- Background: `--background` (light: `oklch(1 0 0)`, dark: `oklch(0 0 0)`)
- Foreground: `--foreground` (light: near-black, dark: near-white)
- Card: `--card` (light: very light gray, dark: very dark gray)
- Muted + Borders: `--muted`, `--border`, `--input`

**Usage Rules**

- Prefer semantic Tailwind utilities: `bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-muted-foreground`.
- Use brand utilities for emphasis and CTAs: `text-primary`, `bg-primary`, and gradients via `gradient-primary`.
- Avoid inventing new hex colors; use existing tokens and opacity modifiers (e.g. `bg-primary/10`).

### Icons

Use Phosphor icons (via `react-icons/pi`) for all iconography.

- Prefer importing only the icons you use (tree-shaking friendly).
- Icons inherit size and color from CSS; style with semantic Tailwind classes (e.g. `h-5 w-5 text-muted-foreground`, `text-primary`).

### Typography

**Uppercase usage (important):**

- Avoid defaulting to `uppercase` styling across headings and UI labels.
- Use Title Case or sentence case for most headings.
- Reserve all-caps for small, short labels (e.g., eyebrow text) where it improves scannability; keep letter-spacing modest.

Typography is defined in `src/styles/global.css`.

- **Display / Headings**: Montserrat (`--font-display`)
- **Body / UI**: Open Sans (`--font-sans`)

**Type Rules**

- Headings (`h1`–`h6`): `--font-display`, weight 700, line-height 1.2
- Body: `--font-sans`, weight 400–500, line-height 1.6
- Keep hierarchy clear; prefer Tailwind scale classes (`text-7xl`…`text-xs`) as used consistently across existing site components.

## Features

### Smart Font Application

- Applies Montserrat to headings/titles (display type)
- Applies Open Sans to body and UI text
- Falls back to system sans-serif if fonts aren’t available
- Preserves hierarchy (larger sizes + heavier weight for headings)

### Text Styling

- Headings: high-contrast `text-foreground`, optional brand highlight using `text-primary`
- Body text: `text-foreground` with secondary content as `text-muted-foreground`
- Links/CTAs: prefer brand primary + clear hover/underline affordances
- Maintain accessibility: strong contrast against `bg-background` / `bg-card`

### Surfaces, Effects, and Accents

- Use glassmorphism for floating surfaces: `glass` (cards) and `glass-nav` (navigation)
- Use gradients sparingly for emphasis: `gradient-primary` (primary→secondary) and `gradient-mesh` (subtle background wash)
- Prefer existing glow tokens for emphasis: `shadow-[--shadow-glow]` and `shadow-[--shadow-glow-accent]`

## Technical Details

### Font Management

- Uses `--font-display` (Montserrat) for headings and `--font-sans` (Open Sans) for body.
- If these fonts aren’t present in the target environment, fall back to system UI fonts.
- Keep weight/size hierarchy consistent (headings bold, body regular).

### Color Application

- Prefer semantic tokens (background/foreground/card/border/muted) and brand tokens (`--primary`, `--secondary`, `--accent`).
- If you must output explicit colors (e.g., for slide tooling), derive them from the repo’s CSS variables in `src/styles/global.css` rather than inventing new values.
- Support dark-first styling by default; ensure content remains readable in both light and dark contexts.
