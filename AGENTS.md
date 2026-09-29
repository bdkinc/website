# AGENTS.md

## Project Overview
This repo is the corporate presence for an MSP/CSP/Software Provider.

It is an **npm workspaces monorepo** with multiple apps:

- `apps/bdkinc`: Astro marketing site (Astro + React islands). Performance is critical: ship static HTML by default, hydrate only when necessary. Published content comes from headless WordPress; public pages remain static.
- `apps/wp-cms`: Docker-based headless WordPress for fixed copy/media editing.
- `apps/design-editorial` and `apps/design-systems`: Temporary independent light/dark Astro review frontends, not production replacements.
- `apps/bdkcloud`: (Planned) Separate Astro site for BDK Cloud.

Shared packages:

- `packages/content`: Shared Zod schemas, WordPress client, fixed editorial definitions, routes and preview verification. Retained local content is migration input, not a runtime fallback.

- `packages/design-system`: Shared UI primitives and utilities intended for cross-app reuse. Keep changes framework-agnostic and coordinated with consuming apps.

## Quick Start
- **Package Manager:** `npm`
- **Builds:** Do **NOT** run full builds (`npm run build`) without explicit user instruction.
- **Branding:** Adhere strictly to rules in `guides/`.

## Scope by Workspace
- **`apps/bdkinc` work:** Use `guides/agents/*` (UI/UX, tech stack, conventions, workflow) as primary implementation guidance.
- **CMS, content or preview work:** Read [WordPress setup/authoring](apps/wp-cms/README.md) and [shared content contracts](packages/content/README.md). Structure, icons, routes and layouts remain developer-owned.
- **Deployment work:** Read [Dokploy + Traefik](guides/deployment/dokploy-traefik.md); production configuration and deployment are not completed by the local migration.
- **`packages/design-system` work:** Treat as shared package code; preserve stable exports and avoid app-specific coupling.

## Developer Guides
Do not rebuild the page for every change. We are actively using Dev mode. 
For specific instructions, refer to the relevant guide (these guides primarily target `apps/bdkinc` unless stated otherwise):

- **[UI & UX Guidelines](guides/agents/ui-ux.md)**
  *Visual identity, specific component patterns, icons, and animation.*

- **[Tech Stack Strategy](guides/agents/tech-stack.md)**
  *Astro hydration rules (`client:` directives) and React integration.*

- **[Code Conventions](guides/agents/conventions.md)**
  *File naming, proper directory structure, and import path aliases.*

- **[Development Workflow](guides/agents/workflow.md)**
  *How to add pages/components and current build protocols.*
