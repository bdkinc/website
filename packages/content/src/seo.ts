import type { ContentReader } from './reader.ts';
import type { SEO } from './schemas.ts';
import { getSiteRoutes, pagePaths } from './routes.ts';

const placeholders = new Set(['serviceTitle', 'industryTitle', 'locationName', 'state', 'region', 'counties']);

/** Interpolate plain text only; Astro remains responsible for escaping output. */
export function interpolateCopy(text: string, values: Partial<Record<'serviceTitle' | 'industryTitle' | 'locationName' | 'state' | 'region' | 'counties', string>>): string {
  return text.replace(/\{([^{}]+)\}/g, (_, key: string) => {
    if (!placeholders.has(key) || !Object.prototype.hasOwnProperty.call(values, key)) {
      throw new Error(`Unsupported page-copy placeholder: {${key}}`);
    }
    return values[key as keyof typeof values]!;
  });
}

function pageSeo(page: { seo?: SEO; metadata?: SEO }): SEO {
  return page.seo ?? page.metadata ?? {};
}

function mergeSeo(groups: (SEO | undefined)[], values?: Parameters<typeof interpolateCopy>[1]): SEO {
  const result: SEO = {};
  for (const group of groups) {
    if (!group) continue;
    for (const key of ['title', 'description', 'image', 'imageAlt'] as const) {
      const value = group[key];
      if (value?.trim()) result[key] = values ? interpolateCopy(value, values) : value;
    }
    if (group.noindex !== undefined) result.noindex = result.noindex === true || group.noindex;
  }
  return result;
}

export async function getRouteSeo(reader: ContentReader, publicPath: string): Promise<SEO> {
  for (const [key, path] of Object.entries(pagePaths)) {
    if (path === publicPath) return mergeSeo([pageSeo(await reader.getPage(key as keyof typeof pagePaths))]);
  }
  const blog = /^\/blog\/([^/]+)$/.exec(publicPath);
  if (blog) return mergeSeo([(await reader.getCollection('blog')).find(post => post.id === blog[1])?.data.seo]);
  const match = /^\/(services|industries)\/([^/]+)\/([^/]+)$/.exec(publicPath);
  if (!match) return {};
  const [, kind, slug, locationId] = match;
  const location = (await reader.getCollection('locations')).find(entry => entry.id === locationId);
  if (!location) return {};
  const record = kind === 'services'
    ? (await reader.getCollection('services')).find(entry => entry.id === slug)
      ?? (await reader.getCollection('pseoServices')).find(entry => entry.id === slug)
    : (await reader.getCollection('pseoIndustries')).find(entry => entry.id === slug);
  if (!record) return {};
  const copy = await reader.getPage(kind === 'services' ? 'service-location' : 'industry-location');
  const values = {
    ...(kind === 'services' ? { serviceTitle: record.data.title } : { industryTitle: record.data.title }),
    locationName: location.data.name, state: location.data.state, region: location.data.region,
    counties: location.data.counties?.join(` ${copy.benefits.regional.countySeparator.trim()} `) || copy.benefits.regional.countyFallback,
  };
  return mergeSeo([copy.metadata, record.data.seo, location.data.seo], values);
}

export async function getNoindexPaths(reader: ContentReader): Promise<Set<string>> {
  const flags = new Map<string, Set<string>>();
  const [routes, fixed, serviceRecipe, industryRecipe] = await Promise.all([
    getSiteRoutes({
      async getCollection(key) {
        const entries = await reader.getCollection(key);
        flags.set(key, new Set(entries.filter(entry => 'seo' in entry.data && entry.data.seo?.noindex === true).map(entry => entry.id)));
        return entries;
      },
    }),
    Promise.all(Object.keys(pagePaths).map(async key => {
      const pageKey = key as keyof typeof pagePaths;
      return [pageKey, pageSeo(await reader.getPage(pageKey)).noindex === true] as const;
    })),
    reader.getPage('service-location'), reader.getPage('industry-location'),
  ]);
  const fixedFlags = new Map(fixed);
  const paths = new Set<string>();
  for (const route of routes) {
    const noindex = route.template === 'page' ? fixedFlags.get(route.pageKey)
      : route.template === 'blog-post' ? flags.get('blog')?.has(route.slug)
      : route.template === 'service-location'
        ? serviceRecipe.metadata.noindex || flags.get(route.collectionKey)?.has(route.serviceSlug) || flags.get('locations')?.has(route.locationId)
        : industryRecipe.metadata.noindex || flags.get('pseoIndustries')?.has(route.industrySlug) || flags.get('locations')?.has(route.locationId);
    if (noindex) paths.add(route.path);
  }
  return paths;
}
