import type { SiteSettings } from '@bdkinc/content';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

const SITE_ORIGIN = 'https://www.bdkinc.com';

export function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return new URL(path, SITE_ORIGIN).toString();
}

export function breadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.item),
    })),
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
