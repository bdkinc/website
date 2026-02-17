# BDKinc Visual Assets (Audit + Classification)

## Overview

Use this skill to **identify and classify the visual assets used throughout the website**, then produce a structured inventory and recommendations that align with BDKinc’s positioning as a **premier MSP + CSP + development partner**.

This skill is opinionated toward a **clean, professional, technical** aesthetic suitable for C‑suite audiences:

- **Avoid** “neon”, “glow”, “cyberpunk” styling.
- **Prefer** subtle motion, crisp information design, and credible technical cues.
- **Show capability** through product-like UI visuals (dashboards, consoles, maps, lifecycle flows), not hype.

**Keywords**: visual assets, design audit, brand visuals, iconography, SVG, logos, illustrations, motion design, GSAP, canvas, WebGL, executive design, MSP, CSP, custom software

## What This Skill Produces

When asked to “identify the visual assets”, output:

1. **Visual Asset Inventory**
   - Asset types present (taxonomy below)
   - Where they live (paths/components)
   - How they’re rendered (static file, inline SVG, React component, canvas/WebGL)
2. **Executive Fit Assessment**
   - What reads as “enterprise-grade” vs “flashy”
   - Any glow/neon usage hotspots
3. **Recommendations (Prioritized)**
   - Small tactical changes (safe, low-risk)
   - Medium updates (component/style refactors)
   - High-impact additions (new visuals that showcase MSP/CSP/Dev prowess)

## Visual Asset Taxonomy (What to Identify)

Classify every visual element into one (or more) of these categories.

### 1) Brand Marks (Primary Identity)

**Definition:** The company’s main mark and wordmark.

**In this repo:**

- Inline SVG logo component: `src/components/Logo.tsx`

**Notes:**

- The logo uses an animated gradient transform. Treat this as brand motion; keep it subtle and non-distracting.

### 2) Partner / Vendor Logos

**Definition:** Third-party marks used to reinforce credibility and ecosystem breadth.

**In this repo:**

- Static SVGs: `public/logos/partners/*.svg` (e.g., IBM, Microsoft, Cisco, Lenovo, Cloudflare, VMware)

### 3) Iconography (UI + Feature Icons)

**Definition:** Small symbolic graphics used in navigation, feature grids, cards, and CTAs.

**In this repo:**

- Primary icon set: Phosphor via `react-icons/pi`
- Central icon map: `src/lib/icons.ts`

### 4) Programmatic Backgrounds / Decorative Systems

**Definition:** Generated visuals used as subtle technical texture or atmosphere (not primary content).

**In this repo (examples):**

- WebGL shader aurora: `src/components/Aurora.tsx` (OGL)
- Circuit board motifs:
  - CSS data-URI overlay: `src/styles/global.css` (e.g., `.circuit-overlay`)
  - Canvas-rendered animated circuit: `src/components/CircuitBoard.tsx`

**Guidance:**

- Prefer these as **subtle background texture**, low opacity, respecting `prefers-reduced-motion`.
- Avoid pairing with glow/neon; the technical motif should feel “enterprise engineering”, not “gaming”.

### 5) Information Visualizations (Capability Proof)

**Definition:** Component-driven diagrams and micro-visualizations that communicate process, scale, architecture, or outcomes.

**In this repo:**

- A library of visualization components: `src/components/visualizations/*.tsx`
  - Examples: Managed IT, Cloud Hosting, Cybersecurity, AI, Lifecycle, ERP hosting, EDI flow.

**Intent:** These are “credibility assets” — they should read like an executive-ready architecture brief.

### 6) Product-Style UI Simulations (Dashboards/Consoles)

**Definition:** UI panels that look like operational tooling (monitoring, pipelines, consoles). This is an excellent way to communicate MSP/CSP capability.

#### Card Decoration System (Technical “Footer” Motif)

**Definition:** A small, consistent card footer decoration used across the site as a primary **technical/enterprise cue**. It functions like a UI “signature” (subtle, repeatable, non-neon) and helps unify cards across pages.

**Scope:** This is for **card surfaces** (e.g., `TechCard` in grids). Do **not** wrap single narrative elements (like a leadership pull-quote) in a card just to apply the motif—use an open layout (semantic `blockquote` + branded left rule) instead.

**System logic (layout variants):**

- **Bar + Circle** (right-aligned) — standard service cards
- **Circle + Bar** (left-aligned) — partner cards
- **Bar + Circle + Bar** (center-aligned) — feature cards (WhyChooseUs)
- **Circle + Bar** (left-aligned) — testimonial cards

**Note:** Testimonials and Partners intentionally share the same left-aligned style.

##### Semantic Color Logic

- **Primary (Blue/Cyan):** Core Identity & Offerings (Services, Features)
- **Secondary (Purple):** Ecosystem & Trust (Partners, Testimonials)
- **Accent (Orange/Amber):** Highlights & Differentiators (Text highlights)

