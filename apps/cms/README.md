# BDKinc CMS

Payload CMS service for editable marketing content.

Agent guidance: see [AGENTS.md](./AGENTS.md) for `apps/cms`-scoped implementation instructions.

## Local setup

1. Copy `.env.example` to `.env`.
2. Start MongoDB and make sure `DATABASE_URI` is reachable.
3. Run from repo root:

```bash
npm run dev:cms
```

Quick local MongoDB (Docker Compose from repo root):

```bash
npm run db:up
```

Optional one-time seed:

```bash
npm run seed -w apps/cms
```

One-time admin bootstrap (creates first user only if none exist):

```bash
npm run bootstrap:admin -w apps/cms
```

## Initial content to add

- Create a `pages` document with `slug` set to `home`.
- Fill `heroHeading`, `heroBody`, `seoTitle`, and `seoDescription`.
- Update `site-settings` global for CTA label/link and site name.

The Astro site uses this content on `/` and on `/cms/[slug]`.

## Rebuild triggers

- Automatic: when a `pages` doc is published/updated, or `site-settings` changes.
- Manual: `POST /api/ops/trigger-rebuild` with header `x-cms-ops-secret`.
- For local relay to Astro endpoint, set `SITE_REBUILD_WEBHOOK_URL=http://localhost:4321/api/rebuild` and use matching secret values.

Example manual trigger:

```bash
curl -X POST "http://localhost:3001/api/ops/trigger-rebuild" \
  -H "x-cms-ops-secret: change-me"
```
