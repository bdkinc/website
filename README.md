# BDKinc Monorepo

This repository is organized as an npm workspaces monorepo.

## Workspaces

- `apps/bdkinc` - Astro marketing site for BDKinc.
- `apps/bdkcloud` - (Planned) Separate Astro site for BDK Cloud.
- `packages/design-system` - Shared UI/design-system package scaffold.

## Getting Started

Use the current default environment with Node/npm versions supported by root `package.json` `engines`. Install dependencies at repo root:

```bash
npm install
```

Run the BDKinc website:

```bash
npm run dev
```

Frontend root scripts delegate through project-local Vite+ (`vp run <workspace>#<script>`) to the apps' Astro scripts. No global CLI installation is required. See [Development Workflow](guides/agents/workflow.md) for setup, failure diagnosis and server ownership.

Content is managed as local Astro content collections under `apps/bdkinc/src/content/`.

## Useful Commands

- `npm run dev` / `npm run dev:site` - Start Astro site (`apps/bdkinc`).
- `npm run dev:editorial` - Start the temporary Editorial review app (4322).
- `npm run dev:systems` - Start the temporary Systems review app (4323).
- `npm run build` - Build the Astro site only with explicit user instruction.
- `npm run preview` - Preview the production build.
- `npm run lint` - Run lint across all workspaces with scripts.
- `npm run format` - Run formatting across all workspaces with scripts.

## Deployment

- Dokploy + Traefik guide: `guides/deployment/dokploy-traefik.md`