**Note:** This system intentionally replaces older “corner brackets” and neon/glow treatments as the main technical signifiers, keeping the aesthetic executive-friendly and consistent.

**In this repo (examples):**

- `src/components/ERPPerformanceConsole.tsx`
- `src/components/PowerSystemsConsole.tsx`
- `src/components/TransactionConsole.tsx`
- `src/components/DataOrchestrationDashboard.tsx`

### 7) Motion & Micro-Interaction Assets

**Definition:** Subtle animation used to communicate state, flow, and polish (hover transitions, timeline reveals, counters).

**In this repo (examples):**

- GSAP-driven animations inside visualization components (e.g., `src/components/visualizations/ManagedITVisualization.tsx`)
- Hover micro-interactions (e.g., `src/components/CornerBrackets.tsx`)
- Count-up / metric animation components (e.g., `src/components/CountUp.tsx`, `src/components/MetricCountUp.tsx`)

### 8) Raster Images / Screenshots

**Definition:** PNG/JPEG/WEBP assets used for screenshots, photography, or scanned images.

**In this repo:**

- `public/Screenshot 2025-11-13 144648.png`

**Guidance:**

- Prefer SVG where possible for logos/marks. Use raster images intentionally (e.g., a real product screenshot), not as decoration.

## How to Detect & Attribute Visual Assets

When scanning the codebase:

- **Static files**: check `public/` for `*.svg`, `*.png`, `*.jpg`, `*.webp`, `*.gif`, `*.mp4`, `*.webm`.
- **Inline SVG components**: search for `<svg` in `src/components/**/*.tsx` and `.astro`.
- **Icon usage**: search for `react-icons/pi` imports and the shared map in `src/lib/icons.ts`.
- **CSS-embedded visuals**:
  - `background-image:` with `url("data:image/svg+xml,` (common for patterns)
  - gradient utilities like `.gradient-primary`, `.gradient-mesh`
- **Canvas/WebGL**: search for `canvas`, `getContext('2d')`, `ogl`, `Renderer`, `Program`.
- **Motion libraries**: search for `gsap`, `useGSAP`, and long-running `requestAnimationFrame` loops.

For each detected asset, capture:

- **Type** (taxonomy section)
- **Source** (static file vs generated)
- **Component owner** (file path)
- **Purpose** (trust signal, capability proof, decoration)
- **Risk** (performance, accessibility, “too flashy”)

## Executive-Friendly Visual Direction (Hard Constraints)

### Capitalization in UI visuals

- Avoid all-caps labels baked into diagrams/visual panels.
- Prefer sentence-case labels in UI-simulation components (dashboards/consoles) unless the design specifically calls for a small eyebrow label.

### Aesthetic Rules

**Required:** clean, professional, technical, enterprise-ready.

**Avoid:**

- “Glow”, “neon”, “laser”, “cyberpunk” visual language.
- Heavy bloom shadows, animated glowing borders, and pulsing neon gradients.

**Prefer:**

- High-contrast typography and clear hierarchy.
- Subtle depth (border, soft shadow, glass) and restrained gradients.
- Technical motifs that look like engineering artifacts (schematics, system diagrams).

### Motion Rules (Subtle by Default)

- Motion should communicate **flow, state, or progress**, not decoration.
- Prefer animations that use `transform` and `opacity`.
- Respect `prefers-reduced-motion: reduce` (disable non-essential motion).
- Keep motion in the background: slow, low-contrast, low-opacity.

## “Glow” Handling (Audit Guidance)

This repo currently contains glow-related styling (e.g., shadow tokens and glow animations in `src/styles/global.css`, and some component-level glow effects).

When producing an inventory:

- **Flag** glow usage as “legacy / to review”
- **Recommend** replacements:
  - Hover affordance via `border` change + slight `translate-y` / `scale`
  - Subtle shadow (non-bloom) + contrast shift
  - Gradient wash at low opacity (only if it remains restrained)

## Positioning: What Visuals Should Prove (MSP/CSP/Dev)

Use visuals to show capability in three executive-friendly pillars:

1. **Operate** (MSP)
   - Monitoring, ticketing, incident response, SLOs/SLAs, compliance posture
   - Dashboards that look like real operational tooling
2. **Scale** (CSP)
   - Hybrid architecture, network topology, global edge, resiliency patterns
   - Maps, infrastructure diagrams, capacity/latency cues
3. **Build** (Dev)
   - Delivery pipeline, modernization roadmap, data/AI systems, integration flows
   - Lifecycle diagrams, orchestration consoles, integration/EDI flows

## Output Template (Recommended)

Use this structure when returning results:

- **Summary**: 3–6 bullets of what asset types exist and what they communicate.
- **Inventory**: grouped by taxonomy category with file/component references.
- **Executive Fit**: what reads as “credible enterprise” vs “too flashy”.
- **Glow/Neon Flags**: list hotspots and suggested replacements.
- **Recommendations**: 3 tiers (quick wins / medium / high impact).
