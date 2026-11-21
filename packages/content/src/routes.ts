import fixedPaths from '../editorial/routes.json' with { type: 'json' };
import conceptA from '../editorial/concept-a-routes.json' with { type: 'json' };
import type { ContentReader } from './reader.ts';

/** Shared default inventory (review concepts). Concept A selects its delta explicitly. */
export const pagePaths = fixedPaths;
/** Concept A (current site): shared paths plus its developer-owned route delta. */
export const conceptAPagePaths = { ...fixedPaths, ...conceptA.routes };
/** Shared keys Concept A retires (A-only): records stay for the default inventory; their paths become content aliases. */
const conceptAExcludedKeys: ReadonlySet<string> = new Set(conceptA.excludedSharedKeys);
const conceptAPublicPagePaths: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(conceptAPagePaths).filter(([key]) => !conceptAExcludedKeys.has(key))
);
const conceptARetiredSources: ReadonlySet<string> = new Set(
  [...conceptAExcludedKeys].map(key => (fixedPaths as Record<string, string>)[key])
);
/** Developer-owned Concept A aliases: reserved as CMS sources; never canonical pages. */
export const conceptAAliases: Readonly<Record<string, string>> = conceptA.aliases;
export const conceptABlogPaths: Readonly<Partial<Record<string, string>>> = conceptA.blogPaths;

// Root [slug] routes must not take over an existing page, namespace or alias.
function validateConceptABlogPaths(): void {
  const reservedSegments = new Set([
    ...[
      ...Object.values(conceptAPagePaths),
      ...Object.keys(conceptAAliases),
      ...conceptA.utilityPaths,
      ...conceptA.reservedPaths,
    ].map(path => path.split('/')[1].toLowerCase()),
    ...conceptA.blogReservedRootSegments,
  ]);
  for (const [slug, path] of Object.entries(conceptA.blogPaths)) {
    if (!/^[a-z0-9_-]+$/.test(slug) || !/^\/[a-z0-9_-]+$/.test(path))
      throw new Error(`Invalid Concept A root blog route: ${slug} -> ${path}`);
    const segment = path.slice(1);
    if (reservedSegments.has(segment))
      throw new Error(`Colliding Concept A root blog route: ${slug} -> ${path}`);
    reservedSegments.add(segment);
  }
}
validateConceptABlogPaths();
const ibmPowerSolutionsPath = conceptAPagePaths['ibm-power-solutions'];
const conceptARootBlogPaths = new Set<string>(Object.values(conceptA.blogPaths));
const cmsAliasTargets = new Set([ibmPowerSolutionsPath, ...conceptARootBlogPaths]);
/** These Concept A aliases need a publication check and an exact HTTP status. */
export const conceptAContentAliases = new Set(
  Object.entries(conceptAAliases).filter(([source, target]) => cmsAliasTargets.has(target) || conceptARetiredSources.has(source)).map(([source]) => source)
);
export type RouteInventory = 'default' | 'concept-a';
export function isBlogSlugInInventory(slug: string, inventory: RouteInventory = 'default'): boolean {
  return inventory === 'concept-a' || !Object.hasOwn(conceptABlogPaths, slug);
}
export function blogPublicPath(slug: string, inventory: RouteInventory = 'default'): string {
  return inventory === 'concept-a' && Object.hasOwn(conceptABlogPaths, slug)
    ? conceptABlogPaths[slug]!
    : `/blog/${slug}`;
}
export function blogSlugForPath(path: string, inventory: RouteInventory = 'default'): string | undefined {
  const override = inventory === 'concept-a'
    ? Object.entries(conceptABlogPaths).find(([, candidate]) => candidate === path)?.[0]
    : undefined;
  const slug = override ?? /^\/blog\/([^/]+)$/.exec(path)?.[1];
  return slug && isBlogSlugInInventory(slug, inventory) && blogPublicPath(slug, inventory) === path ? slug : undefined;
}
export type FixedPageKey = keyof typeof conceptAPagePaths;
export function getPagePaths(inventory: RouteInventory = 'default'): Readonly<Record<string, string>> {
  return inventory === 'concept-a' ? conceptAPublicPagePaths : pagePaths;
}
// A retired shared key must be a shared-only page whose path is an alias to a live Concept A page.
for (const key of conceptAExcludedKeys) {
  const source = (fixedPaths as Record<string, string>)[key];
  const target = source === undefined ? undefined : conceptAAliases[source];
  if (!source || Object.hasOwn(conceptA.routes, key) || !target || !Object.values(conceptAPublicPagePaths).includes(target))
    throw new Error(`Invalid Concept A retired shared page: ${key}`);
}
export function getReservedAliases(inventory: RouteInventory = 'default'): string[] {
  return inventory === 'concept-a' ? Object.keys(conceptAAliases) : [];
}
/** Code-owned public pages with no CMS record or preview target (Concept A /search): redirect terminals, never sources. */
export function getUtilityPaths(inventory: RouteInventory = 'default'): string[] {
  return inventory === 'concept-a' ? [...conceptA.utilityPaths] : [];
}
/** Code-owned non-page assets (Concept A /search-index.json): never redirect sources or targets. */
export function getReservedAssetPaths(inventory: RouteInventory = 'default'): string[] {
  return inventory === 'concept-a' ? [...conceptA.reservedPaths] : [];
}
/** Select only from the signed grant's preview target; `current` is Concept A. */
export function inventoryForPreviewTarget(previewTarget = 'current'): RouteInventory {
  return previewTarget === 'current' ? 'concept-a' : 'default';
}
export type SiteRoute =
  | { path: string; template: 'page'; pageKey: FixedPageKey }
  | { path: string; template: 'blog-post'; slug: string }
  | { path: string; template: 'service-location'; serviceSlug: string; locationSlug: string; locationId: string; collectionKey: 'services' | 'pseoServices' }
  | { path: string; template: 'industry-location'; industrySlug: string; locationSlug: string; locationId: string };
