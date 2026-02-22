import { cn } from '@bdkinc/design-system';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import FeatureCarousel from '@/components/FeatureCarousel';

const reasons = [
  {
    icon: 'Lightning' as const,
    title: 'Fast Response',
    description:
      'Quick turnaround times with dedicated support staff available 24/7.',
    highlight: 'support',
    detail:
      'When incidents happen, minutes matter. We route alerts, triage fast, and keep you operational—with clear communication at every step.',
  },
  {
    icon: 'ShieldCheck' as const,
    title: 'Proven Expertise',
    description:
      'Over 25 years of experience delivering reliable IT solutions.',
    highlight: 'experience',
    detail:
      'We build and run production systems across infrastructure, cloud, and security. You get battle-tested processes—not guesswork.',
  },
  {
    icon: 'Users' as const,
    title: 'Personalized Service',
    description: 'Dedicated team that understands your unique business needs.',
    highlight: 'business',
    detail:
      'Your environment is documented, your stakeholders are known, and your roadmap is intentional. We operate like an extension of your team.',
  },
];

export default function WhyChooseUs() {
  const { ref: headerRef, isIntersecting: headerInView } =
    useIntersectionObserver({
      threshold: 0.2,
      rootMargin: '0px',
      triggerOnce: true,
    });

  return (
    <section
      id="why-choose-us"
      className="bg-muted/30 relative px-4 py-20 sm:px-6 lg:px-8 dark:bg-transparent"
    >
      <div className="via-border/60 absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-linear-to-r from-transparent to-transparent" />

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
            <span className="text-foreground">Why choose </span>
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

        <FeatureCarousel features={reasons} />
      </div>
    </section>
  );
}
