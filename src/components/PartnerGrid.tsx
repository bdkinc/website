import React from 'react';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { ServiceCard } from '@/components/ServiceCard';

interface Partner {
  name: string;
  description: string;
  category: string;
}

interface PartnerGridProps {
  partners: Partner[];
}

export default function PartnerGrid({ partners }: PartnerGridProps) {
  const { ref: gridRef, isIntersecting: gridInView } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div
      ref={gridRef as any}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {partners.map((partner, index) => (
        <ServiceCard
          key={partner.name}
          variant="technical"
          interactive
          delay={index * 100}
          metadata={`NODE_ID_${partner.name.toUpperCase()}`}
          animated={gridInView}
        >
          <div className="relative z-10 flex flex-col h-full p-6 text-left">
            <div className="mb-6 flex items-center justify-center h-20 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-md border border-white/5 group-hover:from-primary/10 group-hover:to-secondary/10 transition-colors">
              <span className="text-primary font-display font-bold text-3xl tracking-tight">
                {partner.name}
              </span>
            </div>
            
            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-2">
                 <div className="h-1 w-1 rounded-full bg-primary" />
                 <span className="text-xs font-mono text-primary/80 uppercase tracking-wider">
                   {partner.category}
                 </span>
              </div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight font-display">
                {partner.description}
              </h3>
            </div>
          </div>
        </ServiceCard>
      ))}
    </div>
  );
}
