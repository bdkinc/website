# Marketing and SEO setup

The main site emits CMS titles/descriptions, canonical URLs, Open Graph/Twitter tags and optional noindex. Service/location pages include Service and BreadcrumbList JSON-LD; industry/location pages include WebPage and BreadcrumbList. The organization remains the real headquarters, separate from the served community. Social sharing defaults to the included 1200 × 630 PNG at `/images/social/bdkinc.png` when the old site-wide favicon default is still configured. Explicit page image overrides are preserved.

## Campaign landing page

`/campaigns/it-consultation` is a static, focused consultation page. Its labeled copy is the **Campaign: IT consultation** WordPress marketing record. It uses the same shared route inventory and authenticated preview as other fixed pages, including both temporary review frontends. The migrated canonical inventory is now 588 paths: the prior 587 plus this campaign route.

It defaults to noindex and is excluded from the generated sitemap. Marketers can deliberately clear noindex after reviewing its organic-search role. Its contact links carry campaign/source context. Query parameters do not change the canonical URL. This is a consultation invitation, with no invented price, discount or response-time guarantee.

The main `/contact` page preserves the conversational interface and actual phone/email links. Until live AI is connected it is explicitly labeled a conversation preview, with replies that do not claim delivery, routing or staff notification. Autotask CRM integration and automated lead capture are deferred at the user's request. No backend endpoint or credentials for CRM intake are included. Temporary review-app chats remain design demonstrations.

## Google Analytics 4

1. Supply the actual GA4 measurement ID (`G-…`) as `BDK_GA4_ID` at build time. The Dockerfile exposes the same build argument. Configure it at runtime as well for the server-rendered contact page. Example configuration is in `apps/bdkinc/.env.example`.
2. In the GA4 web stream, turn **enhanced measurement off** for this integration, including automatic history/page views, form interactions and outbound clicks. The site sends its own page views on Astro navigation and contact-click events. Automatic events can duplicate counts or bypass the site's query scrubbing.
3. Verify in DebugView/realtime using your actual property after deployment. Page views send path plus identifier-style `utm_source`, `utm_medium`, `utm_campaign` only; arbitrary query strings, referrers and contact details are excluded. Ads storage/personalization remain denied. No event claims a completed lead conversion: `contact_click` means a phone link, email link or contact-page link was clicked.
4. Visitors must allow analytics before the Google tag loads. They can decline or reopen **Analytics preferences** and withdraw consent. Preview routes and ordinary dev mode do not load it. For controlled local UI testing only, set `BDK_ANALYTICS_DEV=true` alongside a measurement ID; do not use production traffic as test data.

Google configuration references: [page-view measurement](https://developers.google.com/analytics/devguides/collection/ga4/views), [consent setup](https://developers.google.com/tag-platform/security/guides/consent).

## Publication and checks

New fixed CMS records are seeded as drafts with validated copy before first publication. An interruption between draft creation and publication leaves a draft: inspect it and publish deliberately in WordPress. Routine reruns preserve existing drafts and edits. Additive migrations remain explicit and missing-only.

Scoped verification commands:

```sh
npm run test:marketing -w apps/bdkinc
npm run exercise:collections -w packages/content
npm run check -w packages/content
npm run check -w apps/bdkinc
```

Dev checks can verify HTML metadata, structured data, the campaign route, contact links, image delivery and noindex selection. They do not certify a production sitemap/build, actual GA account receipt, search indexing, redirects behind the deployed adapter, or CMS publication-to-live completion. Search Console verification and sitemap submission must be completed in the site's real account.

Production publication still needs the real host hook and completion callback sender described in [the deployment guide](deployment/dokploy-traefik.md). Keep the Node backend private and have Traefik overwrite forwarded host/protocol/client-address headers; Astro trusts only the configured public HTTPS hosts. No full build or production deployment is performed by these changes.
