import { cn } from '@/lib/utils';
import { PiLightning, PiShieldCheck, PiUsers } from 'react-icons/pi';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { ServiceCard } from '@/components/ServiceCard';
import TechnicalSection from './TechnicalSection';

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
      title: "Fast Response",
      description: "Quick turnaround times with dedicated support staff available 24/7.",
      highlight: "support",
      metadata: "RT_ANALYSIS_V2.4"
    },
    {
      icon: PiShieldCheck,
      title: "Proven Expertise",
      description: "Over 25 years of experience delivering reliable IT solutions.",
      highlight: "experience",
      metadata: "EXP_LOG_NODE_A"
    },
    {
      icon: PiUsers,
      title: "Personalized Service",
      description: "Dedicated team that understands your unique business needs.",
      highlight: "business",
      metadata: "USER_SPEC_V1.1"
    }
  ];

  return (
    <TechnicalSection  id="why-choose-us" overlayOpacity="opacity-10">
      <div
        ref={headerRef as any}
        className={cn(
          'mb-16 text-center',
          'translate-y-8 opacity-0 transition-[opacity,transform] duration-700 ease-out',
          headerInView && 'translate-y-0 opacity-100'
        )}
      >
        <h2 className="mb-4 text-4xl font-bold md:text-5xl font-display uppercase tracking-tight">
          <span className="text-foreground">Why Choose </span>
          <span className="from-primary to-secondary bg-linear-to-br bg-clip-text font-extrabold text-transparent">
            BDKinc
          </span>
          <span>?</span>
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl font-sans mt-4">
          Technical authority <span className="text-primary">refined over decades</span>.
        </p>
      </div>

      <div
        ref={gridRef as any}
        className="grid grid-cols-1 gap-8 md:grid-cols-3"
      >
        {reasons.map((reason, index) => (
          <ServiceCard
            key={index}
            variant="technical"
            interactive
            delay={index * 150}
            metadata={reason.metadata}
            animated={gridInView}
          >
            <div className="p-8 flex flex-col items-center text-center h-full">
              <div className="mb-6 h-16 w-16 items-center justify-center rounded-xl from-primary/10 to-secondary/10 bg-linear-to-br flex border border-primary/20 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500 shadow-[0_0_15px_rgba(0,212,255,0.1)]">
                <reason.icon className="h-8 w-8 text-primary" aria-hidden />
              </div>
              <h3 className="text-foreground text-2xl font-bold mb-4 font-display uppercase tracking-tight">
                {reason.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {reason.description.split(reason.highlight)[0]}
                <span className="text-primary font-semibold">{reason.highlight}</span>
                {reason.description.split(reason.highlight)[1]}
              </p>
            </div>
          </ServiceCard>
        ))}
      </div>
    </TechnicalSection>
  );
}
