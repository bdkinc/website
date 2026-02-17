interface CMSPaginatedResponse<T> {
  docs: T[];
}

interface CMSPage {
  title: string;
  slug: string;
  heroHeading?: string;
  heroBody?: string;
  seoTitle?: string;
  seoDescription?: string;
  aboutValuesHeading?: string;
  aboutValuesSubheading?: string;
  aboutValues?: Array<{
    icon?: string;
    title?: string;
    description?: string;
  }>;
  aboutJourneyHeading?: string;
  aboutJourneySubheading?: string;
  aboutMilestones?: Array<{
    year?: string;
    title?: string;
    description?: string;
  }>;
  aboutCTATitle?: string;
  aboutCTADescription?: string;
  aboutCTAButtonText?: string;
  aboutCTAButtonHref?: string;
}

interface CMSSiteSettings {
  siteName?: string;
  primaryCTA?: string;
  primaryCTALink?: string;
}

export interface HomePageContent {
  heroHeading?: string;
  heroBody?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CMSPageContent {
  title: string;
  slug: string;
  heroHeading?: string;
  heroBody?: string;
  seoTitle?: string;
  seoDescription?: string;
  aboutValuesHeading?: string;
  aboutValuesSubheading?: string;
  aboutValues?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  aboutJourneyHeading?: string;
  aboutJourneySubheading?: string;
  aboutMilestones?: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  aboutCTATitle?: string;
  aboutCTADescription?: string;
  aboutCTAButtonText?: string;
  aboutCTAButtonHref?: string;
}

export interface SiteSettingsContent {
  siteName: string;
  primaryCTA: string;
  primaryCTALink: string;
}

const CMS_URL = (process.env.CMS_URL ?? 'http://localhost:3001').replace(
  /\/$/,
  ''
);
const CMS_API_URL = `${CMS_URL}/api`;

async function fetchCMS<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${CMS_API_URL}${path}`);

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getHomePageContent(): Promise<HomePageContent> {
  const response = await fetchCMS<CMSPaginatedResponse<CMSPage>>(
    '/pages?where[slug][equals]=home&limit=1&depth=0'
  );

  const page = response?.docs?.[0];

  return {
    heroHeading: page?.heroHeading,
    heroBody: page?.heroBody,
    seoTitle: page?.seoTitle,
    seoDescription: page?.seoDescription,
  };
}

export async function getSiteSettingsContent(): Promise<SiteSettingsContent> {
  const response = await fetchCMS<CMSSiteSettings>(
    '/globals/site-settings?depth=0'
  );

  return {
    siteName: response?.siteName || 'BDKinc',
    primaryCTA: response?.primaryCTA || 'Partner with Us',
    primaryCTALink: response?.primaryCTALink || '/contact',
  };
}

export async function getPageBySlug(
  slug: string
): Promise<CMSPageContent | null> {
  const response = await fetchCMS<CMSPaginatedResponse<CMSPage>>(
    `/pages?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`
  );

  const page = response?.docs?.[0];

  if (!page) {
    return null;
  }

  return {
    title: page.title,
    slug: page.slug,
    heroHeading: page.heroHeading,
    heroBody: page.heroBody,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    aboutValuesHeading: page.aboutValuesHeading,
    aboutValuesSubheading: page.aboutValuesSubheading,
    aboutValues: (page.aboutValues || [])
      .filter((item) => item?.icon && item?.title && item?.description)
      .map((item) => ({
        icon: item.icon || 'Target',
        title: item.title || '',
        description: item.description || '',
      })),
    aboutJourneyHeading: page.aboutJourneyHeading,
    aboutJourneySubheading: page.aboutJourneySubheading,
    aboutMilestones: (page.aboutMilestones || [])
      .filter((item) => item?.year && item?.title && item?.description)
      .map((item) => ({
        year: item.year || '',
        title: item.title || '',
        description: item.description || '',
      })),
    aboutCTATitle: page.aboutCTATitle,
    aboutCTADescription: page.aboutCTADescription,
    aboutCTAButtonText: page.aboutCTAButtonText,
    aboutCTAButtonHref: page.aboutCTAButtonHref,
  };
}