type Client = Pick<ContentReader, 'getCollection'> & Partial<Pick<ContentReader, 'getPage'>>;

interface ConceptARootBlogRouteOptions {
  /** Omit unpublished mappings instead of requiring the full manifest. All mapped sources stay reserved. */
  publishedOnly?: boolean;
}

/** Exact static identities; verify publication independently of getSiteRoutes' deduplication. */
export async function getConceptARootBlogRoutes(
  reader: Pick<ContentReader, 'getCollection' | 'getSettings'>,
  { publishedOnly = false }: ConceptARootBlogRouteOptions = {}
): Promise<Extract<SiteRoute, { template: 'blog-post' }>[]> {
  const [posts, settings] = await Promise.all([reader.getCollection('blog'), reader.getSettings()]);
  const redirectSources = new Set(settings.redirects?.map(line => line.split('->')[0].trim().replace(/\/+$/, '')));
  const publishedSlugs = new Set(posts.filter(post => !post.data.draft).map(post => post.id));
  const routes: Extract<SiteRoute, { template: 'blog-post' }>[] = [];
  for (const [slug, path] of Object.entries(conceptA.blogPaths)) {
    if (redirectSources.has(path)) throw new Error(`Concept A root blog route is a redirect source: ${path}`);
    if (!publishedSlugs.has(slug)) {
      if (publishedOnly) continue;
      throw new Error(`Missing published blog post: ${slug}`);
    }
    routes.push({ path, template: 'blog-post', slug });
  }
  return routes;
}

