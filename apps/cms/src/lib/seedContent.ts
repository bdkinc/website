import type { Payload } from 'payload';

interface SeedPageInput {
  slug: string;
  title: string;
  heroHeading: string;
  heroBody: string;
  seoTitle: string;
  seoDescription: string;
}

const defaultAboutValues = [
  {
    icon: 'Target',
    title: 'Client-Focused',
    description:
      'Your strategic goals define our technical roadmap. We engineer solutions that directly drive your business outcomes.',
  },
  {
    icon: 'Lightbulb',
    title: 'Innovation',
    description:
      'We constantly evaluate emerging technologies to bring you proven, high-impact advancements.',
  },
  {
    icon: 'Shield',
    title: 'Reliability',
    description:
      '25+ years of steadfast stability. We build systems designed for maximum uptime and resilience.',
  },
  {
    icon: 'Users',
    title: 'Partnership',
    description:
      'We operate as an extension of your leadership team, invested in your long-term success.',
  },
  {
    icon: 'Award',
    title: 'Excellence',
    description:
      'We hold ourselves to premier standards of technical precision and operational discipline.',
  },
  {
    icon: 'Clock',
    title: '24/7 Support',
    description:
      'Unrelenting vigilance. Our expert team ensures your infrastructure never sleeps.',
  },
];

const defaultAboutMilestones = [
  {
    year: '1999',
    title: 'Foundation of Excellence',
    description:
      'Established with a focused commitment to IBM Power Systems and specialized software solutions.',
  },
  {
    year: '2005',
    title: 'Growth & Expansion',
    description:
      'Opened multiple office locations and expanded service offerings to include enterprise Networking and Windows Server support.',
  },
  {
    year: '2010',
    title: 'Cloud Hosting',
    description:
      'Launched comprehensive hosting services for IBM Power, Windows, and Linux environments.',
  },
  {
    year: '2015',
    title: 'Infrastructure & Analytics',
    description:
      'Extended reach to multiple datacenters while enhancing software solutions with advanced analytics and integration capabilities.',
  },
  {
    year: '2018',
    title: 'Public Cloud Integration',
    description:
      'Forged strategic integrations with major public cloud vendors including Azure, Google Cloud, and Cloudflare.',
  },
  {
    year: '2022',
    title: 'Premier Partnership',
    description:
      'Solidified status as a premier IT solutions partner capable of serving businesses of any size with enterprise-grade support.',
  },
  {
    year: '2025',
    title: 'AI & Innovation',
    description:
      'Pioneering the future as a specialized IBM watsonx solutions expert, driving enterprise AI adoption.',
  },
];

async function ensurePage(payload: Payload, page: SeedPageInput) {
  const existing = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: page.slug,
      },
    },
    limit: 1,
    depth: 0,
  });

  if (existing.docs.length > 0) {
    return;
  }

  await payload.create({
    collection: 'pages',
    data: {
      title: page.title,
      slug: page.slug,
      heroHeading: page.heroHeading,
      heroBody: page.heroBody,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      _status: 'published',
    },
  });
}

export async function ensureInitialContent(payload: Payload) {
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
  });

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: siteSettings.siteName || 'BDKinc',
      primaryCTA: siteSettings.primaryCTA || 'Partner with Us',
      primaryCTALink: siteSettings.primaryCTALink || '/contact',
    },
  });

  await ensurePage(payload, {
    slug: 'home',
    title: 'Home',
    heroHeading: 'IT Made Simple',
    heroBody:
      'The premier technology partner for growth-focused organizations. We deliver Managed IT, Cloud Solutions, and Custom Software with enterprise-grade expertise.',
    seoTitle: 'Premier Managed IT Services & Cloud Hosting | BDKinc',
    seoDescription:
      'IT Made Simple - Your trusted technology partner for managed IT services, cloud hosting, and cybersecurity solutions.',
  });

  await ensurePage(payload, {
    slug: 'about',
    title: 'About BDKinc',
    heroHeading: 'Partners in Your Potential',
    heroBody:
      'More than a vendor. We are the strategic extension of your team - bringing clarity, discipline, and engineering depth to every decision.',
    seoTitle: 'About BDKinc | Enterprise Technology Partner',
    seoDescription:
      "Discover BDKinc's 25-year evolution into a premier technology partner. Deep expertise in IBM, Microsoft, Cisco, and Lenovo solutions for enterprise-grade growth.",
  });

  const aboutPage = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'about',
      },
    },
    limit: 1,
    depth: 0,
  });

  const aboutDoc = aboutPage.docs[0];

  if (!aboutDoc) {
    return;
  }

  await payload.update({
    collection: 'pages',
    id: aboutDoc.id,
    data: {
      aboutValuesHeading: aboutDoc.aboutValuesHeading || 'Our Values',
      aboutValuesSubheading:
        aboutDoc.aboutValuesSubheading ||
        'The principles that guide our premier standards',
      aboutJourneyHeading: aboutDoc.aboutJourneyHeading || 'Our Journey',
      aboutJourneySubheading:
        aboutDoc.aboutJourneySubheading ||
        'A legacy of innovation and excellence',
      aboutCTATitle:
        aboutDoc.aboutCTATitle || 'Partner with Engineers Who Own Outcomes',
      aboutCTADescription:
        aboutDoc.aboutCTADescription ||
        'Bring clarity, resilience, and speed to mission-critical IT. Tap 25+ years of infrastructure, security, and modernization expertise.',
      aboutCTAButtonText: aboutDoc.aboutCTAButtonText || 'Talk to an Engineer',
      aboutCTAButtonHref: aboutDoc.aboutCTAButtonHref || '/contact#chat',
      aboutValues:
        aboutDoc.aboutValues && aboutDoc.aboutValues.length > 0
          ? aboutDoc.aboutValues
          : defaultAboutValues,
      aboutMilestones:
        aboutDoc.aboutMilestones && aboutDoc.aboutMilestones.length > 0
          ? aboutDoc.aboutMilestones
          : defaultAboutMilestones,
      _status: 'published',
    },
  });
}
