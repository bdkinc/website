import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { PiQuotesFill } from 'react-icons/pi';
import { ServiceCard } from '@/components/ServiceCard';

const testimonials = [
  {
    quote: "BDKinc transformed our entire IT infrastructure. Their elite managed services have been instrumental in our national growth, providing the rock-solid reliability we need.",
    author: "Operations Director",
    company: "National Manufacturing Corp",
    industry: "Manufacturing",
    metadata: "LOG_REF_MFR_09"
  },
  {
    quote: "The team's expertise with IBM Power systems and watsonx is truly unmatched. They've helped us modernize legacy applications into high-performance cloud assets.",
    author: "Chief Technology Officer",
    company: "Global Logistics Group",
    industry: "Distribution",
    metadata: "LOG_REF_DIST_22"
  },
  {
    quote: "Their cybersecurity solutions give us absolute peace of mind. We trust BDKinc to protect our sensitive healthcare data and maintain complex compliance standards.",
    author: "Compliance Officer",
    company: "Regional Health Network",
    industry: "Healthcare",
    metadata: "LOG_REF_HC_14"
  }
];

export default function Testimonials() {
  const { ref: headerRef, isIntersecting: headerInView } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { ref: gridRef, isIntersecting: gridInView } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="mx-auto max-w-7xl relative z-10">
        <div
          ref={headerRef as any}
          className={cn(
            'mb-16 text-center transition-all duration-700 ease-out',
            headerInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <h2 className="mb-4 text-4xl font-bold font-display md:text-5xl uppercase tracking-tight">
            Client <span className="text-primary">Success</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl font-sans mt-4">
            Real outcomes for organizations with <span class="text-primary">mission-critical</span> needs.
          </p>
        </div>

        <div
          ref={gridRef as any}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {testimonials.map((t, index) => (
            <ServiceCard
              key={index}
              variant="technical"
              interactive
              delay={index * 200}
              metadata={t.metadata}
              animated={gridInView}
            >
              <div className="relative z-10 flex flex-col p-8 text-left h-full">
                <PiQuotesFill className="text-primary/20 text-4xl mb-6" />
                
                <div className="flex-grow">
                  <p className="text-lg leading-relaxed italic text-foreground/90 font-sans mb-8">
                    "{t.quote}"
                  </p>
                </div>

                <div className="border-t border-border/40 pt-6 mt-auto">
                  <div className="font-bold text-foreground font-display text-sm uppercase tracking-wider">
                    {t.author}
                  </div>
                  <div className="text-muted-foreground text-xs font-sans">
                    {t.company}
                  </div>
                  <div className="text-primary mt-2 text-[10px] font-bold uppercase tracking-[0.1em]">
                    {t.industry}
                  </div>
                </div>
              </div>
            </ServiceCard>
          ))}
        </div>
      </div>
    </section>
  );
}
