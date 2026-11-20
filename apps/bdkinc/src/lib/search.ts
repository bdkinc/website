// Server-only: builds the public site-search index from the published Concept A routes.
import {
  getReservedAliases,
  getReservedAssetPaths,
  getSiteRoutes,
  getUtilityPaths,
  type SiteRoute,
} from '@bdkinc/content/routes';
import { getNoindexPaths, getRouteSeo } from '@bdkinc/content/seo';
import { blogPostHref } from './public-url';
import type { ContentReader } from '@/lib/content';

/** File routes of the search page and index; registered in editorial concept-a-routes.json. */
export const SEARCH_PATH = '/search';
export const SEARCH_INDEX_PATH = '/search-index.json';

export type SearchKind = SiteRoute['template'];

/** Presentation-only record; every value is plain text, never markup. */
export interface SearchEntry {
  path: string;
  title: string;
  description: string;
  kind: SearchKind;
  keywords?: string;
}

const namedEntities: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
};

/** CMS strings may carry tags or entities; the index ships decoded plain text. */
function plainText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
      if (code[0] !== '#') return namedEntities[code.toLowerCase()] ?? match;
      const point = code[1].toLowerCase() === 'x'
        ? parseInt(code.slice(2), 16)
        : parseInt(code.slice(1), 10);
      return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : match;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

function read(source: unknown, ...path: string[]): string {
  let value = source;
  for (const key of path) {
    if (!value || typeof value !== 'object') return '';
    value = (value as Record<string, unknown>)[key];
  }
  return plainText(value);
}

const compact = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Drop the trailing brand segment ("Contact | BDKinc - Partner" -> "Contact"). */
function withoutBrand(title: string, siteName: string): string {
  const brand = compact(siteName);
  if (!brand) return title;
  const separators = [...title.matchAll(/\s+[|–—-]\s+/g)];
  for (const [index, separator] of separators.entries()) {
    const start = separator.index + separator[0].length;
    const end = separators[index + 1]?.index ?? title.length;
    if (compact(title.slice(start, end)).includes(brand))
      return title.slice(0, separator.index).trim();
  }
  return title;
}

function first(...values: string[]): string {
  return values.find(Boolean) ?? '';
}

/** Hero body fallbacks can be long; keep the lazily fetched index small. */
function clip(value: string, limit = 240): string {
  if (value.length <= limit) return value;
  const cut = value.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : limit).replace(/[\s,.;:–—-]+$/, '')}…`;
}

/**
 * One entry per published, indexable Concept A route. Inventory, canonical paths and
 * noindex decisions come from the shared route/SEO contracts, so route changes flow
 * through without editing this index.
 */
export async function buildSearchIndex(reader: ContentReader): Promise<SearchEntry[]> {
  const [routes, noindex, settings, services, posts] = await Promise.all([
    getSiteRoutes(reader, 'concept-a'),
    getNoindexPaths(reader, 'concept-a'),
    reader.getSettings(),
    reader.getCollection('services'),
    reader.getCollection('blog'),
  ]);
  // Config aliases redirect; CMS redirect sources are validated never to be public paths.
  const excluded = new Set([
    ...noindex,
    ...getReservedAliases('concept-a'),
    ...getUtilityPaths('concept-a'),
    ...getReservedAssetPaths('concept-a'),
  ]);
  const entries = new Map<string, SearchEntry>();

  for (const route of routes) {
    if (excluded.has(route.path) || entries.has(route.path)) continue;
    if (route.template === 'page' && route.pageKey === 'not-found') continue;
    const seo = await getRouteSeo(reader, route.path, 'concept-a');
    const seoTitle = plainText(seo.title);
    const seoDescription = plainText(seo.description);

    if (route.template === 'blog-post') {
      const post = posts.find((entry) => entry.id === route.slug);
      if (!post || post.data.draft) continue;
      entries.set(route.path, {
        path: blogPostHref(route.slug),
        // Layout precedence: explicit SEO fields win over the post's own copy.
        title: withoutBrand(first(seoTitle, plainText(post.data.title)), settings.siteName),
        description: clip(first(seoDescription, plainText(post.data.description))),
        kind: route.template,
        keywords: [post.data.category, ...(post.data.tags ?? [])].map(plainText).join(' '),
      });
      continue;
    }

    let title = seoTitle;
    let description = seoDescription;
    if (route.template === 'page') {
      // Layout precedence: route SEO, then the template's own metadata/service copy, then
      // Layout's settings.defaultDescription (e.g. /blog and /services pass no description).
      // Hero headings are only a last-resort display title, never a description.
      const page = await reader.getPage(route.pageKey);
      const service = services.find((entry) => `service-${entry.id}` === route.pageKey);
      title = first(
        title,
        read(page, 'metadata', 'title'),
        plainText(service?.data.title),
        read(page, 'heading'),
        read(page, 'hero', 'heading'),
        [read(page, 'hero', 'headingLead'), read(page, 'hero', 'headingAccent')].join(' ').trim()
      );
      description = first(
        description,
        read(page, 'metadata', 'description'),
        plainText(service?.data.description)
      );
    }
    title = withoutBrand(title, settings.siteName);
    if (!title) continue;
    entries.set(route.path, {
      path: route.path,
      title,
      description: clip(first(description, plainText(settings.defaultDescription))),
      kind: route.template,
    });
  }
  return [...entries.values()];
}
