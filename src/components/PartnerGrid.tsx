import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { TechCard } from '@/components/TechCard';

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
        <TechCard
          key={partner.name}
          variant="technical"
          interactive
          delay={index * 100}
          metadata={`NODE_ID_${partner.name.toUpperCase()}`}
          animated={gridInView}
        >
          <div className="relative z-10 flex h-full flex-col p-6 text-left">
            <div className="from-primary/5 to-secondary/5 group-hover:from-primary/10 group-hover:to-secondary/10 mb-6 flex h-20 items-center justify-center rounded-md border border-white/5 bg-gradient-to-br transition-colors">
              <span className="text-primary font-display text-3xl font-bold tracking-tight">
                {partner.name}
              </span>
            </div>

            <div className="mt-auto">
              <div className="mb-2 flex items-center gap-2">
                <div className="bg-primary h-1 w-1 rounded-full" />
                <span className="text-primary/80 font-mono text-xs tracking-wider uppercase">
                  {partner.category}
                </span>
              </div>
              <h3 className="text-foreground group-hover:text-primary font-display text-sm font-bold tracking-tight uppercase transition-colors">
                {partner.description}
              </h3>
            </div>
          </div>
        </TechCard>
      ))}
    </div>
  );
}
