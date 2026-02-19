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

interface CMSBlogPost {
  title?: string;
  slug?: string;
  description?: string;
  author?: string;
  publishedAt?: string;
  category?: 'Infrastructure' | 'Security' | 'Development' | 'AI';
  tags?: Array<{
    tag?: string;
  }>;
  image?: string;
  content?: string;
}

interface CMSTestimonial {
  quote?: string;
  author?: string;
  company?: string;
  industry?: string;
  order?: number;
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

export interface BlogPostContent {
  slug: string;
  title: string;
  description: string;
  author: string;
  pubDate: Date;
  category: 'Infrastructure' | 'Security' | 'Development' | 'AI';
  tags: string[];
  image?: string;
  content: string;
}

export interface TestimonialContent {
  quote: string;
  author: string;
  company: string;
  industry: string;
  order: number;
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

export async function getBlogPostsContent(): Promise<BlogPostContent[]> {
  const response = await fetchCMS<CMSPaginatedResponse<CMSBlogPost>>(
    '/blog-posts?limit=100&sort=-publishedAt&depth=0'
  );

  if (!response?.docs?.length) {
    return [];
  }

  return response.docs
    .filter((post) => post.slug && post.title && post.description)
    .map((post) => ({
      slug: post.slug || '',
      title: post.title || '',
      description: post.description || '',
      author: post.author || 'BDKinc',
      pubDate: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      category: post.category || 'Infrastructure',
      tags: (post.tags || [])
        .map((item) => item?.tag)
        .filter((tag): tag is string => Boolean(tag)),
      image: post.image,
      content: post.content || '',
    }));
}

export async function getBlogPostBySlugContent(
  slug: string
): Promise<BlogPostContent | null> {
  const response = await fetchCMS<CMSPaginatedResponse<CMSBlogPost>>(
    `/blog-posts?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`
  );

  const post = response?.docs?.[0];

  if (!post?.slug || !post.title || !post.description) {
    return null;
  }

  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    author: post.author || 'BDKinc',
    pubDate: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    category: post.category || 'Infrastructure',
    tags: (post.tags || [])
      .map((item) => item?.tag)
      .filter((tag): tag is string => Boolean(tag)),
    image: post.image,
    content: post.content || '',
  };
}

export async function getTestimonialsContent(): Promise<TestimonialContent[]> {
  const response = await fetchCMS<CMSPaginatedResponse<CMSTestimonial>>(
    '/testimonials?limit=100&sort=order&depth=0'
  );

  if (!response?.docs?.length) {
    return [];
  }

  return response.docs
    .filter(
      (item) => item.quote && item.author && item.company && item.industry
    )
    .map((item) => ({
      quote: item.quote || '',
      author: item.author || '',
      company: item.company || '',
      industry: item.industry || '',
      order: item.order ?? 0,
    }));
}
