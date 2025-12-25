import React from 'react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { PiTarget, PiLightbulb, PiShield, PiUsers, PiMedal, PiClock, PiPackage } from 'react-icons/pi';
import { ServiceCard } from '@/components/ServiceCard';

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

interface CoreProtocolsProps {
  values: ValueItem[];
}

const iconMap: Record<string, React.ElementType> = {
  Target: PiTarget,
  Lightbulb: PiLightbulb,
  Shield: PiShield,
  Users: PiUsers,
  Award: PiMedal,
  Clock: PiClock,
  Box: PiPackage,
};

export default function CoreProtocols({ values }: CoreProtocolsProps) {
  const { ref: containerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={containerRef as any} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {values.map((value, index) => {
        const IconComponent = iconMap[value.icon] || PiPackage;
        
        return (
          <ServiceCard
            key={index}
            variant="technical"
            interactive
            delay={index * 100}
            metadata={`PROTOCOL_0${index + 1}`}
            animated={isIntersecting}
          >
            <div className="relative z-10 p-6 text-left">
              <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/5 border border-primary/10 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all">
                <IconComponent className="h-6 w-6 text-primary" />
              </div>
              
              <h3 className="mb-3 text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">
                {value.title}
              </h3>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          </ServiceCard>
        );
      })}
    </div>
  );
}
