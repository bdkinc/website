import React from 'react';
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
        <div className="relative z-10 flex flex-col items-center justify-center p-8 sm:p-12 text-center h-full">
          <div className="mb-6 p-4 rounded-full bg-primary/10 border border-primary/20 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
            <PiRocket className="h-10 w-10 text-primary" />
          </div>
          
          <h2 className="mb-4 text-3xl font-bold font-display text-foreground uppercase tracking-tight">
            Our Mission
          </h2>
          
          <p className="max-w-md mx-auto text-lg text-muted-foreground leading-relaxed">
            To architect and secure the digital infrastructure that powers the world's most ambitious enterprises. We elevate technology from a utility to a strategic driver of unconstrained growth.
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
        <div className="relative z-10 flex flex-col items-center justify-center p-8 sm:p-12 text-center h-full">
          <div className="mb-6 p-4 rounded-full bg-secondary/10 border border-secondary/20 group-hover:scale-110 group-hover:bg-secondary/20 transition-all duration-500">
            <PiEye className="h-10 w-10 text-secondary" />
          </div>
          
          <h2 className="mb-4 text-3xl font-bold font-display text-foreground uppercase tracking-tight">
            Our Vision
          </h2>
          
          <p className="max-w-md mx-auto text-lg text-muted-foreground leading-relaxed">
            To set the global standard for technical excellence, where elite expertise meets the reliability of industry giants to solve the most complex business challenges.
          </p>
        </div>
      </ServiceCard>
    </div>
  );
}
