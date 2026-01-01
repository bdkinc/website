import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { PiQuotesFill } from 'react-icons/pi';
import { ServiceCard } from '@/components/ServiceCard';

const testimonials = [
  {
    quote:
      'BDKinc transformed our entire IT infrastructure. Their premier managed services have been instrumental in our national growth, providing the rock-solid reliability we need.',
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

export default function Testimonials() {
  const { ref: headerRef, isIntersecting: headerInView } =
    useIntersectionObserver({
      threshold: 0.2,
      triggerOnce: true,
    });

  const { ref: gridRef, isIntersecting: gridInView } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className="bg-background relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="via-primary/20 absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-linear-to-r from-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div
          ref={headerRef as any}
          className={cn(
            'mb-16 text-center transition-all duration-700 ease-out',
            headerInView
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          )}
        >
          <h2 className="font-display mb-4 text-4xl font-bold tracking-tight uppercase md:text-5xl">
            <span className="text-foreground">Client </span>
            <span className="from-primary to-secondary bg-linear-to-br bg-clip-text text-transparent">
              Success
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl font-sans text-xl">
            Real outcomes for organizations with{' '}
            <span className="text-accent font-semibold">mission-critical</span>{' '}
            needs.
          </p>
        </div>

        <div
          ref={gridRef as any}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {testimonials.map((t, index) => (
            <ServiceCard
              key={index}
              variant="simple"
              interactive
              delay={index * 200}
              animated={gridInView}
            >
              <div className="relative z-10 flex h-full flex-col p-8 text-left">
                <PiQuotesFill className="text-primary/20 mb-6 text-4xl" />

                <div className="flex-grow">
                  <p className="text-foreground/90 mb-8 font-sans text-lg leading-relaxed italic">
                    &quot;{t.quote}&quot;
                  </p>
                </div>

                <div className="border-border/40 mt-auto border-t pt-6">
                  <div className="text-foreground font-display text-sm font-bold tracking-wider uppercase">
                    {t.author}
                  </div>
                  <div className="text-muted-foreground font-sans text-xs">
                    {t.company}
                  </div>
                  <div className="text-primary mt-2 text-[10px] font-bold tracking-[0.1em] uppercase">
                    {t.industry}
                  </div>

                  <div className="mt-6 flex w-full items-center justify-start gap-2">
                    <div className="bg-secondary/20 group-hover:bg-secondary/50 h-2 w-2 rounded-full transition-colors duration-500" />
                    <div className="bg-secondary/20 group-hover:bg-secondary/50 h-1 w-12 rounded-full transition-all duration-500 group-hover:w-20" />
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
