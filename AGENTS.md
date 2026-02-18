# AGENTS.md

## Project Overview
This repo is the corporate presence for an MSP/CSP/Software Provider.

It is an **npm workspaces monorepo** with multiple apps:

- `apps/bdkinc`: Astro marketing site (Astro + React islands). Performance is critical: ship static HTML by default, hydrate only when necessary.
- `apps/cms`: Payload CMS service (Next.js) used to manage marketing content.
- `apps/bdkcloud`: (Planned) Separate Astro site for BDK Cloud.

Shared packages:

- `packages/design-system`: Shared UI primitives and utilities intended for cross-app reuse. Keep changes framework-agnostic and coordinated with consuming apps.

## Quick Start
- **Package Manager:** `npm`
- **Builds:** Do **NOT** run full builds (`npm run build`) without explicit user instruction.
- **Branding:** Adhere strictly to rules in `guides/`.

## Scope by Workspace
- **`apps/bdkinc` work:** Use `guides/agents/*` (UI/UX, tech stack, conventions, workflow) as primary implementation guidance.
- **`apps/cms` work:** Follow CMS-specific docs in `apps/cms/README.md` and Payload/Next.js conventions; do not assume Astro-specific rules apply.
- **`packages/design-system` work:** Treat as shared package code; preserve stable exports and avoid app-specific coupling.

## Developer Guides
For specific instructions, refer to the relevant guide (these guides primarily target `apps/bdkinc` unless stated otherwise):

- **[UI & UX Guidelines](guides/agents/ui-ux.md)**
  *Visual identity, specific component patterns, icons, and animation.*

- **[Tech Stack Strategy](guides/agents/tech-stack.md)**
  *Astro hydration rules (`client:` directives) and React integration.*

- **[Code Conventions](guides/agents/conventions.md)**
  *File naming, proper directory structure, and import path aliases.*

- **[Development Workflow](guides/agents/workflow.md)**
  *How to add pages/components and current build protocols.*
