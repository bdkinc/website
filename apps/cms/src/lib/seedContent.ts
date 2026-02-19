import type { Payload } from 'payload';

interface SeedPageInput {
  slug: string;
  title: string;
  heroHeading: string;
  heroBody: string;
  seoTitle: string;
  seoDescription: string;
}

interface SeedBlogPostInput {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  category: 'Infrastructure' | 'Security' | 'Development' | 'AI';
  tags: string[];
  content: string;
}

interface SeedTestimonialInput {
  slug: string;
  quote: string;
  author: string;
  company: string;
  industry: string;
  order: number;
}

type AboutValueIcon =
  | 'Target'
  | 'Lightbulb'
  | 'Shield'
  | 'Users'
  | 'Award'
  | 'Clock';

const defaultAboutValues: Array<{
  icon: AboutValueIcon;
  title: string;
  description: string;
}> = [
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

const defaultBlogPosts: SeedBlogPostInput[] = [
  {
    slug: 'managed-it-services-benefits',
    title: '5 Benefits of Managed IT Services for Small Businesses',
    description:
      'Discover how managed IT services can help small businesses reduce costs, improve security, and focus on growth.',
    publishedAt: '2025-10-20T00:00:00.000Z',
    author: 'BDKinc',
    category: 'Infrastructure',
    tags: ['managed-services', 'business', 'productivity'],
    content: `Small businesses face unique IT challenges. Limited budgets, small teams, and the need to stay competitive make it difficult to maintain robust IT infrastructure. This is where managed IT services shine.

## What Are Managed IT Services?

Managed IT services involve outsourcing your technology needs to a specialized provider who handles everything from network monitoring to cybersecurity, allowing you to focus on your core business.

## Top 5 Benefits

### 1. Predictable Monthly Costs

Say goodbye to surprise IT expenses. Managed services operate on a fixed monthly fee, making budgeting easier and more predictable. No more emergency repair bills or unexpected hardware failures disrupting your cash flow.

### 2. Access to Enterprise-Level Expertise

Gain access to a team of IT professionals with diverse skills and certifications. You get the expertise of an entire IT department for a fraction of the cost of hiring full-time staff.

### 3. Proactive Monitoring and Maintenance

Rather than waiting for systems to fail, managed service providers monitor your infrastructure 24/7, identifying and resolving issues before they impact your business. This proactive approach minimizes downtime and keeps your team productive.

### 4. Enhanced Security

Cybersecurity threats are constantly evolving. Managed IT providers stay current with the latest threats and security best practices, implementing multiple layers of protection including:

- Regular security updates and patches
- Advanced threat detection
- Data backup and disaster recovery
- Employee security training

### 5. Scalability for Growth

As your business grows, your IT needs change. Managed services scale with you, easily adding new users, locations, and capabilities without the complexity of managing it yourself.

## Is Managed IT Right for Your Business?

If you're spending more time dealing with IT issues than growing your business, or if you're concerned about security but lack in-house expertise, managed IT services might be the perfect solution.

## Getting Started

The transition to managed services is easier than you might think. Most providers offer:

- Free initial assessments
- Phased implementation plans
- Comprehensive onboarding and training
- Ongoing support and consultation

Ready to explore how managed IT services can transform your business? Reach out to BDKinc for a consultation.`,
  },
  {
    slug: 'getting-started-with-cloud-security',
    title: 'Getting Started with Cloud Security Best Practices',
    description:
      'Learn essential cloud security practices to protect your business data and infrastructure in the modern cloud environment.',
    publishedAt: '2025-10-15T00:00:00.000Z',
    author: 'BDKinc',
    category: 'Security',
    tags: ['cloud', 'security', 'best-practices'],
    content: `As businesses increasingly migrate to cloud infrastructure, understanding and implementing proper security measures becomes critical. In this guide, we'll explore essential cloud security practices that every organization should adopt.

## Understanding Cloud Security Fundamentals

Cloud security is a shared responsibility between your cloud provider and your organization. While providers like AWS, Azure, and Google Cloud secure the infrastructure, you're responsible for securing your data, applications, and access controls.

### Key Security Principles

1. **Identity and Access Management (IAM)**: Implement the principle of least privilege, ensuring users only have access to resources they absolutely need.

2. **Data Encryption**: Encrypt data both in transit and at rest. Most cloud providers offer built-in encryption services that are easy to enable.

3. **Network Security**: Use virtual private clouds (VPCs), security groups, and network access control lists to segment and protect your resources.

4. **Monitoring and Logging**: Enable comprehensive logging and monitoring to detect and respond to security incidents quickly.

## Implementing Multi-Factor Authentication

Multi-factor authentication (MFA) is one of the most effective security controls you can implement. It adds an additional layer of security beyond just passwords, making it significantly harder for unauthorized users to access your systems.

## Regular Security Audits

Schedule regular security audits to:

- Review access permissions
- Identify unused resources
- Update security policies
- Test incident response procedures

## Conclusion

Cloud security doesn't have to be overwhelming. By implementing these fundamental practices and partnering with experienced IT professionals, you can build a secure and reliable cloud infrastructure.

Need help securing your cloud environment? Contact BDKinc for expert guidance and support.`,
  },
  {
    slug: 'watsonx-orchestrate-for-it-and-ai',
    title: 'Orchestrating IT and AI with WatsonX',
    description:
      'Discover how WatsonX Orchestrate transforms enterprise IT infrastructure and AI operations with intelligent automation and centralized control.',
    publishedAt: '2025-12-31T00:00:00.000Z',
    author: 'BDKinc',
    category: 'AI',
    tags: ['watsonx', 'ai', 'it-automation', 'orchestration'],
    content: `As artificial intelligence continues to reshape enterprise operations, the complexity of managing diverse IT environments has grown exponentially. Organizations are now tasked with overseeing not just traditional infrastructure, but also the lifecycle of AI models, data pipelines, and automated workflows. WatsonX Orchestrate emerges as the solution to bring order to this complexity.

## The Challenge of Modern IT Operations

Traditional IT management tools were designed for static environments. Today, your infrastructure spans on-premises servers, multi-cloud platforms, and edge devices. Simultaneously, AI workloads introduce new variables: model training, inference serving, and prompt management, often in disparate systems.

This fragmentation creates operational bottlenecks:

- **Siloed Workflows**: AI teams and IT teams often work in isolation, leading to redundant efforts.
- **Visibility Gaps**: Without centralized control, identifying performance bottlenecks or security risks becomes reactive rather than proactive.
- **Compliance Complexity**: Meeting regulatory standards across fragmented systems requires manual, error-prone reporting.

## Enter WatsonX Orchestrate

WatsonX Orchestrate provides a unified platform to control both traditional IT assets and AI workloads from a single pane of glass. It bridges the gap between infrastructure automation and model management.

### Key Capabilities

1. **Unified Infrastructure Management**: Orchestrate integrates with your existing cloud providers (AWS, Azure, IBM Cloud) to provide a consistent control layer across environments.

2. **AI Model Lifecycle Governance**: From data ingestion to model deployment, WatsonX tracks lineage, performance, and compliance of your AI models. You know exactly where your data is coming from and how models are making decisions.

3. **Intelligent Automation**: The platform uses AI to automate routine IT tasks: patch management, resource scaling, and anomaly detection, reducing manual intervention by up to 40%.

4. **Prompt Engineering Integration**: For organizations building on LLMs, WatsonX Orchestrate offers built-in tools to manage, version, and deploy prompts securely.

## Benefits for Enterprise Operations

Implementing WatsonX Orchestrate delivers measurable value across your organization.

### Operational Efficiency

By consolidating IT and AI operations, teams can respond to incidents 3x faster. The automation engine handles routine maintenance tasks, freeing your engineers to focus on strategic initiatives rather than keeping the lights on.

### Enhanced Security Posture

WatsonX provides a security fabric that spans your entire technology stack. Automated compliance checks ensure your AI models meet regulatory standards before they reach production, mitigating risk.

### Cost Optimization

With real-time visibility into resource utilization, WatsonX identifies underutilized assets and recommends rightsizing. Enterprises typically report 15-25% reductions in cloud spend within the first year of adoption.

## Getting Started

Adopting an orchestration platform is a strategic decision. Start by identifying your most critical IT and AI workloads. Begin with a pilot program focusing on a single domain, such as AI model governance, and expand from there.

The platform's modular architecture allows you to incrementally integrate new capabilities without disrupting existing operations.

## Conclusion

The future of enterprise IT is automated, intelligent, and unified. WatsonX Orchestrate provides the foundation to transform your operations from reactive management to proactive orchestration.

Ready to modernize your IT and AI workflows? Contact BDKinc for a consultation on implementing WatsonX Orchestrate in your environment.`,
  },
  {
    slug: 'network-infrastructure-upgrade-guide',
    title: 'Is It Time to Upgrade Your Network Infrastructure?',
    description:
      'Signs your business network needs an upgrade and how to plan for a seamless transition to modern infrastructure.',
    publishedAt: '2025-10-25T00:00:00.000Z',
    author: 'BDKinc',
    category: 'Infrastructure',
    tags: ['networking', 'infrastructure', 'upgrades'],
    content: `Your network infrastructure is the backbone of your business operations. When it's outdated or inadequate, every aspect of your business suffers. But how do you know when it's time for an upgrade?

## Warning Signs Your Network Needs Attention

### Frequent Downtime

If your team regularly experiences network outages or slowdowns, it's a clear sign your infrastructure can't handle current demands.

### Slow Performance

Long file transfer times, sluggish application performance, and buffering during video calls all indicate insufficient bandwidth or outdated equipment.

### Security Vulnerabilities

Older networking equipment may no longer receive security updates, leaving your business exposed to cyber threats.

### Scalability Issues

Struggling to add new users or devices? Your network should grow with your business, not hold it back.

### Lack of Remote Work Support

In today's hybrid work environment, your network must reliably support remote access and cloud applications.

## Planning Your Network Upgrade

### 1. Assess Current State

Start with a comprehensive network audit to understand:

- Current bandwidth utilization
- Hardware age and capabilities
- Security posture
- Application requirements
- Future growth plans

### 2. Define Requirements

Consider your business needs for the next 3-5 years:

- Number of users and devices
- Bandwidth requirements for applications
- Remote access needs
- Security requirements
- Budget constraints

### 3. Choose the Right Technology

Modern network infrastructure includes:

- **Gigabit Ethernet**: Faster wired connections for high-bandwidth applications
- **Wi-Fi 6**: Latest wireless standard with improved speed and capacity
- **SD-WAN**: Software-defined networking for better performance and flexibility
- **Cloud-managed networking**: Simplified management and monitoring

### 4. Implement in Phases

A phased approach minimizes disruption:

1. Core infrastructure (switches, routers)
2. Wireless access points
3. Security devices
4. Monitoring and management tools

### 5. Test Thoroughly

Before going live, thoroughly test:

- Performance under load
- Failover capabilities
- Security controls
- Remote access

## The Business Impact

Upgrading your network infrastructure delivers measurable benefits:

- **Productivity gains**: Faster network speeds mean less time waiting
- **Improved reliability**: Modern equipment means fewer outages
- **Better security**: Current technology includes advanced security features
- **Cost savings**: Energy-efficient equipment and reduced downtime
- **Future-ready**: Capacity for growth and new technologies

## Working with Professionals

Network upgrades are complex projects. Working with experienced IT professionals ensures:

- Proper planning and design
- Minimal business disruption
- Optimal technology choices
- Professional installation and configuration
- Ongoing support and optimization

## Conclusion

Don't let outdated network infrastructure hold your business back. The right upgrade at the right time can transform your operations and position you for future growth.

Ready to discuss your network infrastructure needs? Contact BDKinc for a free network assessment.`,
  },
];

const defaultTestimonials: SeedTestimonialInput[] = [
  {
    slug: 'national-manufacturing',
    quote:
      'BDKinc transformed our entire IT infrastructure. Their premier managed services have been instrumental in our national growth, providing the rock-solid reliability we need.',
    author: 'Operations Director',
    company: 'National Manufacturing Corp',
    industry: 'Manufacturing',
    order: 1,
  },
  {
    slug: 'global-logistics',
    quote:
      "The team's expertise with IBM Power systems and watsonx is truly unmatched. They've helped us modernize legacy applications into high-performance cloud assets.",
    author: 'Chief Technology Officer',
    company: 'Global Logistics Group',
    industry: 'Distribution',
    order: 2,
  },
  {
    slug: 'regional-health',
    quote:
      'Their cybersecurity solutions give us absolute peace of mind. We trust BDKinc to protect our sensitive healthcare data and maintain complex compliance standards.',
    author: 'Compliance Officer',
    company: 'Regional Health Network',
    industry: 'Healthcare',
    order: 3,
  },
  {
    slug: 'financial-services',
    quote:
      'BDKinc brought structure and clarity to our security and governance program. We reduced risk, improved audit readiness, and gained confidence in our day-to-day operations.',
    author: 'Chief Financial Officer',
    company: 'Financial Services Firm',
    industry: 'Financial Services',
    order: 4,
  },
  {
    slug: 'education-nonprofit',
    quote:
      'BDKinc streamlined our support operations and standardized our endpoint management. We now spend less time firefighting and more time serving our community.',
    author: 'Executive Director',
    company: 'Education Nonprofit',
    industry: 'Nonprofit',
    order: 5,
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

async function ensureBlogPost(payload: Payload, post: SeedBlogPostInput) {
  const payloadAPI = payload as any;

  const existing = await payloadAPI.find({
    collection: 'blog-posts',
    where: {
      slug: {
        equals: post.slug,
      },
    },
    limit: 1,
    depth: 0,
  });

  if (existing.docs.length > 0) {
    return;
  }

  await payloadAPI.create({
    collection: 'blog-posts',
    data: {
      title: post.title,
      slug: post.slug,
      description: post.description,
      author: post.author,
      publishedAt: post.publishedAt,
      category: post.category,
      tags: post.tags.map((tag) => ({ tag })),
      content: post.content,
      _status: 'published',
    },
  });
}

async function ensureTestimonial(payload: Payload, testimonial: SeedTestimonialInput) {
  const payloadAPI = payload as any;

  const existing = await payloadAPI.find({
    collection: 'testimonials',
    where: {
      slug: {
        equals: testimonial.slug,
      },
    },
    limit: 1,
    depth: 0,
  });

  if (existing.docs.length > 0) {
    return;
  }

  await payloadAPI.create({
    collection: 'testimonials',
    data: {
      slug: testimonial.slug,
      quote: testimonial.quote,
      author: testimonial.author,
      company: testimonial.company,
      industry: testimonial.industry,
      order: testimonial.order,
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

  if (aboutDoc) {
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
        aboutCTAButtonText:
          aboutDoc.aboutCTAButtonText || 'Talk to an Engineer',
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

  for (const post of defaultBlogPosts) {
    await ensureBlogPost(payload, post);
  }

  for (const testimonial of defaultTestimonials) {
    await ensureTestimonial(payload, testimonial);
  }
}
