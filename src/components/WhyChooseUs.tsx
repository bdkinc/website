import { cn } from '@/lib/utils';
import { PiLightning, PiShieldCheck, PiUsers } from 'react-icons/pi';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { ServiceCard } from '@/components/ServiceCard';

export default function WhyChooseUs() {
  // Viewport detection for section header
  const { ref: headerRef, isIntersecting: headerInView } =
    useIntersectionObserver({
      threshold: 0.2,
      rootMargin: '0px',
      triggerOnce: true,
    });

  // Viewport detection for features grid
  const { ref: gridRef, isIntersecting: gridInView } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true,
  });

  const reasons = [
    {
      icon: PiLightning,
      title: 'Fast Response',
      description:
        'Quick turnaround times with dedicated support staff available 24/7.',
      highlight: 'support',
    },
    {
      icon: PiShieldCheck,
      title: 'Proven Expertise',
      description:
        'Over 25 years of experience delivering reliable IT solutions.',
      highlight: 'experience',
    },
    {
      icon: PiUsers,
      title: 'Personalized Service',
      description:
        'Dedicated team that understands your unique business needs.',
      highlight: 'business',
    },
  ];

  return (
    <section id="why-choose-us" className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="via-primary/20 absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-linear-to-r from-transparent to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div
          ref={headerRef as any}
          className={cn(
            'mb-16 text-center',
            'translate-y-8 opacity-0 transition-[opacity,transform] duration-700 ease-out',
            headerInView && 'translate-y-0 opacity-100'
          )}
        >
          <h2 className="font-display mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            <span className="text-foreground uppercase">Why Choose </span>
            <span className="from-primary to-secondary bg-linear-to-br bg-clip-text font-extrabold text-transparent">
              <span className="font-extrabold">BDK</span>inc?
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl font-sans text-xl">
            Technical authority{' '}
            <span className="text-accent font-semibold">
              refined over decades
            </span>
            .
          </p>
        </div>

        <div
          ref={gridRef as any}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {reasons.map((reason, index) => (
            <ServiceCard
              key={index}
              variant="simple"
              interactive
              delay={index * 150}
              animated={gridInView}
            >
              <div className="flex h-full flex-col items-center p-8 text-center">
                <div className="from-primary/10 to-secondary/10 border-primary/20 group-hover:border-primary/50 mb-6 flex h-16 w-16 items-center justify-center rounded-xl border bg-linear-to-br shadow-[0_0_15px_rgba(0,212,255,0.1)] transition-all duration-500 group-hover:scale-110">
                  <reason.icon className="text-primary h-8 w-8" aria-hidden />
                </div>
                <h3 className="text-foreground font-display mb-4 text-2xl font-bold tracking-tight uppercase">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {reason.description.split(reason.highlight)[0]}
                  <span className="text-primary font-semibold">
                    {reason.highlight}
                  </span>
                  {reason.description.split(reason.highlight)[1]}
                </p>

                <div className="mt-auto flex w-full items-center justify-center gap-2 pt-8">
                  {/* Center-aligned: Bar + Circle + Bar */}
                  <div className="bg-primary/20 group-hover:bg-primary/50 h-1 w-8 rounded-full transition-all duration-500 group-hover:w-12" />
                  <div
                    className="bg-primary/20 group-hover:bg-primary/50 h-2 w-2 rounded-full transition-colors duration-500"
                    aria-hidden
                  />
                  <div className="bg-primary/20 group-hover:bg-primary/50 h-1 w-8 rounded-full transition-all duration-500 group-hover:w-12" />
                </div>
              </div>
            </ServiceCard>
          ))}
        </div>
      </div>
    </section>
  );
}
