# BDKinc Monorepo

This repository is organized as an npm workspaces monorepo.

## Workspaces

- `apps/bdkinc` - Astro marketing site for BDKinc.
- `apps/bdkcloud` - (Planned) Separate Astro site for BDK Cloud.
- `packages/design-system` - Shared UI/design-system package scaffold.

## Getting Started

Install dependencies at repo root:

```bash
npm install
```

Run the BDKinc website:

```bash
npm run dev
```

Content is managed as local Astro content collections under `apps/bdkinc/src/content/`.

## Useful Commands

- `npm run dev` / `npm run dev:site` - Start Astro site (`apps/bdkinc`).
- `npm run build` - Build the Astro site.
- `npm run preview` - Preview the production build.
- `npm run lint` - Run lint across all workspaces with scripts.
- `npm run format` - Run formatting across all workspaces with scripts.

## Deployment

- Dokploy + Traefik guide: `guides/deployment/dokploy-traefik.md`
