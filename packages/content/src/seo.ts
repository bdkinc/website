import { z } from 'zod/v4';
import type { ContentReader } from './reader.ts';
import type { SEO } from './schemas.ts';
import { getSiteRoutes, getPagePaths, type FixedPageKey, type RouteInventory } from './routes.ts';

const seoText = z.string().trim().min(1).regex(/^[^<>\p{Cc}]+$/u).optional().catch(undefined);
const secureImage = z.string().trim().refine((value) => {
  const url = URL.parse(value);
  return /^https:\/\/[^\s\\]+$/i.test(value) &&
    url?.protocol === 'https:' && !url.username && !url.password;
}).optional().catch(undefined);

/** Transport metadata, separate from the generated editorial schema. */
export const blogYoastSeoSchema = z.object({
  title: seoText,
  description: seoText,
  ogTitle: seoText,
  ogDescription: seoText,
  image: secureImage,
});
export type BlogYoastSeo = z.infer<typeof blogYoastSeoSchema>;

const yoastHead = z.object({
  title: seoText,
  description: seoText,
  og_title: seoText,
  og_description: seoText,
  // Yoast's image presenter exposes URL, dimensions and MIME type, not alt.
  og_image: z.array(z.object({ url: secureImage }).nullable().catch(null)).optional().catch(undefined),
});

export function parseBlogYoastSeo(
  value: unknown,
  wordpressHostname: string
): BlogYoastSeo | undefined {
  const parsed = yoastHead.safeParse(value);
  if (!parsed.success) return undefined;
  const hostnameKey = (host: string) => host.replace(/^www\./, '').replace(/\.$/, '');
  const cmsHost = hostnameKey(wordpressHostname);
  const isCmsOrAdminUrl = (url: URL) => {
    if (hostnameKey(url.hostname) === cmsHost) return true;
    let path = url.pathname;
    try { path = decodeURIComponent(path); } catch { /* Check the raw path if malformed. */ }
    return /\/(?:wp-admin|wp-login\.php|wp-json)(?:\/|$)/i.test(path);
  };
  const publicText = (text: string | undefined) => {
    if (!text) return undefined;
    for (const [link] of text.matchAll(/(?:https?:)?\/\/[^\s"'“”‘’<>(),;?#]+/gi)) {
      const url = URL.parse(link.replace(/[.!]+$/, ''), 'https://example.invalid');
      if (url && isCmsOrAdminUrl(url)) return undefined;
    }
    return text;
  };
  const title = publicText(parsed.data.title);
  const description = publicText(parsed.data.description);
  const ogTitle = publicText(parsed.data.og_title);
  const ogDescription = publicText(parsed.data.og_description);
  const image = parsed.data.og_image?.find((item) => item?.url && !isCmsOrAdminUrl(new URL(item.url)));
  if (!title && !description && !ogTitle && !ogDescription && !image) return undefined;
  return { title, description, ogTitle, ogDescription, image: image?.url };
}

/** Only public blog detail pages supply Yoast; explicit editorial overrides still win. */
export function resolvePageMetadata(
  editorial: SEO,
  defaults: Required<BlogYoastSeo>,
  yoast?: BlogYoastSeo
): Required<BlogYoastSeo> {
  return {
    title: editorial.title || yoast?.title || defaults.title,
    description: editorial.description || yoast?.description || defaults.description,
    ogTitle: editorial.title || yoast?.ogTitle || defaults.ogTitle,
    ogDescription: editorial.description || yoast?.ogDescription || defaults.ogDescription,
    image: editorial.image || yoast?.image || defaults.image,
  };
}

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

export async function getRouteSeo(reader: ContentReader, requestPath: string, inventory: RouteInventory = 'default'): Promise<SEO> {
  // Lookup key only: directory-style URLs end in a slash, registry and sitemap paths do not.
  const publicPath = requestPath.replace(/\/+$/, '') || '/';
  for (const [key, path] of Object.entries(getPagePaths(inventory))) {
    if (path === publicPath) return mergeSeo([pageSeo(await reader.getPage(key as FixedPageKey))]);
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

export async function getNoindexPaths(reader: ContentReader, inventory: RouteInventory = 'default'): Promise<Set<string>> {
  const flags = new Map<string, Set<string>>();
  const [routes, fixed, serviceRecipe, industryRecipe] = await Promise.all([
    getSiteRoutes({
      async getCollection(key) {
        const entries = await reader.getCollection(key);
        flags.set(key, new Set(entries.filter(entry => 'seo' in entry.data && entry.data.seo?.noindex === true).map(entry => entry.id)));
        return entries;
      },
    }, inventory),
    Promise.all(Object.keys(getPagePaths(inventory)).map(async key => {
      const pageKey = key as FixedPageKey;
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
