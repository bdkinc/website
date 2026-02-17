# Dokploy + Traefik Deployment

This repo is set up to run as two services:

- `apps/cms` (Payload) on port `3001`
- `apps/bdkinc` (Astro Node server) on port `4321`

Use separate Dokploy apps/services so each can redeploy independently.

## Build setup

Use repo root as Docker build context, with these Dockerfile paths:

- CMS: `apps/cms/Dockerfile`
- Website: `apps/bdkinc/Dockerfile`

## Traefik routing

Recommended hostnames:

- CMS: `cms.yourdomain.com`
- Website: `www.yourdomain.com`

Route to internal container ports:

- CMS -> `3001`
- Website -> `4321`

## Required env vars

### CMS service (`apps/cms`)

- `PAYLOAD_SECRET`
- `DATABASE_URI`
- `PAYLOAD_PUBLIC_SERVER_URL` (e.g. `https://cms.yourdomain.com`)
- `FRONTEND_URL` (e.g. `https://www.yourdomain.com`)
- `SITE_REBUILD_WEBHOOK_URL` (e.g. `https://www.yourdomain.com/api/rebuild`)
- `SITE_REBUILD_WEBHOOK_SECRET`
- `CMS_OPS_SECRET`

Optional:

- `SITE_REBUILD_WEBHOOK_SECRET_HEADER` (default `x-rebuild-secret`)
- `SITE_REBUILD_WEBHOOK_TIMEOUT_MS`
- `SEED_ON_INIT=true` (only for initial setup)

### Website service (`apps/bdkinc`)

- `CMS_URL` (e.g. `https://cms.yourdomain.com`)
- `SITE_REBUILD_WEBHOOK_SECRET` (must match CMS value)
- `DEPLOY_REBUILD_WEBHOOK_URL` (Dokploy deploy hook or provider hook)
- `DEPLOY_REBUILD_WEBHOOK_SECRET` (if required by provider)

## Health checks

Use these for Dokploy health probes:

- CMS: `GET /api/ops/health`
- Website: `GET /api/health`

## Rebuild flow

1. Marketing publishes content in Payload.
2. Payload hook calls `SITE_REBUILD_WEBHOOK_URL`.
3. Website endpoint `/api/rebuild` validates `x-rebuild-secret`.
4. Website endpoint forwards to `DEPLOY_REBUILD_WEBHOOK_URL` to trigger a fresh deploy/build.

Manual rebuild trigger from CMS:

```bash
curl -X POST "https://cms.yourdomain.com/api/ops/trigger-rebuild" \
  -H "x-cms-ops-secret: YOUR_SECRET"
```
