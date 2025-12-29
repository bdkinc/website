export interface Testimonial {
  quote: string;
  author: string;
  company: string;
  industry: string;
  metadata: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'BDKinc transformed our entire IT infrastructure. Their premiere managed services have been instrumental in our national growth, providing the rock-solid reliability we need.',
    author: 'Operations Director',
    company: 'National Manufacturing Corp',
    industry: 'Manufacturing',
    metadata: 'LOG_REF_MFR_09',
  },
  {
    quote:
      "The team's expertise with IBM Power systems and watsonx is truly unmatched. They've helped us modernize legacy applications into high-performance cloud assets.",
    author: 'Chief Technology Officer',
    company: 'Global Logistics Group',
    industry: 'Distribution',
    metadata: 'LOG_REF_DIST_22',
  },
  {
    quote:
      'Their cybersecurity solutions give us absolute peace of mind. We trust BDKinc to protect our sensitive healthcare data and maintain complex compliance standards.',
    author: 'Compliance Officer',
    company: 'Regional Health Network',
    industry: 'Healthcare',
    metadata: 'LOG_REF_HC_14',
  },
];
