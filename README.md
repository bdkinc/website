# BDKinc Monorepo

This repository is organized as an npm workspaces monorepo.

## Workspaces

- `apps/bdkinc` - Astro marketing site for BDKinc.
- `apps/cms` - Payload CMS service (headless + admin).
- `apps/bdkcloud` - (Planned) Separate Astro site for BDK Cloud.
- `packages/design-system` - Shared UI/design-system package scaffold.

## Getting Started

Install dependencies at repo root:

```bash
npm install
```

Start local MongoDB with Docker Compose:

```bash
npm run db:up
```

Run the BDKinc website:

```bash
npm run dev
```

Run the CMS service:

```bash
npm run dev:cms
```

If port `3001` is already in use, you can run CMS on another port:

```bash
CMS_PORT=3002 npm run dev:cms
```

Then set `CMS_URL=http://localhost:3002` in `apps/bdkinc/.env`.

Seed initial CMS content (home/about pages + site settings):

```bash
npm run seed -w apps/cms
```

Create the first CMS admin user:

```bash
npm run bootstrap:admin -w apps/cms
```

## Useful Commands

- `npm run dev:site` - Start Astro site (`apps/bdkinc`).
- `npm run dev:cms` - Start Payload CMS (`apps/cms`).
- `npm run db:up` - Start MongoDB container for CMS.
- `npm run db:logs` - Follow MongoDB logs.
- `npm run db:down` - Stop compose services.
- `npm run lint` - Run lint across all workspaces with scripts.
- `npm run format` - Run formatting across all workspaces with scripts.

## Deployment

- Dokploy + Traefik guide: `guides/deployment/dokploy-traefik.md`

## CMS Environment

Copy `apps/cms/.env.example` to `apps/cms/.env` and set values:

- `PAYLOAD_SECRET`
- `DATABASE_URI`
- `PAYLOAD_PUBLIC_SERVER_URL`
- `FRONTEND_URL`

Copy `apps/bdkinc/.env.example` to `apps/bdkinc/.env` and set:

- `CMS_URL` (defaults to `http://localhost:3001`)
- `SITE_REBUILD_WEBHOOK_SECRET` (must match CMS secret/header setup)
- `DEPLOY_REBUILD_WEBHOOK_URL` (optional relay target to your host rebuild webhook)