async function hasPublishedIbmPowerSolutions(reader: Pick<ContentReader, 'getPage'>): Promise<boolean> {
  try {
    await reader.getPage('ibm-power-solutions');
    return true;
  } catch {
    // An unavailable catalog must never become a redirect destination.
    return false;
  }
}
/** A retired shared path redirects only once its approved Concept A record is published. */
async function hasPublishedConceptAPage(reader: Pick<ContentReader, 'getPage'>, path: string): Promise<boolean> {
  const key = Object.entries(conceptAPublicPagePaths).find(([, candidate]) => candidate === path)?.[0];
  if (!key) return false;
  try {
    await reader.getPage(key as FixedPageKey);
    return true;
  } catch {
    return false;
  }
}

/** Exact legacy routes must never redirect to an unpublished record. */
export async function getConceptAContentAliasTarget(reader: Pick<ContentReader, 'getCollection' | 'getPage'>, source: string): Promise<string | undefined> {
  if (!conceptAContentAliases.has(source)) return undefined;
  const target = conceptAAliases[source];
  const slug = blogSlugForPath(target, 'concept-a');
  const published = slug
    ? (await reader.getCollection('blog')).some(post => post.id === slug && !post.data.draft)
    : conceptARetiredSources.has(source)
      ? await hasPublishedConceptAPage(reader, target)
      : target === ibmPowerSolutionsPath && await hasPublishedIbmPowerSolutions(reader);
  return published ? target : undefined;
}

/** Validate public aliases without adding routes or flattening their direct targets. */
export function parseRedirects(lines: readonly string[], publicPaths: Iterable<string>, reservedPaths: Iterable<string> = [], assetPaths: Iterable<string> = [], inventory: RouteInventory = 'default'): Map<string, string> {
  const assets = new Set(Array.from(assetPaths, path => path.replace(/\/+$/, '') || '/'));
  function normalize(value: string): string {
    const path = value.trim().replace(/\/+$/, '') || (value.trim() === '/' ? '/' : '');
    if (value.trim().includes('//') || !/^\/(?:[a-z0-9._~-]+(?:\/[a-z0-9._~-]+)*)?$/i.test(path) || assets.has(path)
      || path.split('/').some(segment => segment === '.' || segment === '..')
      || /^\/(?:preview|api|_astro|404|wp-admin|wp-json|wp-content|wp-includes)(?:\/|$)/i.test(path)
      || /^\/wp-[^/]*\.php(?:\/|$)/i.test(path)) {
      throw new Error(`Invalid redirect path: ${value}`);
    }
    return path;
  }
  const canonical = new Set(Array.from(publicPaths, path => path === '/' ? '/' : path.replace(/\/+$/, '')));
  const reserved = new Set(Array.from(reservedPaths, path => path.replace(/\/+$/, '') || '/'));
  const redirects = new Map<string, string>();
  for (const line of lines) {
    const parts = line.split('->');
    if (parts.length !== 2) throw new Error(`Invalid redirect pair: ${line}`);
    const source = normalize(parts[0]);
    const target = normalize(parts[1]);
    if (source === target) throw new Error(`Self redirect: ${source}`);
    if (redirects.has(source)) throw new Error(`Duplicate redirect source: ${source}`);
    // Concept A owns these source paths before their posts are published; that does not make them targets.
    if (canonical.has(source) || (inventory === 'concept-a' && conceptARootBlogPaths.has(source)))
      throw new Error(`Redirect source is a public path: ${source}`);
    if (reserved.has(source)) throw new Error(`Redirect source is a reserved alias: ${source}`);
    redirects.set(source, target);
  }
  for (const source of redirects.keys()) {
    const seen = new Set<string>();
    let target = source;
    while (redirects.has(target)) {
      if (seen.has(target)) throw new Error(`Redirect loop: ${source}`);
      seen.add(target);
      target = redirects.get(target)!;
    }
    const reservedTarget = reserved.has(target) && (!conceptAContentAliases.has(target) || canonical.has(conceptAAliases[target]));
    if (!canonical.has(target) && !reservedTarget) throw new Error(`Redirect target is not a public path: ${target}`);
  }
  return redirects;
}

