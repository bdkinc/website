# AGENTS.md

## Scope
This file applies to work under `apps/cms`.

`apps/cms` is the Payload CMS service (Next.js) used to manage marketing content consumed by the Astro site.

## Required References
Use these as the source of truth for CMS work:

- **[CMS README](./README.md)**
  *Local setup, seed/bootstrap flows, content model basics, and rebuild triggers.*

## Guardrails
- **Package Manager:** `npm`
- **Frameworks:** Follow Payload CMS + Next.js conventions.
- **Isolation:** Do not assume Astro-specific guidance from `guides/agents/*` applies to CMS implementation.
- **Builds:** Do **NOT** run full monorepo builds (`npm run build`) without explicit user instruction.
- **Content Integration:** Preserve rebuild trigger behavior used by downstream sites.
