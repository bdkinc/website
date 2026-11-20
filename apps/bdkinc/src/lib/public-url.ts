import { conceptAPagePaths, pagePaths } from '@bdkinc/content/routes';

export const SITE_ORIGIN = 'https://bdkinc.com';

export function matchPath(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}

export function slashPagePath(pathname: string): string {
  const path = matchPath(pathname);
  return path === '/' ? path : `${path}/`;
}

/** Format a public page URL, not a route match, media URL, or signed preview path. */
export function publicPageUrl(pathOrUrl: string, origin = SITE_ORIGIN): string {
  const url = new URL(pathOrUrl, origin);
  if (url.hostname === 'bdkinc.com' || url.hostname === 'www.bdkinc.com') {
    const canonical = new URL(SITE_ORIGIN);
    canonical.pathname = slashPagePath(url.pathname);
    canonical.search = url.search;
    canonical.hash = url.hash;
    return canonical.href;
  }
  return url.href;
}

export const contactHref = slashPagePath(conceptAPagePaths.contact);

export function isContactPath(pathname: string): boolean {
  const path = matchPath(pathname).toLowerCase();
  return path === conceptAPagePaths.contact || path === pagePaths.contact;
}

const fixedPaths: Readonly<Record<string, string>> = conceptAPagePaths;

export function serviceHref(slug: string): string {
  const legacyPath = `/services/${slug}`;
  const path = fixedPaths[`service-${slug}`];
  // Leave existing cybersecurity links and their alias alone in this cutover.
  return path && path !== legacyPath && slug !== 'cybersecurity'
    ? slashPagePath(path)
    : legacyPath;
}

export function rootServiceSlug(path: string): string | undefined {
  return Object.entries(fixedPaths)
    .find(([key, value]) =>
      key.startsWith('service-') && key !== 'service-cybersecurity' && value === path && !value.startsWith('/services/')
    )
    ?.[0].slice('service-'.length);
}