/** Published routes only. Main services win a duplicate service/PSEO slug, as in source order. */
export async function getSiteRoutes(client: Client, inventory: RouteInventory = 'default'): Promise<SiteRoute[]> {
  const [services, pseoServices, industries, locations, posts] = await Promise.all([
    client.getCollection('services'), client.getCollection('pseoServices'),
    client.getCollection('pseoIndustries'), client.getCollection('locations'), client.getCollection('blog'),
  ]);
  const hasIbmPage = inventory !== 'concept-a' || !client.getPage
    || await hasPublishedIbmPowerSolutions({ getPage: client.getPage.bind(client) });
  const routes: SiteRoute[] = Object.entries(getPagePaths(inventory))
    .filter(([, path]) => hasIbmPage || path !== ibmPowerSolutionsPath)
    .map(([pageKey, path]) => ({ path, template: 'page', pageKey: pageKey as FixedPageKey }));
  for (const post of posts) {
    if (isBlogSlugInInventory(post.id, inventory))
      routes.push({ path: blogPublicPath(post.id, inventory), template: 'blog-post', slug: post.id });
  }
  for (const location of locations) {
    const locationSlug = location.id;
    for (const [collectionKey, entries] of [['services', services], ['pseoServices', pseoServices]] as const)
      for (const service of entries) routes.push({ path: `/services/${service.id}/${locationSlug}`, template: 'service-location', serviceSlug: service.id, locationSlug, locationId: location.id, collectionKey });
    for (const industry of industries) routes.push({ path: `/industries/${industry.id}/${locationSlug}`, template: 'industry-location', industrySlug: industry.id, locationSlug, locationId: location.id });
  }
  return [...new Map(routes.reverse().map(route => [route.path, route])).values()].reverse();
}

/** Select only a route that actually exists, using immutable record identity, never editable aliases. */
export function getPreviewRoute(routes: SiteRoute[], target: { kind: 'page' | 'collection' | 'settings'; key: string; previewTarget?: string }, snapshot: { slug: string; bdk_data: Record<string, unknown> }): SiteRoute | undefined {
  if (target.kind === 'settings') return target.key === 'site' ? routes.find(r => r.path === '/') : undefined;
  if (target.kind === 'page') {
    if (target.key === 'service-location' || target.key === 'industry-location') return routes.find(r => r.template === target.key);
    // Like blog drafts, the fixed IBM child can preview before its first publication.
    if (target.key === 'ibm-power-solutions' && inventoryForPreviewTarget(target.previewTarget) === 'concept-a') {
      return { path: ibmPowerSolutionsPath, template: 'page', pageKey: target.key };
    }
    return routes.find(r => r.template === 'page' && r.pageKey === target.key);
  }
  switch (target.key) {
    case 'testimonials': case 'partners': return routes.find(r => r.path === '/');
    // A draft blog post may have no published route yet.
    case 'blog': {
      const inventory = inventoryForPreviewTarget(target.previewTarget);
      return /^[a-z0-9_-]+$/i.test(snapshot.slug) && isBlogSlugInInventory(snapshot.slug, inventory)
        ? { path: blogPublicPath(snapshot.slug, inventory), template: 'blog-post', slug: snapshot.slug }
        : undefined;
    }
    // A main service previews its fixed page in the selected inventory (e.g. /managed-cybersecurity on Concept A).
    case 'services': return routes.find(r => r.template === 'page' && r.pageKey === `service-${snapshot.slug}`);
    case 'locations': return routes.find(r => r.template === 'service-location' && r.locationId === snapshot.slug);
    case 'pseoServices': return routes.find(r => r.template === 'service-location' && r.collectionKey === 'pseoServices' && r.serviceSlug === snapshot.slug);
    case 'pseoIndustries': return routes.find(r => r.template === 'industry-location' && r.industrySlug === snapshot.slug);
  }
}
