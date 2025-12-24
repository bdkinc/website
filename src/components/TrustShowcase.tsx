import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { Card } from '@/components/ui/card';

const partners = [
  { 
    name: 'IBM', 
    description: 'Business Partner & watsonx Specialist',
    detail: 'Legendary reliability and enterprise AI systems.'
  },
  { 
    name: 'Microsoft', 
    description: 'Cloud & Productivity Solutions',
    detail: 'Seamless Azure and Microsoft 365 integration.'
  },
  { 
    name: 'Cisco', 
    description: 'Networking & Security Infrastructure',
    detail: 'The world\'s most robust connectivity backbone.'
  },
  { 
    name: 'Lenovo', 
    description: 'Enterprise Hardware Systems',
    detail: 'High-performance computing for modern business.'
  }
];

export default function TrustShowcase() {
  const { ref: headerRef, isIntersecting: headerInView } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { ref: gridRef, isIntersecting: gridInView } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8 border-t border-border/20">
      <div className="mx-auto max-w-7xl">
        <div
          ref={headerRef as any}
          className={cn(
            'mb-16 text-center transition-all duration-700 ease-out',
            headerInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <h2 className="mb-4 text-3xl font-bold font-display uppercase tracking-wider text-muted-foreground">
            Trusted by Industry Giants
          </h2>
          <div className="mx-auto h-1 w-20 bg-primary/40" />
        </div>

        <div
          ref={gridRef as any}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {partners.map((partner, index) => (
            <Card
              key={partner.name}
              className={cn(
                'relative flex flex-col justify-between overflow-hidden border-border/40 bg-card/40 p-6 backdrop-blur-sm transition-all duration-500',
                gridInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="scanlines absolute inset-0 opacity-[0.02]" />
              
              <div className="relative z-10">
                <div className="mb-4 text-2xl font-bold font-display tracking-tighter text-primary">
                  {partner.name}
                </div>
                <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-foreground">
                  {partner.description}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground font-sans">
                  {partner.detail}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <div className="h-px flex-1 bg-primary/20" />
                <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
              </div>
            </Card>
          ))}
        </div>

        {/* Certifications Row */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-50 grayscale transition-opacity hover:opacity-100">
          {['SOC 2 COMPLIANT', 'HIPAA READY', 'PCI-DSS CERTIFIED'].map((cert) => (
            <div key={cert} className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] font-display">
              <div className="h-1 w-1 rounded-full bg-primary" />
              {cert}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
