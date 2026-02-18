# AGENTS.md

## Scope
This file applies to work under `apps/bdkinc`.

`apps/bdkinc` is the Astro marketing site (Astro + React islands). Prioritize static rendering and hydrate only interactive islands.

## Required Guides
Use these guides as the source of truth for implementation details:

- **[UI & UX Guidelines](../../guides/agents/ui-ux.md)**
  *Visual identity, specific component patterns, icons, and animation.*

- **[Tech Stack Strategy](../../guides/agents/tech-stack.md)**
  *Astro hydration rules (`client:` directives) and React integration.*

- **[Code Conventions](../../guides/agents/conventions.md)**
  *File naming, proper directory structure, and import path aliases.*

- **[Development Workflow](../../guides/agents/workflow.md)**
  *How to add pages/components and current build protocols.*

## Guardrails
- **Package Manager:** `npm`
- **Builds:** Do **NOT** run full builds (`npm run build`) without explicit user instruction.
- **Branding:** Adhere to all rules in `../../guides/`.
