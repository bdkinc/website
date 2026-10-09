import type { SiteSettings } from '@bdkinc/content';
import type { Location } from '@bdkinc/content/schemas';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

const SITE_ORIGIN = 'https://www.bdkinc.com';

export function absoluteUrl(pathOrUrl: string, origin = SITE_ORIGIN): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return new URL(path, origin).toString();
}

export function breadcrumbListSchema(
  items: BreadcrumbItem[],
  origin = SITE_ORIGIN
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.item, origin),
    })),
  };
}

/** Keep editable copy from closing an inline JSON-LD script element. */
export function serializeSchema(schema: unknown): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}

export interface LocationPageSchemaOptions {
  type: 'Service' | 'WebPage';
  name: string;
  description: string;
  pagePath: string;
  subject: { title: string; description: string };
  location: Location;
  settings: SiteSettings;
  breadcrumbs: BreadcrumbItem[];
}

export function locationPageSchemas(options: LocationPageSchemaOptions) {
  const {
    type,
    name,
    description,
    pagePath,
    subject,
    location,
    settings,
    breadcrumbs,
  } = options;
  const { organization, contact } = settings;
  const url = absoluteUrl(pagePath, organization.url);
  const provider = {
    '@type': 'Organization',
    '@id': `${absoluteUrl('/', organization.url)}#organization`,
    name: settings.siteName,
    legalName: organization.legalName,
    url: organization.url,
    logo: absoluteUrl(organization.logo, organization.url),
    telephone: contact.telephone,
    email: contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: organization.streetAddress,
      addressLocality: organization.addressLocality,
      addressRegion: organization.addressRegion,
      postalCode: organization.postalCode,
      addressCountry: organization.addressCountry,
    },
    contactPoint: [organization.supportType, organization.salesType].map(
      (contactType) => ({
        '@type': 'ContactPoint',
        contactType,
        telephone: contact.telephone,
        email: contact.email,
        areaServed: organization.areaServed,
        availableLanguage: organization.availableLanguage,
      })
    ),
  };
  // The served community is separate from the provider's actual headquarters.
  const area = {
    '@type': 'City',
    name: location.name,
    containedInPlace: { '@type': 'State', name: location.state },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: location.coordinates.lat,
      longitude: location.coordinates.lng,
    },
  };
  return {
    page: {
      '@context': 'https://schema.org',
      '@type': type,
      '@id': `${url}#${type === 'Service' ? 'service' : 'webpage'}`,
      url,
      name,
      description,
      ...(type === 'Service'
        ? { serviceType: subject.title, provider, areaServed: area }
        : {
            publisher: provider,
            about: {
              '@type': 'Thing',
              name: subject.title,
              description: subject.description,
            },
            spatialCoverage: area,
          }),
    },
    breadcrumb: breadcrumbListSchema(breadcrumbs, organization.url),
  };
}

export function faqPageSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function servicePageSchemas(options: {
  serviceName: string;
  servicePath: string;
  faqs: FAQItem[];
  copy: Pick<SiteSettings['navigation'], 'home' | 'services'>;
}) {
  const { serviceName, servicePath, faqs, copy } = options;

  return {
    breadcrumb: breadcrumbListSchema([
      { name: copy.home, item: '/' },
      { name: copy.services, item: '/services' },
      { name: serviceName, item: servicePath },
    ]),
    faq: faqPageSchema(faqs),
  };
}
