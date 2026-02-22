# AGENTS.md

## Scope

This file applies to work under `apps/bdkinc`.

`apps/bdkinc` is the Astro marketing site (Astro + React islands). Prioritize static rendering and hydrate only interactive islands.

## Required Guides

Use these guides as the source of truth for implementation details:

- **[UI & UX Guidelines](../../guides/agents/ui-ux.md)**
  _Visual identity, specific component patterns, icons, and animation._

- **[Tech Stack Strategy](../../guides/agents/tech-stack.md)**
  _Astro hydration rules (`client:` directives) and React integration._

- **[Code Conventions](../../guides/agents/conventions.md)**
  _File naming, proper directory structure, and import path aliases._

- **[Development Workflow](../../guides/agents/workflow.md)**
  _How to add pages/components and current build protocols._

## Guardrails

- **Package Manager:** `npm`
- **Builds:** Do **NOT** run full builds (`npm run build`) without explicit user instruction.
- **Branding:** Adhere to all rules in `../../guides/`.
