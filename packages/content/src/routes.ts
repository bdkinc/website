import fixedPaths from '../editorial/routes.json' with { type: 'json' };
import type { ContentSource } from './reader.ts';

export const pagePaths = fixedPaths;
export type FixedPageKey = keyof typeof pagePaths;
export type SiteRoute =
  | { path: string; template: 'page'; pageKey: FixedPageKey }
  | { path: string; template: 'blog-post'; slug: string }
  | { path: string; template: 'service-location'; serviceSlug: string; locationSlug: string; locationId: string; collectionKey: 'services' | 'pseoServices' }
  | { path: string; template: 'industry-location'; industrySlug: string; locationSlug: string; locationId: string };
type Client = Pick<ContentSource, 'getCollection'>;

/** Published routes only. Main services win a duplicate service/PSEO slug, as in source order. */
export async function getSiteRoutes(client: Client): Promise<SiteRoute[]> {
  const [services, pseoServices, industries, locations, posts] = await Promise.all([
    client.getCollection('services'), client.getCollection('pseoServices'),
    client.getCollection('pseoIndustries'), client.getCollection('locations'), client.getCollection('blog'),
  ]);
  const routes: SiteRoute[] = Object.entries(pagePaths).map(([pageKey, path]) => ({ path, template: 'page', pageKey: pageKey as FixedPageKey }));
  for (const post of posts) routes.push({ path: `/blog/${post.id}`, template: 'blog-post', slug: post.id });
  for (const location of locations) {
    const locationSlug = location.id;
    for (const [collectionKey, entries] of [['services', services], ['pseoServices', pseoServices]] as const)
      for (const service of entries) routes.push({ path: `/services/${service.id}/${locationSlug}`, template: 'service-location', serviceSlug: service.id, locationSlug, locationId: location.id, collectionKey });
    for (const industry of industries) routes.push({ path: `/industries/${industry.id}/${locationSlug}`, template: 'industry-location', industrySlug: industry.id, locationSlug, locationId: location.id });
  }
  return [...new Map(routes.reverse().map(route => [route.path, route])).values()].reverse();
}

/** Select only a route that actually exists, using immutable record identity, never editable aliases. */
export function getPreviewRoute(routes: SiteRoute[], target: { kind: 'page' | 'collection' | 'settings'; key: string }, snapshot: { slug: string; bdk_data: Record<string, unknown> }): SiteRoute | undefined {
  if (target.kind === 'settings') return target.key === 'site' ? routes.find(r => r.path === '/') : undefined;
  if (target.kind === 'page') {
    if (target.key === 'service-location' || target.key === 'industry-location') return routes.find(r => r.template === target.key);
    return routes.find(r => r.template === 'page' && r.pageKey === target.key);
  }
  switch (target.key) {
    case 'testimonials': case 'partners': return routes.find(r => r.path === '/');
    // A draft blog post may have no published route yet.
    case 'blog': return /^[a-z0-9_-]+$/i.test(snapshot.slug) ? { path: `/blog/${snapshot.slug}`, template: 'blog-post', slug: snapshot.slug } : undefined;
    case 'services': return routes.find(r => r.path === `/services/${snapshot.slug}`);
    case 'locations': return routes.find(r => r.template === 'service-location' && r.locationId === snapshot.slug);
    case 'pseoServices': return routes.find(r => r.template === 'service-location' && r.collectionKey === 'pseoServices' && r.serviceSlug === snapshot.slug);
    case 'pseoIndustries': return routes.find(r => r.template === 'industry-location' && r.industrySlug === snapshot.slug);
  }
}
