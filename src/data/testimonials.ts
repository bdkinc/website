export interface Testimonial {
  quote: string;
  author: string;
  company: string;
  industry: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'BDKinc transformed our entire IT infrastructure. Their premiere managed services have been instrumental in our national growth, providing the rock-solid reliability we need.',
    author: 'Operations Director',
    company: 'National Manufacturing Corp',
    industry: 'Manufacturing',
  },
  {
    quote:
      "The team's expertise with IBM Power systems and watsonx is truly unmatched. They've helped us modernize legacy applications into high-performance cloud assets.",
    author: 'Chief Technology Officer',
    company: 'Global Logistics Group',
    industry: 'Distribution',
  },
  {
    quote:
      'Their cybersecurity solutions give us absolute peace of mind. We trust BDKinc to protect our sensitive healthcare data and maintain complex compliance standards.',
    author: 'Compliance Officer',
    company: 'Regional Health Network',
    industry: 'Healthcare',
  },
];
