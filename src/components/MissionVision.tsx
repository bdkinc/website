import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { PiRocket, PiEye } from 'react-icons/pi';
import { ServiceCard } from '@/components/ServiceCard';

export default function MissionVision() {
  const { ref: containerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div ref={containerRef as any} className="grid gap-8 md:grid-cols-2">
      {/* Mission Card */}
      <ServiceCard
        variant="technical"
        interactive
        delay={0}
        metadata="STRATEGIC_MISSION_V1.0"
        animated={isIntersecting}
      >
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center sm:p-12">
          <div className="bg-primary/10 border-primary/20 group-hover:bg-primary/20 mb-6 rounded-full border p-4 transition-all duration-500 group-hover:scale-110">
            <PiRocket className="text-primary h-10 w-10" />
          </div>

          <h2 className="font-display text-foreground mb-4 text-3xl font-bold tracking-tight">
            Our Mission
          </h2>

          <p className="text-muted-foreground mx-auto max-w-md text-lg leading-relaxed">
            To architect and secure the digital infrastructure that powers the
            world&apos;s most ambitious enterprises. We elevate technology from
            a utility to a strategic driver of unconstrained growth.
          </p>
        </div>
      </ServiceCard>

      {/* Vision Card */}
      <ServiceCard
        variant="technical"
        interactive
        delay={200}
        metadata="ENTERPRISE_VISION_V1.0"
        animated={isIntersecting}
      >
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center sm:p-12">
          <div className="bg-secondary/10 border-secondary/20 group-hover:bg-secondary/20 mb-6 rounded-full border p-4 transition-all duration-500 group-hover:scale-110">
            <PiEye className="text-secondary h-10 w-10" />
          </div>

          <h2 className="font-display text-foreground mb-4 text-3xl font-bold tracking-tight">
            Our Vision
          </h2>

          <p className="text-muted-foreground mx-auto max-w-md text-lg leading-relaxed">
            To set the global standard for technical excellence, where premier
            expertise meets the reliability of industry giants to solve the most
            complex business challenges.
          </p>
        </div>
      </ServiceCard>
    </div>
  );
}
